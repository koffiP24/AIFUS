const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  sendSmsCode,
  verifySmsCode,
  getMe,
  googleAuth,
} = require("../controllers/authController");
const {
  validate,
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  smsCodeValidation,
  googleAuthValidation,
} = require("../middlewares/validation");
const authMiddleware = require("../middlewares/auth");

router.post("/register", validate(registerValidation), register);
router.post("/login", validate(loginValidation), login);
router.post("/google", validate(googleAuthValidation), googleAuth);

router.post(
  "/forgot-password",
  forgotPassword,
);

router.post(
  "/reset-password",
  validate(resetPasswordValidation),
  resetPassword,
);

router.post("/send-sms-code", sendSmsCode);
router.post("/verify-sms-code", verifySmsCode);

router.get("/me", authMiddleware, getMe);

module.exports = router;
