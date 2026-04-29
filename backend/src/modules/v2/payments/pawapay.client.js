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
          // Fall through to a plain object traversal if toJSON fails.
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

const getPawapayEnvironment = () =>
  String(process.env.PAWAPAY_ENV || "sandbox").trim().toLowerCase() === "live"
    ? "live"
    : "sandbox";

const getPawapayApiToken = () =>
  String(process.env.PAWAPAY_API_TOKEN || "").trim();

const hasPawapayConfig = () => Boolean(getPawapayApiToken());

const getPawapayBaseUrl = () =>
  getPawapayEnvironment() === "live"
    ? "https://api.pawapay.io"
    : "https://api.sandbox.pawapay.io";

const getPawapayBaseReturnUrl = () => {
  const baseUrl = [process.env.PAWAPAY_RETURN_URL, process.env.FRONTEND_URL]
    .map((value) => String(value || "").trim())
    .find(Boolean);

  if (baseUrl) {
    return baseUrl;
  }

  if (process.env.NODE_ENV === "production") {
    throw new HttpError(
      500,
      "Configuration pawaPay incomplete. PAWAPAY_RETURN_URL ou FRONTEND_URL manquant.",
    );
  }

  return "http://localhost:5173";
};

const buildPawapayReturnUrl = (
  orderReference,
  paymentReference,
  providerPaymentId,
) => {
  const baseUrl = getPawapayBaseReturnUrl();
  const url = new URL(baseUrl);

  if (!url.pathname || url.pathname === "/") {
    url.pathname = "/payment-return";
  }

  url.searchParams.set("provider", "pawapay");
  url.searchParams.set("orderReference", orderReference);
  url.searchParams.set("paymentReference", paymentReference);

  if (providerPaymentId) {
    url.searchParams.set("providerPaymentId", providerPaymentId);
  }

  return url.toString();
};

const getPawapayLanguage = () =>
  String(process.env.PAWAPAY_LANGUAGE || "FR").trim().toUpperCase() === "EN"
    ? "EN"
    : "FR";

const getPawapayCountry = () =>
  String(process.env.PAWAPAY_COUNTRY || "CIV").trim().toUpperCase();

