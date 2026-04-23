const express = require("express");

const { optionalTicketingAuth } = require("../../../middlewares/ticketingAuth");
const controller = require("./tickets.controller");

const router = express.Router();

router.get("/download/:reference", optionalTicketingAuth, controller.getDownloadByReference);

module.exports = router;
