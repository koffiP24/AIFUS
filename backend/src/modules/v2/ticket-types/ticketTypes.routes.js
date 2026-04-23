const express = require("express");

const controller = require("./ticketTypes.controller");

const router = express.Router();

router.get("/", controller.listTicketTypes);

module.exports = router;
