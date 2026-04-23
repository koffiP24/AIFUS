const { prismaTicketing } = require("../../../lib/prismaTicketing");
const { HttpError } = require("./httpError");

const ORDER_FULL_INCLUDE = {
  items: {
    include: {
      event: {
        select: {
          id: true,
          name: true,
          slug: true,
          type: true,
          startAt: true,
          endAt: true,
          venue: true,
        },
      },
      ticketType: {
        select: {
          id: true,
          name: true,
          code: true,
          priceAmount: true,
          currency: true,
        },
      },
      tickets: {
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "asc" },
  },
  stockReservations: {
    orderBy: { createdAt: "asc" },
  },
  payments: {
    orderBy: { createdAt: "desc" },
  },
  tickets: {
    include: {
      event: {
        select: {
          id: true,
          name: true,
          slug: true,
          type: true,
        },
      },
      ticketType: {
        select: {
          id: true,
          name: true,
          code: true,
          priceAmount: true,
          currency: true,
        },
      },
      raffleEntry: true,
    },
    orderBy: { createdAt: "asc" },
  },
  raffleTickets: {
    orderBy: { createdAt: "asc" },
  },
};

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const canRetryPayment = (status) =>
  ["PENDING", "PAYMENT_PROCESSING", "FAILED"].includes(status);

const isExpiredCandidate = (status) => canRetryPayment(status);

const buildRemainingSeconds = (order) =>
  canRetryPayment(order.status)
    ? Math.max(
        Math.floor((new Date(order.expiresAt).getTime() - Date.now()) / 1000),
        0,
      )
    : 0;

const serializeOrderEntity = (order) => ({
  ...order,
  remainingSeconds: buildRemainingSeconds(order),
});

const getOrderByReferenceOrThrow = async (
  tx = prismaTicketing,
  reference,
  include = ORDER_FULL_INCLUDE,
) => {
  const order = await tx.order.findUnique({
    where: { reference },
    include,
  });

  if (!order) {
    throw new HttpError(404, "Commande introuvable");
  }

  return order;
};

const expireOrderIfNeeded = async (
  tx = prismaTicketing,
  order,
  now = new Date(),
) => {
  if (!isExpiredCandidate(order.status) || !order.expiresAt || order.expiresAt > now) {
    return order;
  }

  await tx.stockReservation.updateMany({
    where: {
      orderId: order.id,
      status: "ACTIVE",
    },
    data: {
      status: "EXPIRED",
      releasedAt: now,
    },
  });

  await tx.payment.updateMany({
    where: {
      orderId: order.id,
      status: {
        in: ["INITIATED", "PENDING"],
      },
    },
    data: {
      status: "CANCELLED",
      failureReason: "Commande expiree avant confirmation",
    },
  });

  return tx.order.update({
    where: { id: order.id },
    data: {
      status: "EXPIRED",
      failureReason: "Commande expiree",
    },
    include: ORDER_FULL_INCLUDE,
  });
};

const assertOrderAccess = (order, { user = null, customerEmail = null } = {}) => {
  if (user) {
    if (user.role === "ADMIN") {
      return;
    }

    if (order.userId && order.userId === user.id) {
      return;
    }

    if (normalizeEmail(order.customerEmail) === normalizeEmail(user.email)) {
      return;
    }
  }

  if (
    customerEmail &&
    normalizeEmail(order.customerEmail) === normalizeEmail(customerEmail)
  ) {
    return;
  }

  throw new HttpError(
    403,
    "Acces refuse a cette commande. Fournissez l'email de commande ou connectez-vous.",
  );
};

const loadAndAuthorizeOrder = async (
  tx = prismaTicketing,
  reference,
  accessOptions = {},
) => {
  let order = await getOrderByReferenceOrThrow(tx, reference);
  order = await expireOrderIfNeeded(tx, order);
  assertOrderAccess(order, accessOptions);
  return order;
};

module.exports = {
  ORDER_FULL_INCLUDE,
  canRetryPayment,
  serializeOrderEntity,
  getOrderByReferenceOrThrow,
  expireOrderIfNeeded,
  assertOrderAccess,
  loadAndAuthorizeOrder,
  normalizeEmail,
};
