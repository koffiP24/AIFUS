const express = require("express");

const { validate } = require("../../../middlewares/validation");
const { optionalTicketingAuth } = require("../../../middlewares/ticketingAuth");
const controller = require("./payments.controller");
const {
  initiatePaymentValidation,
  webhookValidation,
  reconcilePaymentValidation,
  simulatePaymentValidation,
} = require("./payments.validation");

const router = express.Router();

router.get("/webhook", controller.webhookHealth);
router.get("/return", controller.handleReturnRedirect);
router.post("/return", controller.handleReturnRedirect);
router.post(
  "/initiate",
  optionalTicketingAuth,
  validate(initiatePaymentValidation),
  controller.initiatePayment,
);
router.post("/webhook", validate(webhookValidation), controller.handleWebhook);
router.post(
  "/reconcile",
  optionalTicketingAuth,
  validate(reconcilePaymentValidation),
  controller.reconcilePayment,
);
router.post(
  "/simulate",
  optionalTicketingAuth,
  validate(simulatePaymentValidation),
  controller.simulatePayment,
);

module.exports = router;
