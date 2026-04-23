const crypto = require("crypto");

const { prismaTicketing } = require("../../../lib/prismaTicketing");
const { HttpError } = require("../common/httpError");
const {
  loadAndAuthorizeOrder,
  serializeOrderEntity,
} = require("../common/orderService");

const getQrSigningSecret = () =>
  process.env.QR_SIGNING_SECRET || process.env.JWT_SECRET || "aifus-v2-dev";

const buildTicketCodeCandidate = () =>
  `TCK-${crypto.randomBytes(6).toString("hex").toUpperCase()}`;

const buildQrTokenCandidate = () => {
  const raw = crypto.randomBytes(16).toString("hex");
  const signature = crypto
    .createHmac("sha256", getQrSigningSecret())
    .update(raw)
    .digest("hex")
    .slice(0, 16);

  return `${raw}.${signature}`;
};

const buildRaffleSerialCandidate = () =>
  `RAF-${crypto.randomBytes(5).toString("hex").toUpperCase()}`;

const generateUniqueValue = async (tx, modelName, fieldName, generator) => {
  for (let attempt = 1; attempt <= 15; attempt += 1) {
    const candidate = generator();
    const existing = await tx[modelName].findFirst({
      where: { [fieldName]: candidate },
      select: { id: true },
    });

    if (!existing) {
      return candidate;
    }
  }

  throw new HttpError(500, `Impossible de generer ${fieldName} unique`);
};

const ensureOrderTickets = async (
  tx = prismaTicketing,
  orderId,
  now = new Date(),
) => {
  const order = await tx.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          event: {
            select: {
              id: true,
              slug: true,
              type: true,
              name: true,
            },
          },
          ticketType: {
            select: {
              id: true,
              code: true,
              name: true,
            },
          },
          tickets: {
            include: { raffleEntry: true },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "asc" },
      },
      tickets: {
        include: { raffleEntry: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!order) {
    throw new HttpError(404, "Commande introuvable pour generation de billets");
  }

  if (order.status !== "PAID") {
    throw new HttpError(409, "La commande doit etre payee avant la generation des billets");
  }

  for (const item of order.items) {
    if (!item.event) {
      throw new HttpError(
        500,
        `Evenement manquant pour l'item de commande ${item.id}`,
      );
    }

    if (!item.ticketType) {
      throw new HttpError(
        500,
        `Type de billet manquant pour l'item de commande ${item.id}`,
      );
    }

    const missingCount = Math.max(item.quantity - item.tickets.length, 0);

    for (let index = 0; index < missingCount; index += 1) {
      const ticketCode = await generateUniqueValue(
        tx,
        "ticket",
        "ticketCode",
        buildTicketCodeCandidate,
      );
      const qrToken = await generateUniqueValue(
        tx,
        "ticket",
        "qrToken",
        buildQrTokenCandidate,
      );

      const ticket = await tx.ticket.create({
        data: {
          orderId: order.id,
          orderItemId: item.id,
          eventId: item.eventId,
          ticketTypeId: item.ticketTypeId,
          ticketCode,
          qrToken,
          participantFirstName: order.customerFirstName,
          participantLastName: order.customerLastName,
          participantEmail: order.customerEmail,
          participantPhone: order.customerPhone,
          status: "GENERATED",
          metadata: {
            orderReference: order.reference,
            eventSlug: item.event.slug,
            ticketTypeCode: item.ticketType.code,
            generatedAt: now.toISOString(),
          },
        },
      });

      if (item.event.type === "RAFFLE") {
        const serialNumber = await generateUniqueValue(
          tx,
          "raffleTicket",
          "serialNumber",
          buildRaffleSerialCandidate,
        );

        await tx.raffleTicket.create({
          data: {
            orderId: order.id,
            ticketId: ticket.id,
            serialNumber,
            status: "ASSIGNED",
            assignedTo: order.customerEmail,
            metadata: {
              orderReference: order.reference,
              ticketCode: ticket.ticketCode,
            },
          },
        });
      }
    }
  }

  const orderWithTickets = await tx.order.findUnique({
    where: { id: order.id },
    include: {
      tickets: {
        include: {
          event: {
            select: { id: true, slug: true, name: true, type: true },
          },
          ticketType: {
            select: { id: true, code: true, name: true, priceAmount: true, currency: true },
          },
          raffleEntry: true,
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!orderWithTickets) {
    throw new HttpError(404, "Commande introuvable apres generation");
  }

  if (orderWithTickets.customerEmail) {
    const existingNotification = await tx.notification.findFirst({
      where: {
        orderId: order.id,
        channel: "EMAIL",
        templateKey: "order-paid-confirmation",
      },
      select: { id: true },
    });

    if (!existingNotification) {
      await tx.notification.create({
        data: {
          orderId: order.id,
          channel: "EMAIL",
          recipient: orderWithTickets.customerEmail,
          templateKey: "order-paid-confirmation",
          status: "PENDING",
          payload: {
            orderReference: order.reference,
            ticketCount: orderWithTickets.tickets.length,
          },
        },
      });
    }
  }

  return orderWithTickets.tickets;
};

const buildDownloadPayload = (order) => {
  if (order.status !== "PAID") {
    throw new HttpError(409, "Les billets ne sont disponibles qu'apres paiement confirme");
  }

  return {
    orderReference: order.reference,
    customer: {
      firstName: order.customerFirstName,
      lastName: order.customerLastName,
      email: order.customerEmail,
      phone: order.customerPhone,
    },
    totalAmount: order.totalAmount,
    currency: order.currency,
    status: order.status,
    generatedAt: new Date().toISOString(),
    tickets: order.tickets.map((ticket) => ({
      id: ticket.id,
      ticketCode: ticket.ticketCode,
      qrToken: ticket.qrToken,
      status: ticket.status,
      participantFirstName: ticket.participantFirstName,
      participantLastName: ticket.participantLastName,
      participantEmail: ticket.participantEmail,
      participantPhone: ticket.participantPhone,
      event: ticket.event,
      ticketType: ticket.ticketType,
      raffleEntry: ticket.raffleEntry
        ? {
            serialNumber: ticket.raffleEntry.serialNumber,
            status: ticket.raffleEntry.status,
          }
        : null,
    })),
    raffleTickets: order.raffleTickets.map((raffleTicket) => ({
      serialNumber: raffleTicket.serialNumber,
      status: raffleTicket.status,
      assignedTo: raffleTicket.assignedTo,
    })),
  };
};

const getDownloadByReference = async (
  reference,
  { user = null, customerEmail = null } = {},
) => {
  const order = await loadAndAuthorizeOrder(prismaTicketing, reference, {
    user,
    customerEmail,
  });

  return buildDownloadPayload(serializeOrderEntity(order));
};

module.exports = {
  ensureOrderTickets,
  getDownloadByReference,
  buildDownloadPayload,
};
