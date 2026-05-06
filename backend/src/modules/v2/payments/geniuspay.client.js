const crypto = require("crypto");
const { URL } = require("url");

const { HttpError } = require("../common/httpError");

const sanitizeForJson = (value) => {
  const seen = new WeakSet();

  const visit = (input) => {
    if (input == null) {
      return input;
    }

    if (typeof input === "function" || typeof input === "symbol") {
      return undefined;
    }

    if (typeof input === "bigint") {
      return input.toString();
    }

    if (input instanceof Date) {
      return input.toISOString();
    }

    if (Array.isArray(input)) {
      return input
        .map((item) => visit(item))
        .filter((item) => item !== undefined);
    }

    if (typeof input === "object") {
      if (seen.has(input)) {
        return undefined;
      }

      seen.add(input);

      if (typeof input.toJSON === "function") {
        try {
          return visit(input.toJSON());
        } catch (_error) {
          // Fall through to plain traversal.
        }
      }

      return Object.fromEntries(
        Object.entries(input).flatMap(([key, nestedValue]) => {
          const serializedValue = visit(nestedValue);
          return serializedValue === undefined ? [] : [[key, serializedValue]];
        }),
      );
    }

    return input;
  };

  return visit(value);
};

const getGeniusPayApiKey = () =>
  String(process.env.GENIUSPAY_API_KEY || "").trim();

const getGeniusPayApiSecret = () =>
  String(process.env.GENIUSPAY_API_SECRET || "").trim();

const getGeniusPayWebhookSecret = () =>
  String(process.env.GENIUSPAY_WEBHOOK_SECRET || "").trim();

const getGeniusPayEnvironment = () => {
  const explicit = String(process.env.GENIUSPAY_ENV || "").trim().toLowerCase();

  if (explicit === "live" || explicit === "sandbox") {
    return explicit;
  }

  return getGeniusPayApiKey().startsWith("pk_live_") ? "live" : "sandbox";
};

const hasGeniusPayConfig = () =>
  Boolean(getGeniusPayApiKey() && getGeniusPayApiSecret());

const getGeniusPayBaseUrl = () => "https://pay.genius.ci/api/v1/merchant";

const getGeniusPayBaseReturnUrl = () => {
  const baseUrl = [process.env.GENIUSPAY_RETURN_URL, process.env.FRONTEND_URL]
    .map((value) => String(value || "").trim())
    .find(Boolean);

  if (baseUrl) {
    return baseUrl;
  }

  if (process.env.NODE_ENV === "production") {
    throw new HttpError(
      500,
      "Configuration GeniusPay incomplete. GENIUSPAY_RETURN_URL ou FRONTEND_URL manquant.",
    );
  }

  return "http://localhost:5173";
};

const buildGeniusPayReturnUrl = (
  orderReference,
  paymentReference,
  status = "pending",
) => {
  const baseUrl = getGeniusPayBaseReturnUrl();
  const url = new URL(baseUrl);

  if (!url.pathname || url.pathname === "/") {
    url.pathname = "/payment-return";
  }

  url.searchParams.set("provider", "geniuspay");
  url.searchParams.set("orderReference", orderReference);
  url.searchParams.set("paymentReference", paymentReference);
  url.searchParams.set("status", status);

  return url.toString();
};

const normalizeGeniusPayPhoneNumber = (rawPhone, country = "CI") => {
  const normalizedCountry = String(country || "CI").trim().toUpperCase();
  const digitsOnly = String(rawPhone || "").replace(/\D/g, "");

  if (!digitsOnly) {
    return null;
  }

  if (normalizedCountry === "CI") {
    if (/^225\d{10}$/.test(digitsOnly)) {
      return `+${digitsOnly}`;
    }

    if (/^0\d{9}$/.test(digitsOnly)) {
      return `+225${digitsOnly}`;
    }
  }

  if (/^[1-9]\d{6,15}$/.test(digitsOnly)) {
    return `+${digitsOnly}`;
  }

  return null;
};

