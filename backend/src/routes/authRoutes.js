const express = require("express");

const router = express.Router();

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
  sendSmsCodeValidation,
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
  validate(forgotPasswordValidation),
  forgotPassword,
);
router.post(
  "/reset-password",
  validate(resetPasswordValidation),
  resetPassword,
);
router.post("/send-sms-code", validate(sendSmsCodeValidation), sendSmsCode);
router.post("/verify-sms-code", validate(smsCodeValidation), verifySmsCode);
router.get("/me", authMiddleware, getMe);

module.exports = router;
