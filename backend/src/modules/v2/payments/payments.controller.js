const paymentsService = require("./payments.service");
const { sendHttpError } = require("../common/httpError");

const webhookHealth = async (_req, res) => {
  return res.json({
    ok: true,
    provider: "FEDAPAY",
    route: "/api/v2/payments/webhook",
    method: "POST",
    message:
      "Endpoint webhook accessible. Configurez cette URL cote FedaPay, pas votre frontend.",
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
    const fedapaySignature = req.headers["x-fedapay-signature"] || null;
    const payload = fedapaySignature
      ? await paymentsService.processFedapayWebhook({
          rawBody: req.rawBody || JSON.stringify(req.body),
          signature: fedapaySignature,
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
  reconcilePayment,
  simulatePayment,
};
