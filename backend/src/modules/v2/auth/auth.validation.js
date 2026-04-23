const { body } = require("express-validator");

const registerValidation = [
  body("email").isEmail().withMessage("Email invalide"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Mot de passe minimum 8 caracteres"),
  body("firstName").notEmpty().withMessage("Prenom requis"),
  body("lastName").notEmpty().withMessage("Nom requis"),
  body("phone")
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ min: 8, max: 20 })
    .withMessage("Telephone invalide"),
];

const loginValidation = [
  body("email").isEmail().withMessage("Email invalide"),
  body("password").notEmpty().withMessage("Mot de passe requis"),
];

const refreshValidation = [
  body("refreshToken").notEmpty().withMessage("Refresh token requis"),
];

module.exports = {
  registerValidation,
  loginValidation,
  refreshValidation,
};
