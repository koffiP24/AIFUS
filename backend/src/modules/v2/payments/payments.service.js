const crypto = require("crypto");

const { prismaTicketing, Prisma } = require("../../../lib/prismaTicketing");
const { HttpError } = require("../common/httpError");
const {
  canRetryPayment,
  loadAndAuthorizeOrder,
  serializeOrderEntity,
  getOrderByReferenceOrThrow,
  expireOrderIfNeeded,
} = require("../common/orderService");
const { ensureOrderTickets } = require("../tickets/tickets.service");
const {
  hasCinetpayConfig,
  createCinetpayPaymentSession,
  retrieveCinetpayTransaction,
  verifyCinetpayNotificationToken,
  buildCinetpayWebhookPayload,
} = require("./cinetpay.client");
const { sanitizeForJson } = require("./paymentSerialization");

const SUCCESS_STATUSES = new Set([
  "SUCCESS",
  "PAID",
  "SUCCEEDED",
  "APPROVED",
  "TRANSFERRED",
  "REFUNDED",
  "APPROVED_PARTIALLY_REFUNDED",
  "TRANSFERRED_PARTIALLY_REFUNDED",
  "ACCEPTED",
]);
const FAILED_STATUSES = new Set([
  "FAILED",
  "FAIL",
  "ERROR",
  "DECLINED",
  "REFUSED",
  "REJECTED",
]);
const CANCELLED_STATUSES = new Set([
  "CANCELLED",
  "CANCELED",
  "ABORTED",
  "EXPIRED",
]);

const buildTransactionReference = (provider) => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = crypto.randomBytes(5).toString("hex").toUpperCase();
  return `PAY-${provider.slice(0, 6).toUpperCase()}-${date}-${randomPart}`;
};

const buildEventReference = () => `EVT-${crypto.randomBytes(6).toString("hex").toUpperCase()}`;

const normalizeStatus = (status) => String(status || "").trim().toUpperCase();

const resolveProvider = (provider) => {
  const requestedProvider = String(provider || "").trim().toUpperCase();

  if (requestedProvider) {
    if (requestedProvider !== "CINETPAY" && requestedProvider !== "SIMULATION") {
      throw new HttpError(400, `Prestataire de paiement non supporte: ${requestedProvider}`);
    }

    return requestedProvider;
  }

  if (hasCinetpayConfig()) {
    return "CINETPAY";
  }

  return "SIMULATION";
};

const toSerializableObject = (value) => sanitizeForJson(value);

const formatProviderError = (error, fallbackMessage) => {
  const providerMessage =
    error?.response?.data?.message ||
    error?.httpResponse?.data?.message ||
    error?.errorMessage ||
    error?.message ||
    fallbackMessage;

  const providerErrors = error?.response?.data?.errors ||
    error?.httpResponse?.data?.errors ||
    error?.errors ||
    null;

  if (!providerErrors || typeof providerErrors !== "object") {
    return providerMessage;
  }

  const flattenedErrors = Object.entries(providerErrors)
    .map(([field, messages]) => {
      const normalizedMessages = Array.isArray(messages)
        ? messages.filter(Boolean).join(", ")
        : String(messages || "").trim();

      if (!normalizedMessages) {
        return null;
      }

      return `${field}: ${normalizedMessages}`;
    })
    .filter(Boolean)
    .join(" ; ");

  if (!flattenedErrors) {
    return providerMessage;
  }

  return `${providerMessage} (${flattenedErrors})`;
};

const getWebhookSecret = () =>
  process.env.PAYMENT_WEBHOOK_SECRET || process.env.JWT_SECRET || "";

const buildWebhookSignature = ({
  provider,
  eventReference,
  transactionReference,
  status,
  amount,
  currency,
}) => {
  const payload = [
    provider,
    eventReference,
    transactionReference,
    normalizeStatus(status),
    String(amount),
    currency || "XOF",
  ].join("|");

  return crypto
    .createHmac("sha256", getWebhookSecret())
    .update(payload)
    .digest("hex");
};

