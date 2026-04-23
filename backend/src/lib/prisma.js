const { PrismaClient } = require("../generated/prisma");

const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.__aifusPrismaClient ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__aifusPrismaClient = prisma;
}

module.exports = {
  PrismaClient,
  prisma,
};
