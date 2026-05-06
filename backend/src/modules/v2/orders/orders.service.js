const crypto = require("crypto");

const { prisma } = require("../../../lib/prisma");
const { prismaTicketing, Prisma } = require("../../../lib/prismaTicketing");
const { HttpError } = require("../common/httpError");
const { ORDER_RESERVATION_TTL_MINUTES } = require("../common/config");
const { expireReservations, getStockUsageMap } = require("../common/stockService");
const {
  serializeOrderEntity,
  getOrderByReferenceOrThrow,
  loadAndAuthorizeOrder,
  expireOrderIfNeeded,
  normalizeEmail,
} = require("../common/orderService");

const RETRYABLE_ERROR_CODES = new Set(["P2034"]);
const GALA_BLOCKING_ORDER_STATUSES = new Set([
  "PENDING",
  "PAYMENT_PROCESSING",
  "PAID",
]);
const LEGACY_SCHEMA_OPTIONAL_ERROR_MARKERS = [
  "inscriptiongala",
  "unknown table",
  "table doesn't exist",
  "does not exist",
  "p2021",
  "p2022",
];

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
          type: true,
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

const lockEvents = async (tx, eventIds) => {
  if (!eventIds.length) {
    return;
  }

  await tx.$queryRaw`
    SELECT id
    FROM events
    WHERE id IN (${Prisma.join(eventIds)})
    FOR UPDATE
  `;
};

const isGalaOrder = (lines = []) =>
  lines.some((line) => line.ticketType?.event?.type === "GALA");

const buildGalaDuplicateMessage = (status) => {
  if (status === "PAID") {
    return "Un meme compte ne peut pas acheter plusieurs billets Gala. Votre compte possede deja un billet Gala.";
  }

  return "Un meme compte ne peut pas acheter plusieurs billets Gala. Une commande Gala est deja en cours sur ce compte.";
};

const hasOptionalLegacySchemaError = (error) => {
  const message = String(error?.message || "").toLowerCase();
  return LEGACY_SCHEMA_OPTIONAL_ERROR_MARKERS.some((marker) =>
    message.includes(marker),
  );
};

const findLegacyUserTableName = async () => {
  const [canonicalRows] = await Promise.all([
    prisma.$queryRawUnsafe("SHOW TABLES LIKE 'User'"),
  ]);

  if (Array.isArray(canonicalRows) && canonicalRows.length > 0) {
    return "User";
  }

  const lowercaseRows = await prisma.$queryRawUnsafe("SHOW TABLES LIKE 'user'");
  if (Array.isArray(lowercaseRows) && lowercaseRows.length > 0) {
    return "user";
  }

  return null;
};

const ensureNoLegacyGalaPurchase = async (customerEmail) => {
  const normalizedCustomerEmail = normalizeEmail(customerEmail);

  if (!normalizedCustomerEmail) {
    return;
  }

  try {
    const inscriptionTableRows = await prisma.$queryRawUnsafe(
      "SHOW TABLES LIKE 'InscriptionGala'",
    );
    const userTableName = await findLegacyUserTableName();

    if (
      !Array.isArray(inscriptionTableRows) ||
      inscriptionTableRows.length === 0 ||
      !userTableName
    ) {
      return;
    }

    const legacyInscription = await prisma.$queryRawUnsafe(
      `
        SELECT ig.id, ig.statutPaiement, ig.referencePaiement
        FROM \`InscriptionGala\` ig
        INNER JOIN \`${userTableName}\` u ON u.id = ig.userId
        WHERE LOWER(TRIM(u.email)) = ?
          AND ig.statutPaiement <> 'ANNULE'
        LIMIT 1
      `,
      normalizedCustomerEmail,
    );

    const existingInscription = Array.isArray(legacyInscription)
      ? legacyInscription[0]
      : null;

    if (!existingInscription) {
      return;
    }

    throw new HttpError(
      409,
      "Un meme compte ne peut pas acheter plusieurs billets Gala. Ce compte dispose deja d'une inscription Gala.",
      {
        source: "legacy",
        inscriptionId: existingInscription.id,
        paymentStatus: existingInscription.statutPaiement,
        paymentReference: existingInscription.referencePaiement || null,
      },
    );
  } catch (error) {
    if (hasOptionalLegacySchemaError(error)) {
      return;
    }

    throw error;
  }
};

const ensureNoExistingGalaOrder = async (
  tx,
  { customerEmail, userId = null, now = new Date() },
) => {
  const normalizedCustomerEmail = normalizeEmail(customerEmail);
  const identityFilters = [];

  if (userId) {
    identityFilters.push({ userId });
  }

  if (normalizedCustomerEmail) {
    identityFilters.push({ customerEmail: normalizedCustomerEmail });
  }

  if (!identityFilters.length) {
    return;
  }

  const matchingOrders = await tx.order.findMany({
    where: {
      OR: identityFilters,
      status: {
        in: Array.from(GALA_BLOCKING_ORDER_STATUSES),
      },
      items: {
        some: {
          event: {
            type: "GALA",
          },
        },
      },
    },
    select: {
      id: true,
      reference: true,
      status: true,
      expiresAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  for (const order of matchingOrders) {
    const currentOrder = await expireOrderIfNeeded(tx, order, now);

    if (!GALA_BLOCKING_ORDER_STATUSES.has(currentOrder.status)) {
      continue;
    }

    throw new HttpError(409, buildGalaDuplicateMessage(currentOrder.status), {
      orderReference: currentOrder.reference,
      orderStatus: currentOrder.status,
      eventType: "GALA",
    });
  }
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
  const requestedTicketTypes = await loadRequestedTicketTypes(prismaTicketing, normalizedItems);
  const includesGalaTickets = isGalaOrder(
    normalizedItems.map((item) => ({
      ticketType: requestedTicketTypes.get(item.ticketTypeId),
      quantity: item.quantity,
    })),
  );

  if (includesGalaTickets) {
    await ensureNoLegacyGalaPurchase(customer.email);
  }

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
          const eventIds = Array.from(
            new Set(pricing.lines.map((line) => line.ticketType.event.id)),
          ).sort();

          await lockEvents(tx, eventIds);

          if (isGalaOrder(pricing.lines)) {
            await ensureNoExistingGalaOrder(tx, {
              customerEmail: customer.email,
              userId: user?.id || null,
              now,
            });
          }

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
