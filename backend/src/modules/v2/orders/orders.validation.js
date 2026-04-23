const { body } = require("express-validator");

const orderItemValidation = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Au moins un billet est requis"),
  body("items.*.ticketTypeId")
    .notEmpty()
    .withMessage("ticketTypeId requis"),
  body("items.*.quantity")
    .isInt({ min: 1, max: 100 })
    .withMessage("Quantite invalide"),
];

const previewValidation = orderItemValidation;

const createOrderValidation = [
  ...orderItemValidation,
  body("customer.firstName")
    .optional()
    .isString()
    .withMessage("Prenom client invalide"),
  body("customer.lastName")
    .optional()
    .isString()
    .withMessage("Nom client invalide"),
  body("customer.email")
    .optional()
    .isEmail()
    .withMessage("Email client invalide"),
  body("customer.phone")
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ min: 8, max: 20 })
    .withMessage("Telephone client invalide"),
];

module.exports = {
  previewValidation,
  createOrderValidation,
};
