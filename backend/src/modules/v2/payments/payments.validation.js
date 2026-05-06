const { body } = require("express-validator");

const initiatePaymentValidation = [
  body("orderReference").notEmpty().withMessage("orderReference requis"),
  body("provider")
    .optional()
    .isIn(["SIMULATION", "GENIUSPAY", "simulation", "geniuspay"])
    .withMessage("provider invalide"),
  body("customerEmail")
    .optional()
    .isEmail()
    .withMessage("Email client invalide"),
];

const webhookValidation = [
  body().custom((value, { req }) => {
    if (
      req.body &&
      typeof req.body === "object" &&
      !Array.isArray(req.body) &&
      req.body?.event
    ) {
      return true;
    }

    if (
      req.body?.event &&
      req.body?.data?.reference &&
      (req.body?.timestamp || req.headers["x-webhook-timestamp"])
    ) {
      return true;
    }

    if (!req.body?.provider || !req.body?.eventReference || !req.body?.status) {
      throw new Error("Webhook paiement invalide");
    }

    return true;
  }),
];

const reconcilePaymentValidation = [
  body("orderReference")
    .optional()
    .isString()
    .withMessage("orderReference invalide"),
  body("transactionReference")
    .optional()
    .isString()
    .withMessage("transactionReference invalide"),
  body("providerPaymentId")
    .optional()
    .isString()
    .withMessage("providerPaymentId invalide"),
  body().custom((value, { req }) => {
    if (
      !req.body?.orderReference &&
      !req.body?.transactionReference &&
      !req.body?.providerPaymentId
    ) {
      throw new Error(
        "orderReference, transactionReference ou providerPaymentId requis",
      );
    }

    return true;
  }),
  body("customerEmail")
    .optional()
    .isEmail()
    .withMessage("Email client invalide"),
];

const simulatePaymentValidation = [
  body("orderReference")
    .optional()
    .isString()
    .withMessage("orderReference invalide"),
  body("transactionReference")
    .optional()
    .isString()
    .withMessage("transactionReference invalide"),
  body("scenario")
    .isIn(["SUCCESS", "FAILED", "CANCELLED"])
    .withMessage("scenario invalide"),
  body("customerEmail")
    .optional()
    .isEmail()
    .withMessage("Email client invalide"),
];

module.exports = {
  initiatePaymentValidation,
  webhookValidation,
  reconcilePaymentValidation,
  simulatePaymentValidation,
};
