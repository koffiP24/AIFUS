const express = require("express");

const { validate } = require("../../../middlewares/validation");
const {
  authenticateTicketing,
  requireTicketingRoles,
} = require("../../../middlewares/ticketingAuth");
const controller = require("./scans.controller");
const { validateScanValidation } = require("./scans.validation");

const router = express.Router();

router.use(authenticateTicketing);
router.use(requireTicketingRoles("ADMIN", "SCANNER"));

router.post("/validate", validate(validateScanValidation), controller.validateScan);
router.get("/tickets/:ticketCode", controller.getTicketByCode);

module.exports = router;
