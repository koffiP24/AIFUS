const paymentsService = require("./payments.service");
const { sendHttpError } = require("../common/httpError");

const webhookHealth = async (_req, res) => {
  return res.json({
    ok: true,
    provider: "GENIUSPAY",
    route: "/api/v2/payments/webhook",
    method: "POST",
    message:
      "Endpoint webhook accessible. Configurez cette URL cote GeniusPay, pas votre frontend.",
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
    const geniusReference =
      req.body?.data?.reference ||
      req.body?.reference ||
      req.body?.payment?.reference ||
      null;
    const geniusTimestamp =
      req.headers["x-webhook-timestamp"] || req.body?.timestamp || null;

    if (req.body?.event && !geniusReference) {
      return res.json({
        ok: true,
        provider: "GENIUSPAY",
        validation: true,
        event: req.body.event,
        message: "Webhook GeniusPay recu.",
      });
    }

    const payload =
      req.body?.event &&
      geniusReference &&
      geniusTimestamp
        ? await paymentsService.processGeniusPayWebhook({
            payload: req.body,
            rawBody: req.rawBody || JSON.stringify(req.body),
            signature: req.headers["x-webhook-signature"] || null,
            timestamp: geniusTimestamp,
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
