const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const { prismaTicketing } = require("../../../lib/prismaTicketing");
const { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_TTL_DAYS } = require("./config");

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing");
  }

  return process.env.JWT_SECRET;
};

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const signAccessToken = (user) =>
  jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      scope: "ticketing-v2",
    },
    getJwtSecret(),
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN },
  );

const buildTokenResponse = async (user, metadata = {}) => {
  const refreshToken = crypto.randomBytes(48).toString("hex");
  const expiresAt = new Date(
    Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
  );

  await prismaTicketing.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      userAgent: metadata.userAgent || null,
      ipAddress: metadata.ipAddress || null,
      expiresAt,
    },
  });

  return {
    accessToken: signAccessToken(user),
    refreshToken,
    refreshTokenExpiresAt: expiresAt,
  };
};

const rotateRefreshToken = async (rawRefreshToken, metadata = {}) => {
  const tokenHash = hashToken(rawRefreshToken);

  const existingToken = await prismaTicketing.refreshToken.findUnique({
    where: { tokenHash },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          phone: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
        },
      },
    },
  });

  if (
    !existingToken ||
    existingToken.revokedAt ||
    existingToken.expiresAt <= new Date() ||
    !existingToken.user?.isActive
  ) {
    return null;
  }

  await prismaTicketing.refreshToken.update({
    where: { id: existingToken.id },
    data: { revokedAt: new Date() },
  });

  const tokens = await buildTokenResponse(existingToken.user, metadata);

  return {
    user: existingToken.user,
    ...tokens,
  };
};

const revokeRefreshToken = async (rawRefreshToken) => {
  const tokenHash = hashToken(rawRefreshToken);
  const existingToken = await prismaTicketing.refreshToken.findUnique({
    where: { tokenHash },
  });

  if (!existingToken) {
    return false;
  }

  if (existingToken.revokedAt) {
    return true;
  }

  await prismaTicketing.refreshToken.update({
    where: { id: existingToken.id },
    data: { revokedAt: new Date() },
  });

  return true;
};

module.exports = {
  buildTokenResponse,
  rotateRefreshToken,
  revokeRefreshToken,
};
