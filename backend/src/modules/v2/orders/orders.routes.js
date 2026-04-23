const express = require("express");

const { validate } = require("../../../middlewares/validation");
const { optionalTicketingAuth } = require("../../../middlewares/ticketingAuth");
const controller = require("./orders.controller");
const {
  previewValidation,
  createOrderValidation,
} = require("./orders.validation");

const router = express.Router();

router.post("/preview", validate(previewValidation), controller.previewOrder);
router.post(
  "/",
  optionalTicketingAuth,
  validate(createOrderValidation),
  controller.createOrder,
);
router.get("/:reference", optionalTicketingAuth, controller.getOrderByReference);

module.exports = router;
