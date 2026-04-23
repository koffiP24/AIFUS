const express = require("express");

const router = express.Router();

const {
  register,
  login,
  forgotPassword,
  verifyResetCode,
  resetPassword,
  getMe,
  googleAuth,
} = require("../controllers/authController");
const {
  validate,
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  verifyResetCodeValidation,
  resetPasswordValidation,
  googleAuthValidation,
} = require("../middlewares/validation");
const authMiddleware = require("../middlewares/auth");

router.post("/register", validate(registerValidation), register);
router.post("/login", validate(loginValidation), login);
router.post("/google", validate(googleAuthValidation), googleAuth);
router.post(
  "/forgot-password",
  validate(forgotPasswordValidation),
  forgotPassword,
);
router.post(
  "/verify-reset-code",
  validate(verifyResetCodeValidation),
  verifyResetCode,
);
router.post(
  "/reset-password",
  validate(resetPasswordValidation),
  resetPassword,
);
router.get("/me", authMiddleware, getMe);

module.exports = router;
