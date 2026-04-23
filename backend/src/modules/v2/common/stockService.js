const { prismaTicketing } = require("../../../lib/prismaTicketing");

const expireReservations = async (
  tx = prismaTicketing,
  { ticketTypeIds = null, now = new Date() } = {},
) => {
  const where = {
    status: "ACTIVE",
    expiresAt: { lt: now },
  };

  if (Array.isArray(ticketTypeIds) && ticketTypeIds.length > 0) {
    where.ticketTypeId = { in: ticketTypeIds };
  }

  return tx.stockReservation.updateMany({
    where,
    data: {
      status: "EXPIRED",
      releasedAt: now,
    },
  });
};

const getStockUsageMap = async (
  tx = prismaTicketing,
  ticketTypeIds = [],
  now = new Date(),
) => {
  if (!Array.isArray(ticketTypeIds) || ticketTypeIds.length === 0) {
    return {};
  }

  const [convertedRows, activeRows] = await Promise.all([
    tx.stockReservation.groupBy({
      by: ["ticketTypeId"],
      where: {
        ticketTypeId: { in: ticketTypeIds },
        status: "CONVERTED",
      },
      _sum: { quantity: true },
    }),
    tx.stockReservation.groupBy({
      by: ["ticketTypeId"],
      where: {
        ticketTypeId: { in: ticketTypeIds },
        status: "ACTIVE",
        expiresAt: { gt: now },
      },
      _sum: { quantity: true },
    }),
  ]);

  const usageMap = Object.fromEntries(
    ticketTypeIds.map((ticketTypeId) => [
      ticketTypeId,
      { convertedQuantity: 0, reservedQuantity: 0 },
    ]),
  );

  convertedRows.forEach((row) => {
    usageMap[row.ticketTypeId] = {
      ...(usageMap[row.ticketTypeId] || {
        convertedQuantity: 0,
        reservedQuantity: 0,
      }),
      convertedQuantity: row._sum.quantity || 0,
    };
  });

  activeRows.forEach((row) => {
    usageMap[row.ticketTypeId] = {
      ...(usageMap[row.ticketTypeId] || {
        convertedQuantity: 0,
        reservedQuantity: 0,
      }),
      reservedQuantity: row._sum.quantity || 0,
    };
  });

  return usageMap;
};

const attachAvailability = async (
  tx = prismaTicketing,
  ticketTypes = [],
  now = new Date(),
) => {
  const ticketTypeIds = ticketTypes.map((ticketType) => ticketType.id);
  const usageMap = await getStockUsageMap(tx, ticketTypeIds, now);

  return ticketTypes.map((ticketType) => {
    const usage = usageMap[ticketType.id] || {
      convertedQuantity: 0,
      reservedQuantity: 0,
    };

    const availableQuantity =
      ticketType.stockTotal == null
        ? null
        : Math.max(
            ticketType.stockTotal -
              usage.convertedQuantity -
              usage.reservedQuantity,
            0,
          );

    return {
      ...ticketType,
      convertedQuantity: usage.convertedQuantity,
      reservedQuantity: usage.reservedQuantity,
      availableQuantity,
    };
  });
};

module.exports = {
  expireReservations,
  getStockUsageMap,
  attachAvailability,
};
