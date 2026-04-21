const express = require("express");

const { simulatePayment } = require("../controllers/inscriptionController");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

router.use(authMiddleware);
router.post("/simulate", simulatePayment);

module.exports = router;
