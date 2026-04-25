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
const { prisma } = require("./lib/prisma");
const { prismaTicketing } = require("./lib/prismaTicketing");

const app = express();
app.set("trust proxy", true);

const parseOrigin = (value) => {
  if (!value) {
    return null;
  }

  try {
    return new URL(value);
  } catch (error) {
    return null;
  }
};

const configuredOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URLS,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
  "https://unporticoed-jayceon-unwebbing.ngrok-free.dev",
]
  .flatMap((value) => String(value || "").split(","))
  .map((value) => value.trim())
  .filter(Boolean);

const allowedOrigins = new Set(configuredOrigins);

const isAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  const parsedOrigin = parseOrigin(origin);

  if (!parsedOrigin) {
    return false;
  }

  if (allowedOrigins.has(origin)) {
    return true;
  }

  const { protocol, hostname } = parsedOrigin;

  if (
    (protocol === "http:" || protocol === "https:") &&
    (hostname === "localhost" || hostname === "127.0.0.1")
  ) {
    return true;
  }

  if (hostname.endsWith(".ngrok-free.dev")) {
    return true;
  }

  if (hostname.endsWith(".vercel.app")) {
    return true;
  }

  return false;
};

const parseOrigin = (value) => {
  if (!value) {
    return null;
  }

  try {
    return new URL(value);
  } catch (error) {
    return null;
  }
};

const configuredOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URLS,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
  "https://unporticoed-jayceon-unwebbing.ngrok-free.dev",
]
  .flatMap((value) => String(value || "").split(","))
  .map((value) => value.trim())
  .filter(Boolean);

const allowedOrigins = new Set(configuredOrigins);

const isAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  const parsedOrigin = parseOrigin(origin);

  if (!parsedOrigin) {
    return false;
  }

  if (allowedOrigins.has(origin)) {
    return true;
  }

  const { protocol, hostname } = parsedOrigin;

  if (
    (protocol === "http:" || protocol === "https:") &&
    (hostname === "localhost" || hostname === "127.0.0.1")
  ) {
    return true;
  }

  if (hostname.endsWith(".ngrok-free.dev")) {
    return true;
  }

  return false;
};

// Middlewares globaux
app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS non autorise pour l'origine ${origin}`));
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
app.use(morgan("dev"));

// Routes
app.get("/healthz", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    await prismaTicketing.$queryRaw`SELECT 1`;

    res.status(200).json({
      ok: true,
      status: "healthy",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      ok: false,
      status: "unhealthy",
      timestamp: new Date().toISOString(),
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/inscriptions", inscriptionRoutes);
app.use("/api/tombola", tombolaRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/v2", ticketingV2Routes);

// Route de test
app.get("/", (req, res) => {
  res.json({ message: "API AIFUS Festivites 2026" });
});

// Gestion des erreurs
app.use(errorHandler);

module.exports = app;
