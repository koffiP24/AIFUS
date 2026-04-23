const jwt = require("jsonwebtoken");

const { prismaTicketing } = require("../lib/prismaTicketing");

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing");
  }

  return process.env.JWT_SECRET;
};

const decodeAccessToken = (token) => {
  const payload = jwt.verify(token, getJwtSecret());

  if (payload.scope !== "ticketing-v2") {
    throw new Error("Token scope invalid");
  }

  return payload;
};

const loadUserFromPayload = async (payload) => {
  const user = await prismaTicketing.user.findUnique({
    where: { id: payload.sub },
    select: {
      id: true,
      email: true,
      phone: true,
      firstName: true,
      lastName: true,
      role: true,
      isActive: true,
    },
  });

  if (!user || !user.isActive) {
    return null;
  }

  return user;
};

const authenticateTicketing = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Acces non autorise, token manquant" });
  }

  try {
    const token = authHeader.slice("Bearer ".length).trim();
    const payload = decodeAccessToken(token);
    const user = await loadUserFromPayload(payload);

    if (!user) {
      return res.status(401).json({ message: "Utilisateur introuvable ou inactif" });
    }

    req.ticketingUser = user;
    return next();
  } catch (_error) {
    return res.status(401).json({ message: "Token invalide ou expire" });
  }
};

const optionalTicketingAuth = async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  try {
    const token = authHeader.slice("Bearer ".length).trim();
    const payload = decodeAccessToken(token);
    const user = await loadUserFromPayload(payload);

    if (user) {
      req.ticketingUser = user;
    }
  } catch (_error) {
    // Intentionally ignore invalid optional auth so guest checkout keeps working.
  }

  return next();
};

const requireTicketingRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.ticketingUser) {
      return res.status(401).json({ message: "Authentification requise" });
    }

    if (!roles.includes(req.ticketingUser.role)) {
      return res.status(403).json({ message: "Acces refuse" });
    }

    return next();
  };
};

module.exports = {
  authenticateTicketing,
  optionalTicketingAuth,
  requireTicketingRoles,
};
