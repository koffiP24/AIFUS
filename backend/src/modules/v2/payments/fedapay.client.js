const { URL } = require("url");

const { FedaPay, Transaction, Webhook } = require("fedapay");

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

const getFedapayEnvironment = () =>
  String(process.env.FEDAPAY_ENV || "sandbox").trim().toLowerCase() === "live"
    ? "live"
    : "sandbox";

const getFedapaySecretKey = () =>
  String(process.env.FEDAPAY_SECRET_KEY || "").trim();

const getFedapayWebhookSecret = () =>
  String(process.env.FEDAPAY_WEBHOOK_SECRET || "").trim();

const hasFedapayConfig = () => Boolean(getFedapaySecretKey());

const configureFedapay = () => {
  const secretKey = getFedapaySecretKey();

  if (!secretKey) {
    throw new HttpError(
      500,
      "Configuration FedaPay incomplete. FEDAPAY_SECRET_KEY manquant.",
    );
  }

  FedaPay.setApiKey(secretKey);
  FedaPay.setEnvironment(getFedapayEnvironment());
};

const buildFedapayCallbackUrl = (orderReference, paymentReference) => {
  const baseUrl =
    process.env.FEDAPAY_RETURN_URL ||
    process.env.FEDAPAY_CALLBACK_URL ||
    process.env.FRONTEND_URL ||
    "http://localhost:5173";
  const url = new URL(baseUrl);

  if (!url.pathname || url.pathname === "/") {
    url.pathname = "/payment-return";
  }

  url.searchParams.set("provider", "fedapay");
  url.searchParams.set("orderReference", orderReference);
  url.searchParams.set("paymentReference", paymentReference);

  return url.toString();
};

const normalizeFedapayPhoneNumber = (rawPhone, country = "ci") => {
  const normalizedCountry = String(country || "ci").trim().toLowerCase();
  const phone = String(rawPhone || "").trim();

  if (!phone) {
    return null;
  }

  const compact = phone.replace(/\s+/g, "");
  const digitsOnly = compact.replace(/\D/g, "");

  if (!digitsOnly) {
    return null;
  }

  if (normalizedCountry === "ci") {
    if (/^0\d{9}$/.test(compact)) {
      return {
        number: compact,
        country: normalizedCountry,
      };
    }

    if (/^\+2250\d{9}$/.test(compact)) {
      return {
        number: compact,
        country: normalizedCountry,
      };
    }

    if (/^2250\d{9}$/.test(digitsOnly)) {
      return {
        number: `+${digitsOnly}`,
        country: normalizedCountry,
      };
    }

    return null;
  }

  return {
    number: compact,
    country: normalizedCountry,
  };
};

const buildFedapayCustomer = (order, { includePhone = true } = {}) => {
  const customer = {
    email: order.customerEmail,
    firstname: order.customerFirstName || "Client",
    lastname: order.customerLastName || "AIFUS",
  };

  if (includePhone && order.customerPhone) {
    const phoneNumber = normalizeFedapayPhoneNumber(
      order.customerPhone,
      process.env.FEDAPAY_PHONE_COUNTRY || "ci",
    );

    if (phoneNumber) {
      customer.phone_number = phoneNumber;
    }
  }

  return customer;
};

const hasFedapayPhoneValidationError = (error) => {
  const errors = error?.errors;

  if (!errors || typeof errors !== "object") {
    return false;
  }

  return Boolean(errors.phone_number || errors["phone_number.number"]);
};

const createFedapayPaymentSession = async ({ order, paymentReference }) => {
  configureFedapay();

  const callbackUrl = buildFedapayCallbackUrl(order.reference, paymentReference);
  const basePayload = {
    description: `Billetterie AIFUS - ${order.reference}`,
    amount: order.totalAmount,
    currency: { iso: order.currency },
    callback_url: callbackUrl,
    merchant_reference: paymentReference,
    custom_metadata: {
      orderReference: order.reference,
      paymentReference,
      orderId: order.id,
    },
  };

  let transaction = null;
  let phoneFallbackUsed = false;

  try {
    transaction = await Transaction.create({
      ...basePayload,
      customer: buildFedapayCustomer(order, { includePhone: true }),
    });
  } catch (error) {
    if (!hasFedapayPhoneValidationError(error)) {
      throw error;
    }

    phoneFallbackUsed = true;
    transaction = await Transaction.create({
      ...basePayload,
      customer: buildFedapayCustomer(order, { includePhone: false }),
    });
  }

  const tokenObject = await transaction.generateToken();

  return {
    transactionId: String(transaction.id),
    transactionReference: transaction.reference || null,
    merchantReference: transaction.merchant_reference || paymentReference,
    status: transaction.status || "pending",
    paymentUrl: tokenObject.url || null,
    token: tokenObject.token || null,
    callbackUrl,
    phoneFallbackUsed,
    rawTransaction: sanitizeForJson(transaction),
    rawToken: sanitizeForJson(tokenObject),
  };
};

const parseFedapayWebhook = (rawBody, signature) => {
  const webhookSecret = getFedapayWebhookSecret();

  if (!webhookSecret) {
    throw new HttpError(
      500,
      "Configuration FedaPay incomplete. FEDAPAY_WEBHOOK_SECRET manquant.",
    );
  }

  try {
    return Webhook.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    throw new HttpError(401, `Webhook FedaPay invalide: ${error.message}`);
  }
};

const retrieveFedapayTransaction = async (transactionId) => {
  configureFedapay();
  return Transaction.retrieve(transactionId);
};

const isFedapayTransactionEvent = (event) => {
  const eventName = String(event?.name || event?.type || "").trim().toLowerCase();
  return eventName.startsWith("transaction.");
};

const buildFedapayWebhookPayload = ({
  event,
  transaction,
  fallbackTransactionReference,
  fallbackAmount,
  fallbackCurrency,
}) => {
  const eventName = String(event?.name || event?.type || "").trim().toLowerCase();
  const normalizedStatus = String(
    transaction?.status || eventName.replace("transaction.", "") || "pending",
  )
    .trim()
    .toUpperCase();

  return {
    provider: "FEDAPAY",
    eventReference: String(
      event?.id || `${eventName || "transaction.unknown"}-${transaction?.id || Date.now()}`,
    ).trim(),
    transactionReference: String(
      transaction?.merchant_reference || fallbackTransactionReference || "",
    ).trim(),
    status: normalizedStatus,
    amount: Number.parseInt(transaction?.amount, 10) || Number.parseInt(fallbackAmount, 10) || 0,
    currency: String(
      transaction?.currency?.iso ||
        transaction?.currency?.code ||
        fallbackCurrency ||
        "XOF",
    )
      .trim()
      .toUpperCase(),
    providerPaymentId: transaction?.id ? String(transaction.id) : null,
    failureReason: transaction?.last_error_code || null,
    rawPayload: {
      event: sanitizeForJson(event),
      transaction: sanitizeForJson(transaction),
    },
  };
};

module.exports = {
  hasFedapayConfig,
  sanitizeForJson,
  normalizeFedapayPhoneNumber,
  createFedapayPaymentSession,
  parseFedapayWebhook,
  retrieveFedapayTransaction,
  isFedapayTransactionEvent,
  buildFedapayWebhookPayload,
};
