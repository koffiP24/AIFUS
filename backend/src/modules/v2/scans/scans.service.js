const { prismaTicketing, Prisma } = require("../../../lib/prismaTicketing");
const { HttpError } = require("../common/httpError");

const getTicketInclude = () => ({
  event: {
    select: {
      id: true,
      slug: true,
      name: true,
      type: true,
      startAt: true,
      venue: true,
    },
  },
  ticketType: {
    select: {
      id: true,
      code: true,
      name: true,
    },
  },
  raffleEntry: true,
});

const buildScanResponse = (ticket, scanResult, message) => ({
  scanResult,
  message,
  ticket: {
    id: ticket.id,
    ticketCode: ticket.ticketCode,
    status: ticket.status,
    checkedInAt: ticket.checkedInAt,
    participantFirstName: ticket.participantFirstName,
    participantLastName: ticket.participantLastName,
    participantEmail: ticket.participantEmail,
    event: ticket.event,
    ticketType: ticket.ticketType,
    raffleEntry: ticket.raffleEntry
      ? {
          serialNumber: ticket.raffleEntry.serialNumber,
          status: ticket.raffleEntry.status,
        }
      : null,
  },
});

const getTicketByCode = async (ticketCode) => {
  const ticket = await prismaTicketing.ticket.findUnique({
    where: { ticketCode },
    include: getTicketInclude(),
  });

  if (!ticket) {
    throw new HttpError(404, "Billet introuvable");
  }

  return ticket;
};

const validateScan = async (payload, scannerUser, requestMeta = {}) => {
  if (!payload.ticketCode && !payload.qrToken) {
    throw new HttpError(400, "ticketCode ou qrToken requis");
  }

  const now = new Date();
  let response = null;

  await prismaTicketing.$transaction(
    async (tx) => {
      const lookupFilter = payload.ticketCode
        ? { ticketCode: payload.ticketCode }
        : { qrToken: payload.qrToken };

      const ticket = await tx.ticket.findFirst({
        where: lookupFilter,
        include: getTicketInclude(),
      });

      if (!ticket) {
        response = {
          scanResult: "INVALID",
          message: "Billet introuvable",
          ticket: null,
        };
        return;
      }

      await tx.$queryRaw`
        SELECT id
        FROM tickets
        WHERE id = ${ticket.id}
        FOR UPDATE
      `;

      const freshTicket = await tx.ticket.findUnique({
        where: { id: ticket.id },
        include: getTicketInclude(),
      });

      if (!freshTicket) {
        throw new HttpError(404, "Billet introuvable");
      }

      if (
        payload.eventId &&
        freshTicket.eventId !== payload.eventId
      ) {
        await tx.ticketScan.create({
          data: {
            ticketId: freshTicket.id,
            scannedById: scannerUser.id,
            scanResult: "EVENT_MISMATCH",
            scannerDevice: payload.scannerDevice || null,
            scannerIp: requestMeta.ipAddress || null,
            payload: {
              expectedEventId: payload.eventId,
            },
            scannedAt: now,
          },
        });

        response = buildScanResponse(
          freshTicket,
          "EVENT_MISMATCH",
          "Billet valide mais sur un autre evenement",
        );
        return;
      }

      if (
        payload.eventSlug &&
        freshTicket.event.slug !== payload.eventSlug
      ) {
        await tx.ticketScan.create({
          data: {
            ticketId: freshTicket.id,
            scannedById: scannerUser.id,
            scanResult: "EVENT_MISMATCH",
            scannerDevice: payload.scannerDevice || null,
            scannerIp: requestMeta.ipAddress || null,
            payload: {
              expectedEventSlug: payload.eventSlug,
            },
            scannedAt: now,
          },
        });

        response = buildScanResponse(
          freshTicket,
          "EVENT_MISMATCH",
          "Billet valide mais sur un autre evenement",
        );
        return;
      }

      if (freshTicket.status === "CANCELLED") {
        await tx.ticketScan.create({
          data: {
            ticketId: freshTicket.id,
            scannedById: scannerUser.id,
            scanResult: "CANCELLED_TICKET",
            scannerDevice: payload.scannerDevice || null,
            scannerIp: requestMeta.ipAddress || null,
            scannedAt: now,
          },
        });

        response = buildScanResponse(
          freshTicket,
          "CANCELLED_TICKET",
          "Billet annule",
        );
        return;
      }

      if (freshTicket.status === "USED" || freshTicket.checkedInAt) {
        await tx.ticketScan.create({
          data: {
            ticketId: freshTicket.id,
            scannedById: scannerUser.id,
            scanResult: "ALREADY_USED",
            scannerDevice: payload.scannerDevice || null,
            scannerIp: requestMeta.ipAddress || null,
            scannedAt: now,
          },
        });

        response = buildScanResponse(
          freshTicket,
          "ALREADY_USED",
          "Ce billet a deja ete utilise",
        );
        return;
      }

      const updatedTicket = await tx.ticket.update({
        where: { id: freshTicket.id },
        data: {
          status: "USED",
          checkedInAt: now,
        },
        include: getTicketInclude(),
      });

      await tx.ticketScan.create({
        data: {
          ticketId: updatedTicket.id,
          scannedById: scannerUser.id,
          scanResult: "SUCCESS",
          scannerDevice: payload.scannerDevice || null,
          scannerIp: requestMeta.ipAddress || null,
          scannedAt: now,
        },
      });

      response = buildScanResponse(
        updatedTicket,
        "SUCCESS",
        "Billet valide. Acces autorise.",
      );
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead },
  );

  return response;
};

module.exports = {
  getTicketByCode,
  validateScan,
};
