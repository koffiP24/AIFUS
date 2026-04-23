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
    .withMessage("Mot de passe minimum 6 caracteres"),
  body("nom").notEmpty().withMessage("Nom requis"),
  body("prenom").notEmpty().withMessage("Prenom requis"),
  body("telephone")
    .optional()
    .isLength({ min: 8, max: 20 })
    .withMessage("Telephone invalide"),
];

const loginValidation = [
  body("email").isEmail().withMessage("Email invalide"),
  body("password").notEmpty().withMessage("Mot de passe requis"),
];

const forgotPasswordValidation = [
  body("identifiant")
    .isEmail()
    .withMessage("Adresse email invalide"),
];

const verifyResetCodeValidation = [
  body("identifiant")
    .isEmail()
    .withMessage("Adresse email invalide"),
  body("code")
    .matches(/^\d{6}$/)
    .withMessage("Code a 6 chiffres requis"),
];

const resetPasswordValidation = [
  body().custom((value, { req }) => {
    const hasLegacyToken = typeof req.body.token === "string" && req.body.token.trim() !== "";
    const hasCodeFlow =
      typeof req.body.identifiant === "string" &&
      req.body.identifiant.trim() !== "" &&
      typeof req.body.code === "string" &&
      /^\d{6}$/.test(req.body.code.trim());

    if (hasLegacyToken || hasCodeFlow) {
      return true;
    }

    throw new Error("Token ou couple email + code requis");
  }),
  body("identifiant")
    .optional()
    .isEmail()
    .withMessage("Adresse email invalide"),
  body("code")
    .optional()
    .matches(/^\d{6}$/)
    .withMessage("Code a 6 chiffres requis"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Mot de passe minimum 6 caracteres"),
];

const googleAuthValidation = [
  body("idToken").notEmpty().withMessage("Token Google requis"),
];

const inscriptionValidation = [
  body("categorie")
    .isIn(["ACTIF", "RETRAITE", "SANS_EMPLOI", "INVITE"])
    .withMessage("Categorie invalide"),
  body("nombreInvites")
    .isInt({ min: 0, max: 3 })
    .withMessage("Nombre d'invites entre 0 et 3"),
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  verifyResetCodeValidation,
  resetPasswordValidation,
  googleAuthValidation,
  inscriptionValidation,
};