const verifyWebhookSignature = (payload, signature) => {
  if (!signature) {
    return payload.provider === "SIMULATION";
  }

  const expected = buildWebhookSignature(payload);
  const receivedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (receivedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(receivedBuffer, expectedBuffer);
};

const buildPaymentInstructions = (payment, orderReference) => {
  if (payment.provider === "CINETPAY") {
    return {
      provider: payment.provider,
      transactionReference: payment.transactionReference,
      providerPaymentId: payment.providerPaymentId,
      paymentUrl: payment.paymentUrl,
      webhookEndpoint: "/api/v2/payments/webhook",
      reconcileEndpoint: "/api/v2/payments/reconcile",
      returnEndpoint: "/api/v2/payments/return",
      redirectMode: "EXTERNAL",
      orderReference,
    };
  }

  return {
    provider: payment.provider,
    transactionReference: payment.transactionReference,
    paymentUrl: payment.paymentUrl,
    simulateEndpoint: "/api/v2/payments/simulate",
    webhookEndpoint: "/api/v2/payments/webhook",
    orderReference,
  };
};

const lockOrderAndPayment = async (tx, { orderId, paymentId = null }) => {
  await tx.$queryRaw`
    SELECT id
    FROM orders
    WHERE id = ${orderId}
    FOR UPDATE
  `;

  if (paymentId) {
    await tx.$queryRaw`
      SELECT id
      FROM payments
      WHERE id = ${paymentId}
      FOR UPDATE
    `;
  }
};

const finalizeSuccessfulPayment = async (tx, { orderId, paymentId, providerPayload, now }) => {
  await tx.stockReservation.updateMany({
    where: {
      orderId,
      status: "ACTIVE",
    },
    data: {
      status: "CONVERTED",
      releasedAt: now,
    },
  });

  await tx.payment.update({
    where: { id: paymentId },
    data: {
      status: "SUCCESS",
      providerStatus: normalizeStatus(providerPayload.status),
      providerPaymentId: providerPayload.providerPaymentId || null,
      callbackPayload: providerPayload,
      verifiedAt: now,
      paidAt: now,
      attemptCount: { increment: 1 },
    },
  });

  await tx.order.update({
    where: { id: orderId },
    data: {
      status: "PAID",
      paidAt: now,
      failureReason: null,
    },
  });

  return ensureOrderTickets(tx, orderId, now);
};

const markPaymentFailure = async (tx, { orderId, paymentId, status, providerPayload, now }) => {
  const paymentStatus = FAILED_STATUSES.has(status) ? "FAILED" : "CANCELLED";
  const orderStatus = FAILED_STATUSES.has(status) ? "FAILED" : "CANCELLED";
  const failureReason =
    providerPayload.failureReason ||
    (paymentStatus === "FAILED" ? "Paiement echoue" : "Paiement annule");

  await tx.payment.update({
    where: { id: paymentId },
    data: {
      status: paymentStatus,
      providerStatus: status,
      providerPaymentId: providerPayload.providerPaymentId || null,
      callbackPayload: providerPayload,
      verifiedAt: now,
      failureReason,
      attemptCount: { increment: 1 },
    },
  });

  if (orderStatus === "CANCELLED") {
    await tx.stockReservation.updateMany({
      where: {
        orderId,
        status: "ACTIVE",
      },
      data: {
        status: "RELEASED",
        releasedAt: now,
      },
    });
  }

  await tx.order.update({
    where: { id: orderId },
    data: {
      status: orderStatus,
      failureReason,
    },
  });
};

const createExternalPaymentSession = async ({ provider, order, paymentId, transactionReference }) => {
  if (provider !== "CINETPAY") {
    return null;
  }

  try {
    const session = await createCinetpayPaymentSession({
      order,
      paymentReference: transactionReference,
    });

    const updatedPayment = await prismaTicketing.payment.update({
      where: { id: paymentId },
      data: {
        providerPaymentId:
          session.paymentToken ||
          session.apiResponseId ||
          session.transactionId,
        paymentUrl: session.paymentUrl,
        providerStatus: normalizeStatus(session.status || "PENDING"),
        callbackPayload: {
          provider: "CINETPAY",
          createTransaction: toSerializableObject(session.rawResponse),
          requestPayload: toSerializableObject(session.rawRequest),
          paymentToken: session.paymentToken,
          returnUrl: session.returnUrl,
          notifyUrl: session.notifyUrl,
          providerReference: session.transactionReference,
          apiResponseId: session.apiResponseId,
        },
      },
    });

    return {
      payment: updatedPayment,
      paymentUrl: session.paymentUrl,
    };
  } catch (error) {
    const failureReason = formatProviderError(
      error,
      "Impossible d'initialiser le paiement CinetPay.",
    );

    await prismaTicketing.$transaction(
      async (tx) => {
        await lockOrderAndPayment(tx, { orderId: order.id, paymentId });

        await tx.payment.update({
          where: { id: paymentId },
          data: {
            status: "FAILED",
            providerStatus: "INIT_ERROR",
            failureReason,
            callbackPayload: {
              provider,
              initError: {
                message: failureReason,
              },
            },
            attemptCount: { increment: 1 },
          },
        });

        await tx.order.update({
          where: { id: order.id },
          data: {
            status: "PENDING",
            failureReason: null,
          },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead },
    );

    throw new HttpError(502, failureReason);
  }
};

const initiatePayment = async (payload, { user = null } = {}) => {
  const provider = resolveProvider(payload.provider);
  const now = new Date();
  let response = null;
  let pendingExternalSession = null;

  await prismaTicketing.$transaction(
    async (tx) => {
      let order = await loadAndAuthorizeOrder(tx, payload.orderReference, {
        user,
        customerEmail: payload.customerEmail,
      });

      order = await expireOrderIfNeeded(tx, order, now);

      if (order.status === "PAID") {
        response = {
          order: serializeOrderEntity(order),
          payment: order.payments.find((payment) => payment.status === "SUCCESS") || null,
          alreadyPaid: true,
        };
        return;
      }

      if (!canRetryPayment(order.status)) {
        throw new HttpError(
          409,
          `Impossible d'initialiser un paiement pour une commande ${order.status}`,
        );
      }

      await lockOrderAndPayment(tx, { orderId: order.id });

      const payment = await tx.payment.create({
        data: {
          orderId: order.id,
          provider,
          transactionReference: buildTransactionReference(provider),
          amount: order.totalAmount,
          currency: order.currency,
          status: order.totalAmount > 0 ? "PENDING" : "SUCCESS",
          paymentUrl:
            order.totalAmount > 0
              ? `${process.env.FRONTEND_URL || "http://localhost:5173"}/checkout/${order.reference}?transaction=${provider}`
              : null,
          providerStatus: order.totalAmount > 0 ? "PENDING" : "SUCCESS",
        },
      });

      await tx.order.update({
        where: { id: order.id },
        data: {
          status: order.totalAmount > 0 ? "PAYMENT_PROCESSING" : "PAID",
          failureReason: null,
          paidAt: order.totalAmount > 0 ? null : now,
        },
      });

      if (order.totalAmount <= 0) {
        await finalizeSuccessfulPayment(tx, {
          orderId: order.id,
          paymentId: payment.id,
          providerPayload: {
            provider,
            status: "SUCCESS",
            amount: order.totalAmount,
            currency: order.currency,
            eventReference: buildEventReference(),
          },
          now,
        });
      }

      const refreshedOrder = await getOrderByReferenceOrThrow(tx, order.reference);

      pendingExternalSession = {
        order: refreshedOrder,
        paymentId: payment.id,
        transactionReference: payment.transactionReference,
      };

      response = {
        order: serializeOrderEntity(refreshedOrder),
        payment: {
          id: payment.id,
          provider: payment.provider,
          transactionReference: payment.transactionReference,
          amount: payment.amount,
          currency: payment.currency,
          status: order.totalAmount > 0 ? "PENDING" : "SUCCESS",
          paymentUrl: payment.paymentUrl,
        },
        instructions: buildPaymentInstructions(payment, order.reference),
        alreadyPaid: false,
      };
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead },
  );

  if (
    response &&
    !response.alreadyPaid &&
    provider !== "SIMULATION" &&
    pendingExternalSession &&
    response.payment?.status === "PENDING"
  ) {
    const externalSession = await createExternalPaymentSession({
      provider,
      order: pendingExternalSession.order,
      paymentId: pendingExternalSession.paymentId,
      transactionReference: pendingExternalSession.transactionReference,
    });

    const refreshedOrder = await getOrderByReferenceOrThrow(
      prismaTicketing,
      pendingExternalSession.order.reference,
    );

    response = {
      ...response,
      order: serializeOrderEntity(refreshedOrder),
      payment: {
        ...response.payment,
        providerPaymentId: externalSession.payment.providerPaymentId,
        paymentUrl: externalSession.payment.paymentUrl,
        status: externalSession.payment.status,
      },
      instructions: buildPaymentInstructions(
        externalSession.payment,
        refreshedOrder.reference,
      ),
    };
  }

  return response;
};

const normalizeWebhookPayload = (payload) => ({
  provider: String(payload.provider || "").trim().toUpperCase(),
  eventReference: String(payload.eventReference || "").trim(),
  transactionReference: String(payload.transactionReference || "").trim(),
  status: normalizeStatus(payload.status),
  amount: Number.parseInt(payload.amount, 10),
  currency: String(payload.currency || "XOF").trim().toUpperCase(),
  providerPaymentId: payload.providerPaymentId ? String(payload.providerPaymentId) : null,
  failureReason: payload.failureReason ? String(payload.failureReason) : null,
  rawPayload: sanitizeForJson(payload.rawPayload || null),
});

const persistWebhookEvent = async (
  payload,
  { signature = null, signatureValid = null } = {},
) => {
  try {
    return await prismaTicketing.paymentWebhookEvent.create({
      data: {
        provider: payload.provider,
        eventReference: payload.eventReference,
        signatureValid:
          signatureValid === null
            ? verifyWebhookSignature(payload, signature)
            : Boolean(signatureValid),
        processingStatus: "PENDING",
        payload,
        errorMessage: null,
      },
    });
  } catch (error) {
    if (error?.code !== "P2002") {
      throw error;
    }

    const existing = await prismaTicketing.paymentWebhookEvent.findFirst({
      where: {
        provider: payload.provider,
        eventReference: payload.eventReference,
      },
    });

    if (!existing) {
      throw error;
    }

    return existing;
  }
};

const processWebhook = async (payload, signature = null, options = {}) => {
  const normalizedPayload = normalizeWebhookPayload(payload);
  const skipSignatureVerification = Boolean(options.skipSignatureVerification);
  const webhookEvent = await persistWebhookEvent(normalizedPayload, {
    signature,
    signatureValid:
      typeof options.signatureValid === "boolean" ? options.signatureValid : null,
  });

  if (webhookEvent.processingStatus === "PROCESSED") {
    return {
      message: "Webhook deja traite",
      idempotent: true,
    };
  }

  if (!skipSignatureVerification && !verifyWebhookSignature(normalizedPayload, signature)) {
    await prismaTicketing.paymentWebhookEvent.update({
      where: { id: webhookEvent.id },
      data: {
        processingStatus: "REJECTED",
        signatureValid: false,
        errorMessage: "Signature webhook invalide",
      },
    });

    throw new HttpError(401, "Signature webhook invalide");
  }

  const payment = await prismaTicketing.payment.findUnique({
    where: { transactionReference: normalizedPayload.transactionReference },
    include: {
      order: true,
    },
  });

  if (!payment) {
    await prismaTicketing.paymentWebhookEvent.update({
      where: { id: webhookEvent.id },
      data: {
        processingStatus: "REJECTED",
        signatureValid: true,
        errorMessage: "Paiement introuvable",
      },
    });

    throw new HttpError(404, "Paiement introuvable");
  }

  if (payment.amount !== normalizedPayload.amount || payment.currency !== normalizedPayload.currency) {
    await prismaTicketing.paymentWebhookEvent.update({
      where: { id: webhookEvent.id },
      data: {
        processingStatus: "REJECTED",
        signatureValid: true,
        errorMessage: "Montant ou devise incoherent",
        paymentId: payment.id,
        orderId: payment.orderId,
      },
    });

    throw new HttpError(409, "Montant ou devise incoherent");
  }

  const now = new Date();
  let response = null;

  await prismaTicketing.$transaction(
    async (tx) => {
      await lockOrderAndPayment(tx, {
        orderId: payment.orderId,
        paymentId: payment.id,
      });

      const freshPayment = await tx.payment.findUnique({
        where: { id: payment.id },
        include: { order: true },
      });

      if (!freshPayment) {
        throw new HttpError(404, "Paiement introuvable pendant traitement");
      }

      if (freshPayment.status === "SUCCESS") {
        await tx.paymentWebhookEvent.update({
          where: { id: webhookEvent.id },
          data: {
            processingStatus: "PROCESSED",
            signatureValid: true,
            processedAt: now,
            paymentId: freshPayment.id,
            orderId: freshPayment.orderId,
          },
        });

        const currentOrder = await getOrderByReferenceOrThrow(
          tx,
          freshPayment.order.reference,
        );

        response = {
          message: "Paiement deja confirme",
          idempotent: true,
          order: serializeOrderEntity(currentOrder),
        };
        return;
      }

      if (
        freshPayment.order.status === "EXPIRED" ||
        freshPayment.order.status === "CANCELLED"
      ) {
        await tx.payment.update({
          where: { id: freshPayment.id },
          data: {
            status: SUCCESS_STATUSES.has(normalizedPayload.status)
              ? "SUCCESS"
              : freshPayment.status,
            providerStatus: normalizedPayload.status,
            callbackPayload: normalizedPayload,
            verifiedAt: now,
            paidAt: SUCCESS_STATUSES.has(normalizedPayload.status) ? now : null,
            failureReason:
              "Paiement recu alors que la commande n'etait plus payable",
          },
        });

        await tx.paymentWebhookEvent.update({
          where: { id: webhookEvent.id },
          data: {
            processingStatus: "ACTION_REQUIRED",
            signatureValid: true,
            processedAt: now,
            paymentId: freshPayment.id,
            orderId: freshPayment.orderId,
            errorMessage: "Paiement recu sur commande expiree ou annulee",
          },
        });

        response = {
          message: "Paiement recu mais commande deja expiree ou annulee",
          actionRequired: true,
        };
        return;
      }

      if (SUCCESS_STATUSES.has(normalizedPayload.status)) {
        await finalizeSuccessfulPayment(tx, {
          orderId: freshPayment.orderId,
          paymentId: freshPayment.id,
          providerPayload: normalizedPayload,
          now,
        });
      } else if (
        FAILED_STATUSES.has(normalizedPayload.status) ||
        CANCELLED_STATUSES.has(normalizedPayload.status)
      ) {
        await markPaymentFailure(tx, {
          orderId: freshPayment.orderId,
          paymentId: freshPayment.id,
          status: normalizedPayload.status,
          providerPayload: normalizedPayload,
          now,
        });
      } else {
        await tx.payment.update({
          where: { id: freshPayment.id },
          data: {
            status: "PENDING",
            providerStatus: normalizedPayload.status,
            callbackPayload: normalizedPayload,
            verifiedAt: now,
            attemptCount: { increment: 1 },
          },
        });
      }

      await tx.paymentWebhookEvent.update({
        where: { id: webhookEvent.id },
        data: {
          processingStatus: "PROCESSED",
          signatureValid: true,
          processedAt: now,
          paymentId: freshPayment.id,
          orderId: freshPayment.orderId,
          errorMessage: null,
        },
      });

      const refreshedOrder = await getOrderByReferenceOrThrow(
        tx,
        freshPayment.order.reference,
      );

      response = {
        message: "Webhook traite",
        idempotent: false,
        order: serializeOrderEntity(refreshedOrder),
      };
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead },
  );

  return response;
};

const processCinetpayWebhook = async ({ body, signature }) => {
  const transactionReference = String(
    body?.cpm_trans_id || body?.transaction_id || "",
  ).trim();

  if (!transactionReference) {
    throw new HttpError(400, "Webhook CinetPay sans transaction_id");
  }

  const payment = await prismaTicketing.payment.findUnique({
    where: { transactionReference },
  });

  const preliminaryPayload = {
    provider: "CINETPAY",
    eventReference: `CINETPAY-${transactionReference}-NOTIFY`,
    transactionReference,
    status: "NOTIFIED",
    amount:
      payment?.amount ||
      Number.parseInt(body?.cpm_amount, 10) ||
      0,
    currency: String(payment?.currency || body?.cpm_currency || "XOF")
      .trim()
      .toUpperCase(),
    providerPaymentId: null,
    failureReason: body?.cpm_error_message ? String(body.cpm_error_message) : null,
    rawPayload: {
      notification: sanitizeForJson(body),
    },
  };

  const signatureValid = verifyCinetpayNotificationToken(body, signature);

  if (!signatureValid) {
    const webhookEvent = await persistWebhookEvent(preliminaryPayload, {
      signatureValid: false,
    });

    await prismaTicketing.paymentWebhookEvent.update({
      where: { id: webhookEvent.id },
      data: {
        processingStatus: "REJECTED",
        signatureValid: false,
        errorMessage: "Signature x-token CinetPay invalide",
        paymentId: payment?.id || null,
        orderId: payment?.orderId || null,
      },
    });

    throw new HttpError(401, "Signature webhook CinetPay invalide");
  }

  const verification = await retrieveCinetpayTransaction(transactionReference);
  const normalizedPayload = buildCinetpayWebhookPayload({
    verification,
    transactionReference,
    notificationBody: body,
    fallbackAmount: payment?.amount,
    fallbackCurrency: payment?.currency || body?.cpm_currency || "XOF",
  });

  return processWebhook(normalizedPayload, null, {
    skipSignatureVerification: true,
    signatureValid: true,
  });
};

const reconcilePayment = async (payload, { user = null } = {}) => {
  if (!payload.orderReference && !payload.transactionReference) {
    throw new HttpError(400, "orderReference ou transactionReference requis");
  }

  let payment = null;
  const requestedProvider = payload.provider
    ? resolveProvider(payload.provider)
    : null;

  if (payload.transactionReference) {
    payment = await prismaTicketing.payment.findUnique({
      where: { transactionReference: payload.transactionReference },
      include: { order: true },
    });
  } else {
    const order = await loadAndAuthorizeOrder(prismaTicketing, payload.orderReference, {
      user,
      customerEmail: payload.customerEmail,
    });

    payment = await prismaTicketing.payment.findFirst({
      where: {
        orderId: order.id,
        provider: requestedProvider || {
          in: ["CINETPAY"],
        },
      },
      orderBy: { createdAt: "desc" },
      include: { order: true },
    });
  }

  if (!payment) {
    throw new HttpError(404, "Paiement externe introuvable");
  }

  await loadAndAuthorizeOrder(prismaTicketing, payment.order.reference, {
    user,
    customerEmail: payload.customerEmail,
  });

  if (payment.provider === "CINETPAY") {
    const verification = await retrieveCinetpayTransaction(payment.transactionReference);
    const normalizedPayload = buildCinetpayWebhookPayload({
      verification,
      transactionReference: payment.transactionReference,
      fallbackAmount: payment.amount,
      fallbackCurrency: payment.currency,
      eventReference: `RECONCILE-${Date.now()}-${payment.transactionReference}`,
    });

    return processWebhook(normalizedPayload, null, {
      skipSignatureVerification: true,
      signatureValid: true,
    });
  }

  throw new HttpError(
    409,
    "La reconciliation n'est disponible que pour CinetPay",
  );
};

const simulatePayment = async (payload, { user = null } = {}) => {
  let transactionReference = payload.transactionReference || null;
  let orderReference = payload.orderReference || null;

  if (!transactionReference) {
    if (!orderReference) {
      throw new HttpError(400, "orderReference ou transactionReference requis");
    }

    const initiated = await initiatePayment(
      {
        orderReference,
        provider: "SIMULATION",
        customerEmail: payload.customerEmail,
      },
      { user },
    );

    transactionReference = initiated.payment.transactionReference;
    orderReference = initiated.order.reference;
  }

  const payment = await prismaTicketing.payment.findUnique({
    where: { transactionReference },
    include: { order: true },
  });

  if (!payment) {
    throw new HttpError(404, "Paiement introuvable");
  }

  if (!orderReference) {
    orderReference = payment.order.reference;
  }

  const normalizedScenario = normalizeStatus(payload.scenario);
  const webhookPayload = {
    provider: "SIMULATION",
    eventReference: buildEventReference(),
    transactionReference,
    status: normalizedScenario,
    amount: payment.amount,
    currency: payment.currency,
    providerPaymentId: payload.providerPaymentId || `SIM-${crypto.randomBytes(4).toString("hex")}`,
    failureReason:
      normalizedScenario === "FAILED"
        ? "Paiement simule en echec"
        : normalizedScenario === "CANCELLED"
          ? "Paiement simule annule"
          : null,
  };

  const signature = buildWebhookSignature(webhookPayload);
  const result = await processWebhook(webhookPayload, signature);

  return {
    ...result,
    simulated: true,
    orderReference,
    transactionReference,
  };
};

module.exports = {
  initiatePayment,
  processWebhook,
  processCinetpayWebhook,
  reconcilePayment,
  simulatePayment,
  buildWebhookSignature,
};
