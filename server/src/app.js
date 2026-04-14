const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const inscriptionRoutes = require("./routes/inscriptionRoutes");
const tombolaRoutes = require("./routes/tombolaRoutes");
const adminRoutes = require("./routes/adminRoutes");
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
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/inscriptions", inscriptionRoutes);
app.use("/api/tombola", tombolaRoutes);
app.use("/api/admin", adminRoutes);

// Route de test
app.get("/", (req, res) => {
  res.json({ message: "API AIFUS Festivités 2026" });
});

// Gestion des erreurs
app.use(errorHandler);

module.exports = app;
