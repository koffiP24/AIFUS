const { body } = require("express-validator");

const initiatePaymentValidation = [
  body("orderReference").notEmpty().withMessage("orderReference requis"),
  body("provider")
    .optional()
    .isIn(["SIMULATION", "PAWAPAY", "simulation", "pawapay"])
    .withMessage("provider invalide"),
  body("customerEmail")
    .optional()
    .isEmail()
    .withMessage("Email client invalide"),
];

const webhookValidation = [
  body().custom((value, { req }) => {
    if (req.body?.depositId && req.body?.status) {
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
