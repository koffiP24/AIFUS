const paymentsService = require("./payments.service");
const { sendHttpError } = require("../common/httpError");

const webhookHealth = async (_req, res) => {
  return res.json({
    ok: true,
    providers: ["CINETPAY"],
    route: "/api/v2/payments/webhook",
    method: "POST",
    message:
      "Endpoint webhook accessible. Configurez cette URL cote provider, pas votre frontend.",
  });
};

const initiatePayment = async (req, res) => {
  try {
    const payload = await paymentsService.initiatePayment(req.body, {
      user: req.ticketingUser || null,
    });
    return res.status(201).json(payload);
  } catch (error) {
    return sendHttpError(res, error);
  }
};

const handleWebhook = async (req, res) => {
  try {
    const cinetpaySignature = req.headers["x-token"] || null;
    const payload = cinetpaySignature || req.body?.cpm_trans_id || req.body?.transaction_id
      ? await paymentsService.processCinetpayWebhook({
          body: req.body,
          signature: cinetpaySignature,
        })
      : await paymentsService.processWebhook(
          req.body,
          req.headers["x-signature"] || null,
        );

    return res.json(payload);
  } catch (error) {
    return sendHttpError(res, error);
  }
};

const handleReturnRedirect = async (req, res) => {
  const provider = String(
    req.query.provider || req.body?.provider || "cinetpay",
  )
    .trim()
    .toLowerCase();

  const orderReference = String(
    req.query.orderReference || req.body?.orderReference || "",
  ).trim();

  const paymentReference = String(
    req.query.paymentReference ||
      req.body?.paymentReference ||
      req.body?.transaction_id ||
      req.body?.cpm_trans_id ||
      "",
  ).trim();

  const redirectUrl = new URL(
    process.env.FRONTEND_URL || "http://localhost:5173",
  );

  redirectUrl.pathname = "/payment-return";
  redirectUrl.searchParams.set("provider", provider);

  if (orderReference) {
    redirectUrl.searchParams.set("orderReference", orderReference);
  }

  if (paymentReference) {
    redirectUrl.searchParams.set("paymentReference", paymentReference);
  }

  return res.redirect(302, redirectUrl.toString());
};

const reconcilePayment = async (req, res) => {
  try {
    const payload = await paymentsService.reconcilePayment(req.body, {
      user: req.ticketingUser || null,
    });
    return res.json(payload);
  } catch (error) {
    return sendHttpError(res, error);
  }
};

const simulatePayment = async (req, res) => {
  try {
    const payload = await paymentsService.simulatePayment(req.body, {
      user: req.ticketingUser || null,
    });
    return res.json(payload);
  } catch (error) {
    return sendHttpError(res, error);
  }
};

module.exports = {
  webhookHealth,
  initiatePayment,
  handleWebhook,
  handleReturnRedirect,
  reconcilePayment,
  simulatePayment,
};