const geniusPayFetch = async (pathname, { method = "GET", body } = {}) => {
  const apiKey = getGeniusPayApiKey();
  const apiSecret = getGeniusPayApiSecret();

  if (!apiKey || !apiSecret) {
    throw new HttpError(
      500,
      "Configuration GeniusPay incomplete. GENIUSPAY_API_KEY ou GENIUSPAY_API_SECRET manquant.",
    );
  }

  const response = await fetch(`${getGeniusPayBaseUrl()}${pathname}`, {
    method,
    headers: {
      "X-API-Key": apiKey,
      "X-API-Secret": apiSecret,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const rawText = await response.text();
  let data = null;

  if (rawText) {
    try {
      data = JSON.parse(rawText);
    } catch (_error) {
      data = rawText;
    }
  }

  if (!response.ok || data?.success === false) {
    const failureMessage =
      data?.error?.message ||
      data?.message ||
      `Erreur GeniusPay (${response.status})`;

    const error = new HttpError(502, failureMessage);
    error.httpResponse = {
      status: response.status,
      data,
    };
    throw error;
  }

  return data;
};

const createGeniusPayPaymentSession = async ({ order, paymentReference }) => {
  const successUrl = buildGeniusPayReturnUrl(
    order.reference,
    paymentReference,
    "success",
  );
  const errorUrl = buildGeniusPayReturnUrl(
    order.reference,
    paymentReference,
    "error",
  );

  const customerName = [order.customerFirstName, order.customerLastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  const customerPhone = normalizeGeniusPayPhoneNumber(order.customerPhone, "CI");

  const requestBody = {
    amount: order.totalAmount,
    currency: String(order.currency || "XOF").trim().toUpperCase(),
    description: `Billetterie AIFUS - ${order.reference}`.slice(0, 500),
    success_url: successUrl,
    error_url: errorUrl,
    metadata: {
      order_reference: order.reference,
      payment_reference: paymentReference,
      order_id: order.id,
      customer_email: order.customerEmail,
    },
  };

  const customerPayload = {};

  if (customerName) {
    customerPayload.name = customerName;
  }
  if (order.customerEmail) {
    customerPayload.email = order.customerEmail;
  }
  if (customerPhone) {
    customerPayload.phone = customerPhone;
  }

  if (Object.keys(customerPayload).length > 0) {
    requestBody.customer = customerPayload;
  }

  const response = await geniusPayFetch("/payments", {
    method: "POST",
    body: requestBody,
  });

  const paymentData = response?.data || {};
  const paymentUrl = paymentData.checkout_url || paymentData.payment_url || null;

  if (!paymentUrl || !paymentData.reference) {
    const failureMessage =
      response?.error?.message ||
      "GeniusPay n'a retourne aucune URL de paiement exploitable.";

    const error = new HttpError(502, failureMessage);
    error.httpResponse = { status: 200, data: response };
    throw error;
  }

  return {
    reference: String(paymentData.reference).trim(),
    status: String(paymentData.status || "pending").trim().toUpperCase(),
    paymentUrl,
    successUrl,
    errorUrl,
    rawResponse: sanitizeForJson(response),
  };
};

const retrieveGeniusPayPaymentStatus = async (reference) =>
  geniusPayFetch(`/payments/${encodeURIComponent(reference)}`);

const mapGeniusPayStatus = (status, eventName = "") => {
  const normalizedStatus = String(status || "").trim().toLowerCase();
  const normalizedEvent = String(eventName || "").trim().toLowerCase();

  if (normalizedStatus) {
    return normalizedStatus.toUpperCase();
  }

  if (normalizedEvent.endsWith(".success")) {
    return "COMPLETED";
  }

  if (normalizedEvent.endsWith(".failed")) {
    return "FAILED";
  }

  if (normalizedEvent.endsWith(".cancelled")) {
    return "CANCELLED";
  }

  if (normalizedEvent.endsWith(".expired")) {
    return "EXPIRED";
  }

  if (normalizedEvent.endsWith(".refunded")) {
    return "REFUNDED";
  }

  return "FAILED";
};

const buildGeniusPayWebhookPayload = ({
  callbackPayload = null,
  statusPayload = null,
  fallbackTransactionReference = "",
  fallbackAmount = 0,
  fallbackCurrency = "XOF",
}) => {
  const callback = sanitizeForJson(callbackPayload || null);
  const statusResult = sanitizeForJson(statusPayload || null);
  const data = statusResult?.data || callback?.data || {};
  const metadata =
    data?.metadata && typeof data.metadata === "object" ? data.metadata : {};

  return {
    provider: "GENIUSPAY",
    eventReference: String(
      callback?.id ||
        `${data.reference || "transaction"}-${callback?.event || data.status || "event"}`,
    ).trim(),
    transactionReference: String(
      metadata.payment_reference ||
        metadata.paymentReference ||
        fallbackTransactionReference ||
        "",
    ).trim(),
    status: mapGeniusPayStatus(data.status, callback?.event),
    amount:
      Number.parseInt(data.amount, 10) ||
      Number.parseInt(fallbackAmount, 10) ||
      0,
    currency: String(data.currency || fallbackCurrency || "XOF")
      .trim()
      .toUpperCase(),
    providerPaymentId: data.reference ? String(data.reference).trim() : null,
    failureReason:
      callback?.event === "payment.failed"
        ? "Paiement echoue"
        : callback?.event === "payment.cancelled"
          ? "Paiement annule"
          : callback?.event === "payment.expired"
            ? "Paiement expire"
            : null,
    rawPayload: {
      callback,
      statusResult,
    },
  };
};

const verifyGeniusPayWebhookSignature = ({
  rawBody,
  signature,
  timestamp,
}) => {
  const webhookSecret = getGeniusPayWebhookSecret();

  if (!webhookSecret) {
    throw new HttpError(
      500,
      "Configuration GeniusPay incomplete. GENIUSPAY_WEBHOOK_SECRET manquant.",
    );
  }

  if (!signature || !timestamp) {
    throw new HttpError(401, "Signature webhook GeniusPay manquante");
  }

  const numericTimestamp = Number.parseInt(timestamp, 10);

  if (!Number.isFinite(numericTimestamp)) {
    throw new HttpError(400, "Timestamp webhook GeniusPay invalide");
  }

  if (Math.abs(Math.floor(Date.now() / 1000) - numericTimestamp) > 300) {
    throw new HttpError(400, "Timestamp webhook GeniusPay trop ancien");
  }

  const payload = `${numericTimestamp}.${rawBody || ""}`;
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(payload)
    .digest("hex");

  const expectedBuffer = Buffer.from(expectedSignature);
  const receivedBuffer = Buffer.from(String(signature).trim());

  if (expectedBuffer.length !== receivedBuffer.length) {
    throw new HttpError(401, "Signature webhook GeniusPay invalide");
  }

  if (!crypto.timingSafeEqual(expectedBuffer, receivedBuffer)) {
    throw new HttpError(401, "Signature webhook GeniusPay invalide");
  }

  return true;
};

module.exports = {
  hasGeniusPayConfig,
  getGeniusPayEnvironment,
  sanitizeForJson,
  normalizeGeniusPayPhoneNumber,
  createGeniusPayPaymentSession,
  retrieveGeniusPayPaymentStatus,
  buildGeniusPayWebhookPayload,
  verifyGeniusPayWebhookSignature,
};
