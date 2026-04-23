const crypto = require("crypto");

const { prismaTicketing, Prisma } = require("../../../lib/prismaTicketing");
const { HttpError } = require("../common/httpError");
const { ORDER_RESERVATION_TTL_MINUTES } = require("../common/config");
const { expireReservations, getStockUsageMap } = require("../common/stockService");
const {
  serializeOrderEntity,
  getOrderByReferenceOrThrow,
  loadAndAuthorizeOrder,
} = require("../common/orderService");

const RETRYABLE_ERROR_CODES = new Set(["P2034"]);

const isSaleWindowOpen = (entity, now) => {
  if (entity.saleStartsAt && entity.saleStartsAt > now) {
    return false;
  }

  if (entity.saleEndsAt && entity.saleEndsAt < now) {
    return false;
  }

  return true;
};

const normalizeItems = (items = []) => {
  const grouped = new Map();

  items.forEach((item) => {
    const ticketTypeId = String(item.ticketTypeId || "").trim();
    const quantity = Number.parseInt(item.quantity, 10);

    if (!ticketTypeId || Number.isNaN(quantity) || quantity <= 0) {
      return;
    }

    grouped.set(ticketTypeId, (grouped.get(ticketTypeId) || 0) + quantity);
  });

  return Array.from(grouped.entries()).map(([ticketTypeId, quantity]) => ({
    ticketTypeId,
    quantity,
  }));
};

const buildCustomerSnapshot = (customer = {}, user = null) => {
  return {
    firstName: customer.firstName?.trim() || user?.firstName || "",
    lastName: customer.lastName?.trim() || user?.lastName || "",
    email: customer.email?.trim().toLowerCase() || user?.email || "",
    phone: customer.phone?.trim() || user?.phone || null,
  };
};

const ensureCustomerSnapshot = (snapshot) => {
  if (!snapshot.firstName || !snapshot.lastName || !snapshot.email) {
    throw new HttpError(
      400,
      "Les informations client firstName, lastName et email sont requises",
    );
  }
};

const buildOrderReference = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `ORD-${date}-${randomPart}`;
};

const loadRequestedTicketTypes = async (tx, normalizedItems) => {
  const ticketTypeIds = normalizedItems.map((item) => item.ticketTypeId);

  const ticketTypes = await tx.ticketType.findMany({
    where: { id: { in: ticketTypeIds } },
    include: {
      event: {
        select: {
          id: true,
          name: true,
          slug: true,
          isActive: true,
          saleStartsAt: true,
          saleEndsAt: true,
        },
      },
    },
  });

  return new Map(ticketTypes.map((ticketType) => [ticketType.id, ticketType]));
};

const buildOrderPricing = async (tx, normalizedItems, now) => {
  const ticketTypesById = await loadRequestedTicketTypes(tx, normalizedItems);
  const usageMap = await getStockUsageMap(
    tx,
    normalizedItems.map((item) => item.ticketTypeId),
    now,
  );

  let subtotalAmount = 0;

  const lines = normalizedItems.map((item) => {
    const ticketType = ticketTypesById.get(item.ticketTypeId);

    if (!ticketType) {
      throw new HttpError(404, `Type de billet introuvable: ${item.ticketTypeId}`);
    }

    if (!ticketType.isActive || !ticketType.event?.isActive) {
      throw new HttpError(400, `${ticketType.name} n'est pas disponible`);
    }

    if (!isSaleWindowOpen(ticketType, now) || !isSaleWindowOpen(ticketType.event, now)) {
      throw new HttpError(400, `${ticketType.name} n'est pas en vente actuellement`);
    }

    if (item.quantity > ticketType.maxPerOrder) {
      throw new HttpError(
        400,
        `La quantite maximale pour ${ticketType.name} est ${ticketType.maxPerOrder}`,
      );
    }

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

    if (availableQuantity != null && item.quantity > availableQuantity) {
      throw new HttpError(
        409,
        `Stock insuffisant pour ${ticketType.name}`,
        {
          ticketTypeId: ticketType.id,
          requestedQuantity: item.quantity,
          availableQuantity,
        },
      );
    }

    const unitAmount = ticketType.priceAmount;
    const subtotal = unitAmount * item.quantity;
    subtotalAmount += subtotal;

    return {
      ticketType,
      quantity: item.quantity,
      unitAmount,
      subtotalAmount: subtotal,
      availableQuantity,
      label: `${ticketType.event.name} - ${ticketType.name}`,
    };
  });

  return {
    lines,
    subtotalAmount,
    totalAmount: subtotalAmount,
    feesAmount: 0,
  };
};

