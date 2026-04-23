const { prismaTicketing } = require("../../../lib/prismaTicketing");
const { attachAvailability, expireReservations } = require("../common/stockService");

const listTicketTypes = async ({ eventSlug, eventId, includeInactive = false } = {}) => {
  await expireReservations(prismaTicketing);

  const where = {};

  if (!includeInactive) {
    where.isActive = true;
  }

  if (eventId) {
    where.eventId = eventId;
  }

  if (eventSlug) {
    where.event = { slug: eventSlug };
  }

  const ticketTypes = await prismaTicketing.ticketType.findMany({
    where,
    include: {
      event: {
        select: {
          id: true,
          name: true,
          slug: true,
          type: true,
          startAt: true,
          endAt: true,
          isActive: true,
        },
      },
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return attachAvailability(prismaTicketing, ticketTypes);
};

module.exports = {
  listTicketTypes,
};
