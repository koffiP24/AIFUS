const { body, validationResult } = require("express-validator");

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    const extractedErrors = errors.array().map((err) => err.msg);
    res.status(400).json({
      message: extractedErrors.join(", "),
      errors: extractedErrors,
    });
  };
};

const registerValidation = [
  body("email").isEmail().withMessage("Email invalide"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Mot de passe minimum 6 caractères"),
  body("nom").notEmpty().withMessage("Nom requis"),
  body("prenom").notEmpty().withMessage("Prénom requis"),
  body("telephone")
    .optional()
    .isLength({ min: 8, max: 20 })
    .withMessage("Téléphone invalide"),
];

const loginValidation = [
  body("email").isEmail().withMessage("Email invalide"),
  body("password").notEmpty().withMessage("Mot de passe requis"),
];

const forgotPasswordValidation = [
  body("identifiant").notEmpty().withMessage("Email ou téléphone requis"),
];

const resetPasswordValidation = [
  body("token").notEmpty().withMessage("Token requis"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Mot de passe minimum 6 caractères"),
];

const smsCodeValidation = [
  body("phone").notEmpty().withMessage("Téléphone requis"),
  body("code").isLength({ min: 6, max: 6 }).withMessage("Code à 6 chiffres requis"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("Mot de passe minimum 6 caractères"),
];

const googleAuthValidation = [
  body("idToken").notEmpty().withMessage("Token Google requis"),
];

const inscriptionValidation = [
  body("categorie")
    .isIn(["ACTIF", "RETRAITE", "SANS_EMPLOI", "INVITE"])
    .withMessage("Catégorie invalide"),
  body("nombreInvites")
    .isInt({ min: 0, max: 3 })
    .withMessage("Nombre d'invités entre 0 et 3"),
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  smsCodeValidation,
  googleAuthValidation,
  inscriptionValidation,
};
