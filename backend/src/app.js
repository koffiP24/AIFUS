const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const authRoutes = require("./routes/authRoutes");
const inscriptionRoutes = require("./routes/inscriptionRoutes");
const tombolaRoutes = require("./routes/tombolaRoutes");
const adminRoutes = require("./routes/adminRoutes");
const eventRoutes = require("./routes/eventRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const ticketingV2Routes = require("./modules/v2/routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Middlewares globaux
app.use(helmet());
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "https://unporticoed-jayceon-unwebbing.ngrok-free.dev",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.some(o => o === origin || origin.endsWith('.ngrok-free.dev'))) {
        callback(null, true);
      } else {
        callback(new Error('CORS non autorisé'));
      }
    },
    credentials: true,
  }),
);
app.use(
  express.json({
    verify: (req, res, buffer) => {
      if (req.originalUrl?.startsWith("/api/v2/payments/webhook")) {
        req.rawBody = buffer.toString("utf8");
      }
    },
  }),
);
app.use(
  express.urlencoded({
    extended: true,
    verify: (req, res, buffer) => {
      if (
        req.originalUrl?.startsWith("/api/v2/payments/webhook") ||
        req.originalUrl?.startsWith("/api/v2/payments/return")
      ) {
        req.rawBody = buffer.toString("utf8");
      }
    },
  }),
);
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/inscriptions", inscriptionRoutes);
app.use("/api/tombola", tombolaRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/v2", ticketingV2Routes);

// Route de test
app.get("/", (req, res) => {
  res.json({ message: "API AIFUS Festivités 2026" });
});

// Gestion des erreurs
app.use(errorHandler);

module.exports = app;
