const express = require("express");

const { validate } = require("../../../middlewares/validation");
const { authenticateTicketing } = require("../../../middlewares/ticketingAuth");
const controller = require("./auth.controller");
const {
  registerValidation,
  loginValidation,
  refreshValidation,
} = require("./auth.validation");

const router = express.Router();

router.post("/register", validate(registerValidation), controller.register);
router.post("/login", validate(loginValidation), controller.login);
router.post("/refresh", validate(refreshValidation), controller.refresh);
router.post("/logout", validate(refreshValidation), controller.logout);
router.get("/me", authenticateTicketing, controller.getMe);

module.exports = router;
