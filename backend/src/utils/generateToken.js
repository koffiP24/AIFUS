const jwt = require("jsonwebtoken");

const getJwtSecret = () => {
  const jwtSecret = String(process.env.JWT_SECRET || "").trim();

  if (!jwtSecret) {
    const error = new Error("JWT_SECRET manquant");
    error.statusCode = 500;
    error.publicMessage =
      "Configuration serveur incomplete. Contactez l'administrateur.";
    throw error;
  }

  return jwtSecret;
};

const generateToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    getJwtSecret(),
    { expiresIn: "7d" },
  );

module.exports = generateToken;
