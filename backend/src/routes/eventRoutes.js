const express = require("express");

const { getPublishedEvents } = require("../controllers/eventController");

const router = express.Router();

router.get("/", getPublishedEvents);

module.exports = router;
