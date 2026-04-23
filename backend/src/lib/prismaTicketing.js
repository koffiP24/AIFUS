const generatedClient = require("../generated/prisma-next-mysql");

const { PrismaClient, Prisma } = generatedClient;

const globalForTicketingPrisma = globalThis;

const prismaTicketing =
  globalForTicketingPrisma.__aifusTicketingPrismaClient ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForTicketingPrisma.__aifusTicketingPrismaClient = prismaTicketing;
}

module.exports = {
  Prisma,
  PrismaClient,
  prismaTicketing,
};
