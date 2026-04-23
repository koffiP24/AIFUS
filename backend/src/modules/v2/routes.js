const express = require("express");

const authRoutes = require("./auth/auth.routes");
const eventsRoutes = require("./events/events.routes");
const ticketTypesRoutes = require("./ticket-types/ticketTypes.routes");
const ordersRoutes = require("./orders/orders.routes");
const paymentsRoutes = require("./payments/payments.routes");
const ticketsRoutes = require("./tickets/tickets.routes");
const scansRoutes = require("./scans/scans.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/events", eventsRoutes);
router.use("/ticket-types", ticketTypesRoutes);
router.use("/orders", ordersRoutes);
router.use("/payments", paymentsRoutes);
router.use("/tickets", ticketsRoutes);
router.use("/scans", scansRoutes);

module.exports = router;
