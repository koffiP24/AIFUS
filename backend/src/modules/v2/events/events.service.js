const { prismaTicketing } = require("../../../lib/prismaTicketing");
const { attachAvailability, expireReservations } = require("../common/stockService");
const { HttpError } = require("../common/httpError");

const listEvents = async ({ includeInactive = false } = {}) => {
  await expireReservations(prismaTicketing);

  const events = await prismaTicketing.event.findMany({
    where: includeInactive ? undefined : { isActive: true },
    include: {
      ticketTypes: {
        where: includeInactive ? undefined : { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      },
    },
    orderBy: [{ startAt: "asc" }, { createdAt: "asc" }],
  });

  const hydratedEvents = await Promise.all(
    events.map(async (event) => ({
      ...event,
      ticketTypes: await attachAvailability(prismaTicketing, event.ticketTypes),
    })),
  );

  return hydratedEvents;
};

const getEventBySlug = async (slug) => {
  await expireReservations(prismaTicketing);

  const event = await prismaTicketing.event.findUnique({
    where: { slug },
    include: {
      ticketTypes: {
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      },
    },
  });

  if (!event) {
    throw new HttpError(404, "Evenement introuvable");
  }

  return {
    ...event,
    ticketTypes: await attachAvailability(prismaTicketing, event.ticketTypes),
  };
};

module.exports = {
  listEvents,
  getEventBySlug,
};
