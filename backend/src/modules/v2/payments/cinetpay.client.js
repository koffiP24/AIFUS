const crypto = require("crypto");
const { URL } = require("url");

const { HttpError } = require("../common/httpError");
const { sanitizeForJson } = require("./paymentSerialization");

const CINETPAY_API_BASE_URL = "https://api-checkout.cinetpay.com";

const getCinetpayApiKey = () => String(process.env.CINETPAY_API_KEY || "").trim();
const getCinetpaySiteId = () => String(process.env.CINETPAY_SITE_ID || "").trim();
const getCinetpaySecretKey = () => String(process.env.CINETPAY_SECRET_KEY || "").trim();
const getCinetpayCountryCode = () =>
  String(process.env.CINETPAY_COUNTRY_CODE || "CI").trim().toUpperCase();

const hasCinetpayConfig = () => Boolean(getCinetpayApiKey() && getCinetpaySiteId());

const ensureCinetpayConfig = () => {
  if (!getCinetpayApiKey()) {
    throw new HttpError(
      500,
      "Configuration CinetPay incomplete. CINETPAY_API_KEY manquant.",
    );
  }

  if (!getCinetpaySiteId()) {
    throw new HttpError(
      500,
      "Configuration CinetPay incomplete. CINETPAY_SITE_ID manquant.",
    );
  }
};

const ensureCinetpayWebhookSecret = () => {
  if (!getCinetpaySecretKey()) {
    throw new HttpError(
      500,
      "Configuration CinetPay incomplete. CINETPAY_SECRET_KEY manquant.",
    );
  }
};

const buildUrlFromBase = (baseValue, fallbackPath) => {
  const url = new URL(baseValue || process.env.FRONTEND_URL || "http://localhost:5173");

  if (!url.pathname || url.pathname === "/") {
    url.pathname = fallbackPath;
  }

  return url;
};

const assertCinetpayPublicUrl = (url, label) => {
  const hostname = String(url.hostname || "").trim().toLowerCase();

  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1") {
    throw new HttpError(
      500,
      `${label} CinetPay doit etre une URL publique. CinetPay refuse localhost.`,
    );
  }
};

const buildCinetpayReturnUrl = (orderReference, paymentReference) => {
  const url = buildUrlFromBase(
    process.env.CINETPAY_RETURN_URL || null,
    "/api/v2/payments/return",
  );

  assertCinetpayPublicUrl(url, "L'URL de retour");
  url.searchParams.set("provider", "cinetpay");
  url.searchParams.set("orderReference", orderReference);
  url.searchParams.set("paymentReference", paymentReference);

  return url.toString();
};

const buildCinetpayNotificationUrl = () => {
  const url = buildUrlFromBase(
    process.env.CINETPAY_NOTIFY_URL || process.env.CINETPAY_WEBHOOK_URL || null,
    "/api/v2/payments/webhook",
  );

  assertCinetpayPublicUrl(url, "L'URL de notification");
  url.searchParams.set("provider", "cinetpay");

  return url.toString();
};

const normalizeCinetpayPhoneNumber = (rawPhone, countryCode = "CI") => {
  const phone = String(rawPhone || "").trim();
  const normalizedCountryCode = String(countryCode || "CI").trim().toUpperCase();

  if (!phone) {
    return null;
  }

  const digits = phone.replace(/\D/g, "");

  if (!digits) {
    return null;
  }

  if (normalizedCountryCode === "CI") {
    if (/^2250\d{9}$/.test(digits)) {
      return digits;
    }

    if (/^0\d{9}$/.test(digits)) {
      return `225${digits}`;
    }

    return null;
  }

  return digits;
};

