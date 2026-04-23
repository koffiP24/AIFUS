const express = require("express");

const controller = require("./events.controller");

const router = express.Router();

router.get("/", controller.listEvents);
router.get("/:slug", controller.getEventBySlug);

module.exports = router;
