const { body } = require("express-validator");

const validateScanValidation = [
  body("ticketCode")
    .optional()
    .isString()
    .withMessage("ticketCode invalide"),
  body("qrToken")
    .optional()
    .isString()
    .withMessage("qrToken invalide"),
  body("eventId")
    .optional()
    .isString()
    .withMessage("eventId invalide"),
  body("eventSlug")
    .optional()
    .isString()
    .withMessage("eventSlug invalide"),
  body("scannerDevice")
    .optional()
    .isString()
    .withMessage("scannerDevice invalide"),
];

module.exports = {
  validateScanValidation,
};
