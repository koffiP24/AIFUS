const bcrypt = require("bcryptjs");

const { prismaTicketing } = require("../../../lib/prismaTicketing");
const { HttpError } = require("../common/httpError");
const {
  buildTokenResponse,
  rotateRefreshToken,
  revokeRefreshToken,
} = require("../common/tokenService");

const sanitizeUser = (user) => ({
  id: user.id,
  email: user.email,
  phone: user.phone,
  firstName: user.firstName,
  lastName: user.lastName,
  role: user.role,
  isActive: user.isActive,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const buildAuthPayload = async (user, metadata) => {
  const tokens = await buildTokenResponse(user, metadata);

  return {
    user: sanitizeUser(user),
    ...tokens,
  };
};

const register = async (payload, metadata) => {
  const email = payload.email.trim().toLowerCase();
  const phone = payload.phone?.trim() || null;

  const existingUser = await prismaTicketing.user.findFirst({
    where: {
      OR: [{ email }, ...(phone ? [{ phone }] : [])],
    },
  });

  if (existingUser) {
    throw new HttpError(409, "Un utilisateur existe deja avec cet email ou ce telephone");
  }

  const passwordHash = await bcrypt.hash(payload.password, 10);

  const user = await prismaTicketing.user.create({
    data: {
      email,
      phone,
      passwordHash,
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      role: "CUSTOMER",
    },
  });

  return buildAuthPayload(user, metadata);
};

const login = async (payload, metadata) => {
  const email = payload.email.trim().toLowerCase();

  const user = await prismaTicketing.user.findUnique({
    where: { email },
  });

  if (!user || !user.passwordHash) {
    throw new HttpError(401, "Email ou mot de passe incorrect");
  }

  if (!user.isActive) {
    throw new HttpError(403, "Compte inactif");
  }

  const passwordMatches = await bcrypt.compare(payload.password, user.passwordHash);

  if (!passwordMatches) {
    throw new HttpError(401, "Email ou mot de passe incorrect");
  }

  const updatedUser = await prismaTicketing.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  return buildAuthPayload(updatedUser, metadata);
};

const refresh = async (refreshToken, metadata) => {
  const refreshed = await rotateRefreshToken(refreshToken, metadata);

  if (!refreshed) {
    throw new HttpError(401, "Refresh token invalide ou expire");
  }

  return {
    user: sanitizeUser(refreshed.user),
    accessToken: refreshed.accessToken,
    refreshToken: refreshed.refreshToken,
    refreshTokenExpiresAt: refreshed.refreshTokenExpiresAt,
  };
};

const logout = async (refreshToken) => {
  const revoked = await revokeRefreshToken(refreshToken);

  if (!revoked) {
    throw new HttpError(404, "Refresh token introuvable");
  }

  return { success: true };
};

const getMe = async (userId) => {
  const user = await prismaTicketing.user.findUnique({
    where: { id: userId },
  });

  if (!user || !user.isActive) {
    throw new HttpError(404, "Utilisateur introuvable");
  }

  return sanitizeUser(user);
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  getMe,
};
