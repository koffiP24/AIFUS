const { body } = require("express-validator");

const initiatePaymentValidation = [
  body("orderReference").notEmpty().withMessage("orderReference requis"),
  body("provider")
    .optional()
    .isIn([
      "SIMULATION",
      "CINETPAY",
      "simulation",
      "cinetpay",
    ])
    .withMessage("provider invalide"),
  body("customerEmail")
    .optional()
    .isEmail()
    .withMessage("Email client invalide"),
];

const webhookValidation = [
  body().custom((value, { req }) => {
    if (req.headers["x-token"] || req.body?.cpm_trans_id || req.body?.transaction_id) {
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
  body("provider")
    .optional()
    .isIn(["CINETPAY", "cinetpay"])
    .withMessage("provider invalide"),
  body().custom((value, { req }) => {
    if (!req.body?.orderReference && !req.body?.transactionReference) {
      throw new Error("orderReference ou transactionReference requis");
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