const getPawapayCustomerMessage = () => {
  const configuredValue = String(
    process.env.PAWAPAY_CUSTOMER_MESSAGE || "AIFUS 2026",
  )
    .replace(/[^a-zA-Z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (configuredValue.length >= 4 && configuredValue.length <= 22) {
    return configuredValue;
  }

  return "AIFUS 2026";
};

const normalizePawapayPhoneNumber = (rawPhone, country = "CIV") => {
  const normalizedCountry = String(country || "CIV").trim().toUpperCase();
  const digitsOnly = String(rawPhone || "").replace(/\D/g, "");

  if (!digitsOnly) {
    return null;
  }

  if (normalizedCountry === "CIV") {
    if (/^225\d{10}$/.test(digitsOnly)) {
      return digitsOnly;
    }

    if (/^0\d{9}$/.test(digitsOnly)) {
      return `225${digitsOnly}`;
    }

    return null;
  }

  if (/^[1-9]\d{6,15}$/.test(digitsOnly)) {
    return digitsOnly;
  }

  return null;
};

const pawapayFetch = async (pathname, { method = "GET", body } = {}) => {
  const apiToken = getPawapayApiToken();

  if (!apiToken) {
    throw new HttpError(
      500,
      "Configuration pawaPay incomplete. PAWAPAY_API_TOKEN manquant.",
    );
  }

  const response = await fetch(`${getPawapayBaseUrl()}${pathname}`, {
    method,
    headers: {
      Authorization: `Bearer ${apiToken}`,
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

  if (!response.ok) {
    const failureMessage =
      data?.failureReason?.failureMessage ||
      data?.message ||
      `Erreur pawaPay (${response.status})`;

    const error = new HttpError(502, failureMessage);
    error.httpResponse = {
      status: response.status,
      data,
    };
    throw error;
  }

  return data;
};

const createPawapayPaymentSession = async ({
  order,
  paymentReference,
  providerPaymentId,
}) => {
  const returnUrl = buildPawapayReturnUrl(
    order.reference,
    paymentReference,
    providerPaymentId,
  );

  const phoneNumber = normalizePawapayPhoneNumber(
    order.customerPhone,
    getPawapayCountry(),
  );

  const requestBody = {
    depositId: providerPaymentId,
    returnUrl,
    customerMessage: getPawapayCustomerMessage(),
    amountDetails: {
      amount: String(order.totalAmount),
      currency: String(order.currency || "XOF").trim().toUpperCase(),
    },
    language: getPawapayLanguage(),
    country: getPawapayCountry(),
    reason: `Commande ${order.reference}`.slice(0, 50),
    metadata: [
      { orderReference: order.reference },
      { paymentReference },
      { orderId: order.id },
      order.customerEmail
        ? {
            customerEmail: order.customerEmail,
            isPII: true,
          }
        : undefined,
    ].filter(Boolean),
  };

  if (phoneNumber) {
    requestBody.phoneNumber = phoneNumber;
  }

  const response = await pawapayFetch("/v2/paymentpage", {
    method: "POST",
    body: requestBody,
  });

  if (!response?.redirectUrl) {
    const failureMessage =
      response?.failureReason?.failureMessage ||
      "pawaPay n'a retourne aucun lien de paiement.";

    const error = new HttpError(502, failureMessage);
    error.httpResponse = { status: 200, data: response };
    throw error;
  }

  return {
    depositId: providerPaymentId,
    status: String(response.status || "ACCEPTED").trim().toUpperCase(),
    paymentUrl: response.redirectUrl,
    returnUrl,
    rawResponse: sanitizeForJson(response),
  };
};

const retrievePawapayDepositStatus = async (depositId) =>
  pawapayFetch(`/v2/deposits/${encodeURIComponent(depositId)}`);

const buildPawapayWebhookPayload = ({
  callbackPayload = null,
  statusPayload = null,
  fallbackTransactionReference = "",
  fallbackAmount = 0,
  fallbackCurrency = "XOF",
}) => {
  const callback = sanitizeForJson(callbackPayload || null);
  const statusResult = sanitizeForJson(statusPayload || null);
  const statusData =
    statusResult?.status === "FOUND" ? statusResult.data || {} : {};
  const providerPaymentId = String(
    callback?.depositId || statusData.depositId || "",
  ).trim();
  const normalizedStatus = String(
    statusData.status || callback?.status || "FAILED",
  )
    .trim()
    .toUpperCase();

  const metadata =
    statusData.metadata && typeof statusData.metadata === "object"
      ? statusData.metadata
      : callback?.metadata && typeof callback.metadata === "object"
        ? callback.metadata
        : {};

  return {
    provider: "PAWAPAY",
    eventReference: String(
      metadata.eventReference ||
        `${providerPaymentId || "deposit"}-${normalizedStatus}`,
    ).trim(),
    transactionReference: String(
      metadata.paymentReference ||
        fallbackTransactionReference ||
        "",
    ).trim(),
    status: normalizedStatus,
    amount:
      Number.parseInt(statusData.amount, 10) ||
      Number.parseInt(callback?.amount, 10) ||
      Number.parseInt(fallbackAmount, 10) ||
      0,
    currency: String(
      statusData.currency || callback?.currency || fallbackCurrency || "XOF",
    )
      .trim()
      .toUpperCase(),
    providerPaymentId: providerPaymentId || null,
    failureReason:
      callback?.failureReason?.failureMessage ||
      statusData?.failureReason?.failureMessage ||
      callback?.failureReason?.failureCode ||
      statusData?.failureReason?.failureCode ||
      null,
    rawPayload: {
      callback,
      statusResult,
    },
  };
};

module.exports = {
  hasPawapayConfig,
  sanitizeForJson,
  normalizePawapayPhoneNumber,
  createPawapayPaymentSession,
  retrievePawapayDepositStatus,
  buildPawapayWebhookPayload,
};