const serializeOrder = async (reference) =>
  serializeOrderEntity(await getOrderByReferenceOrThrow(prismaTicketing, reference));

const previewOrder = async (payload) => {
  const now = new Date();
  const normalizedItems = normalizeItems(payload.items);

  if (normalizedItems.length === 0) {
    throw new HttpError(400, "Aucun billet valide fourni");
  }

  await expireReservations(prismaTicketing, {
    ticketTypeIds: normalizedItems.map((item) => item.ticketTypeId),
    now,
  });

  const pricing = await buildOrderPricing(prismaTicketing, normalizedItems, now);
  const expiresAt = new Date(now.getTime() + ORDER_RESERVATION_TTL_MINUTES * 60 * 1000);

  return {
    currency: "XOF",
    subtotalAmount: pricing.subtotalAmount,
    feesAmount: pricing.feesAmount,
    totalAmount: pricing.totalAmount,
    expiresAt,
    reservationTtlMinutes: ORDER_RESERVATION_TTL_MINUTES,
    items: pricing.lines.map((line) => ({
      ticketTypeId: line.ticketType.id,
      ticketTypeCode: line.ticketType.code,
      ticketTypeName: line.ticketType.name,
      eventId: line.ticketType.event.id,
      eventName: line.ticketType.event.name,
      quantity: line.quantity,
      unitAmount: line.unitAmount,
      subtotalAmount: line.subtotalAmount,
      availableQuantity: line.availableQuantity,
      currency: line.ticketType.currency,
      label: line.label,
    })),
  };
};

const lockTicketTypes = async (tx, ticketTypeIds) => {
  await tx.$queryRaw`
    SELECT id
    FROM ticket_types
    WHERE id IN (${Prisma.join(ticketTypeIds)})
    FOR UPDATE
  `;
};

const isRetryableError = (error) => {
  if (error?.code && RETRYABLE_ERROR_CODES.has(error.code)) {
    return true;
  }

  const message = String(error?.message || "").toLowerCase();
  return message.includes("deadlock") || message.includes("serialization");
};

const createOrder = async (payload, user = null) => {
  const normalizedItems = normalizeItems(payload.items);

  if (normalizedItems.length === 0) {
    throw new HttpError(400, "Aucun billet valide fourni");
  }

  const customer = buildCustomerSnapshot(payload.customer, user);
  ensureCustomerSnapshot(customer);

  let lastError = null;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const createdOrderReference = buildOrderReference();
      const now = new Date();
      const expiresAt = new Date(
        now.getTime() + ORDER_RESERVATION_TTL_MINUTES * 60 * 1000,
      );

      await prismaTicketing.$transaction(
        async (tx) => {
          const ticketTypeIds = normalizedItems.map((item) => item.ticketTypeId);

          await expireReservations(tx, { ticketTypeIds, now });
          await lockTicketTypes(tx, ticketTypeIds);

          const pricing = await buildOrderPricing(tx, normalizedItems, now);

          const order = await tx.order.create({
            data: {
              reference: createdOrderReference,
              userId: user?.id || null,
              customerFirstName: customer.firstName,
              customerLastName: customer.lastName,
              customerEmail: customer.email,
              customerPhone: customer.phone,
              currency: "XOF",
              subtotalAmount: pricing.subtotalAmount,
              feesAmount: pricing.feesAmount,
              totalAmount: pricing.totalAmount,
              status: "PENDING",
              expiresAt,
            },
          });

          await tx.orderItem.createMany({
            data: pricing.lines.map((line) => ({
              orderId: order.id,
              eventId: line.ticketType.event.id,
              ticketTypeId: line.ticketType.id,
              label: line.label,
              quantity: line.quantity,
              unitAmount: line.unitAmount,
              subtotalAmount: line.subtotalAmount,
            })),
          });

          await tx.stockReservation.createMany({
            data: pricing.lines.map((line) => ({
              orderId: order.id,
              ticketTypeId: line.ticketType.id,
              quantity: line.quantity,
              status: "ACTIVE",
              expiresAt,
            })),
          });
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead },
      );

      return serializeOrder(createdOrderReference);
    } catch (error) {
      lastError = error;

      if (!isRetryableError(error) || attempt === 3) {
        throw error;
      }
    }
  }

  throw lastError;
};

const getOrderByReference = async (
  reference,
  user = null,
  customerEmail = null,
) => {
  const order = await loadAndAuthorizeOrder(prismaTicketing, reference, {
    user,
    customerEmail,
  });

  return serializeOrderEntity(order);
};

module.exports = {
  previewOrder,
  createOrder,
  getOrderByReference,
  serializeOrder,
};