const sanitizeDescription = (value) =>
  String(value || "Paiement AIFUS")
    .replace(/[#$\/_&]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);

const createProviderError = (message, responseData, status = null) => {
  const error = new Error(message);
  error.response = {
    status,
    data: responseData,
  };
  return error;
};

const postCinetpayJson = async (path, payload) => {
  const response = await fetch(`${CINETPAY_API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "AIFUS-Ticketing/1.0",
    },
    body: JSON.stringify(payload),
  });

  const rawBody = await response.text();
  let data = null;

  try {
    data = rawBody ? JSON.parse(rawBody) : null;
  } catch (_error) {
    data = rawBody ? { rawBody } : null;
  }

  if (!response.ok) {
    throw createProviderError(
      data?.message || `CinetPay request failed with status ${response.status}`,
      data,
      response.status,
    );
  }

  return data;
};

const buildCinetpayRequestPayload = ({ order, paymentReference }) => {
  ensureCinetpayConfig();

  if (order.currency !== "USD" && order.totalAmount % 5 !== 0) {
    throw new HttpError(
      400,
      "CinetPay exige un montant multiple de 5 pour cette devise.",
    );
  }

  const payload = {
    apikey: getCinetpayApiKey(),
    site_id: getCinetpaySiteId(),
    transaction_id: paymentReference,
    amount: order.totalAmount,
    currency: order.currency,
    description: sanitizeDescription(`Billetterie AIFUS - ${order.reference}`),
    notify_url: buildCinetpayNotificationUrl(),
    return_url: buildCinetpayReturnUrl(order.reference, paymentReference),
    channels: String(process.env.CINETPAY_CHANNELS || "ALL").trim().toUpperCase(),
    lang: String(process.env.CINETPAY_LANG || "fr").trim().toUpperCase(),
    metadata: JSON.stringify({
      orderReference: order.reference,
      paymentReference,
      orderId: order.id,
    }),
    customer_id: order.userId || order.customerEmail,
    customer_name: order.customerLastName || "Client",
    customer_surname: order.customerFirstName || "AIFUS",
    customer_email: order.customerEmail,
  };

  const phoneNumber = normalizeCinetpayPhoneNumber(
    order.customerPhone,
    getCinetpayCountryCode(),
  );

  if (phoneNumber) {
    payload.customer_phone_number = phoneNumber;
  }

  return payload;
};

const createCinetpayPaymentSession = async ({ order, paymentReference }) => {
  const requestPayload = buildCinetpayRequestPayload({ order, paymentReference });
  const response = await postCinetpayJson("/v2/payment", requestPayload);

  if (String(response?.code || "") !== "201" || !response?.data?.payment_url) {
    throw createProviderError(
      response?.description ||
        response?.message ||
        "La creation de la transaction CinetPay a echoue.",
      response,
      400,
    );
  }

  return {
    transactionId: paymentReference,
    transactionReference: paymentReference,
    status: "PENDING",
    paymentUrl: response.data.payment_url,
    paymentToken: response.data.payment_token || null,
    apiResponseId: response.api_response_id || null,
    returnUrl: requestPayload.return_url,
    notifyUrl: requestPayload.notify_url,
    rawRequest: sanitizeForJson(requestPayload),
    rawResponse: sanitizeForJson(response),
  };
};

const retrieveCinetpayTransaction = async (transactionReference) => {
  ensureCinetpayConfig();

  return postCinetpayJson("/v2/payment/check", {
    apikey: getCinetpayApiKey(),
    site_id: getCinetpaySiteId(),
    transaction_id: transactionReference,
  });
};

const buildCinetpayNotificationToken = (payload) => {
  ensureCinetpayWebhookSecret();

  const data = [
    payload?.cpm_site_id,
    payload?.cpm_trans_id,
    payload?.cpm_trans_date,
    payload?.cpm_amount,
    payload?.cpm_currency,
    payload?.signature,
    payload?.payment_method,
    payload?.cel_phone_num,
    payload?.cpm_phone_prefixe,
    payload?.cpm_language,
    payload?.cpm_version,
    payload?.cpm_payment_config,
    payload?.cpm_page_action,
    payload?.cpm_custom,
    payload?.cpm_designation,
    payload?.cpm_error_message,
  ]
    .map((value) => String(value || ""))
    .join("");

  return crypto
    .createHmac("sha256", getCinetpaySecretKey())
    .update(data)
    .digest("hex");
};

const verifyCinetpayNotificationToken = (payload, receivedToken) => {
  ensureCinetpayWebhookSecret();

  if (!receivedToken) {
    return false;
  }

  const expectedToken = buildCinetpayNotificationToken(payload);
  const expectedBuffer = Buffer.from(expectedToken);
  const receivedBuffer = Buffer.from(String(receivedToken || ""));

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
};

const buildCinetpayWebhookPayload = ({
  verification,
  transactionReference,
  notificationBody = null,
  fallbackAmount,
  fallbackCurrency,
  eventReference = null,
}) => {
  const providerStatus = String(
    verification?.data?.status || notificationBody?.cpm_error_message || "PENDING",
  )
    .trim()
    .toUpperCase();

  const amount =
    Number.parseInt(verification?.data?.amount, 10) ||
    Number.parseInt(fallbackAmount, 10) ||
    0;

  const currency = String(
    verification?.data?.currency || fallbackCurrency || "XOF",
  )
    .trim()
    .toUpperCase();

  return {
    provider: "CINETPAY",
    eventReference:
      eventReference || `CINETPAY-${transactionReference}-${providerStatus || "PENDING"}`,
    transactionReference,
    status: providerStatus,
    amount,
    currency,
    providerPaymentId:
      verification?.api_response_id ||
      verification?.data?.operator_id ||
      null,
    failureReason:
      providerStatus === "REFUSED"
        ? notificationBody?.cpm_error_message ||
          verification?.message ||
          verification?.description ||
          "Paiement refuse"
        : null,
    rawPayload: {
      notification: sanitizeForJson(notificationBody),
      verification: sanitizeForJson(verification),
    },
  };
};

module.exports = {
  hasCinetpayConfig,
  normalizeCinetpayPhoneNumber,
  createCinetpayPaymentSession,
  retrieveCinetpayTransaction,
  verifyCinetpayNotificationToken,
  buildCinetpayWebhookPayload,
};
