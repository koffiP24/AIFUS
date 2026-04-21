const crypto = require("crypto");

const GALA_QR_TYPE = "AIFUS_GALA_TICKET";

const buildTicketCode = (inscriptionId) =>
  `AIFUS-GALA-2026-${String(inscriptionId).padStart(6, "0")}`;

const buildQrToken = () => crypto.randomBytes(24).toString("hex");

const buildQrPayload = (inscription) =>
  JSON.stringify({
    type: GALA_QR_TYPE,
    ticketCode: inscription.ticketCode,
    qrToken: inscription.qrToken,
  });

const parseQrPayload = (rawValue) => {
  if (!rawValue || typeof rawValue !== "string") {
    return null;
  }

  const trimmedValue = rawValue.trim();

  try {
    const parsed = JSON.parse(trimmedValue);
    if (parsed?.type === GALA_QR_TYPE && (parsed.qrToken || parsed.ticketCode)) {
      return {
        qrToken: parsed.qrToken || null,
        ticketCode: parsed.ticketCode || null,
      };
    }
  } catch (_error) {
    // Fallback handled below.
  }

  return {
    qrToken: trimmedValue.startsWith("AIFUS-GALA-2026-") ? null : trimmedValue,
    ticketCode: trimmedValue.startsWith("AIFUS-GALA-2026-") ? trimmedValue : null,
  };
};

const ensureGalaTicket = async (prisma, inscriptionId, include = {}) => {
  const inscription = await prisma.inscriptionGala.findUnique({
    where: { id: inscriptionId },
    include,
  });

  if (!inscription || inscription.statutPaiement !== "VALIDE") {
    return inscription;
  }

  if (inscription.ticketCode && inscription.qrToken) {
    return inscription;
  }

  return prisma.inscriptionGala.update({
    where: { id: inscriptionId },
    data: {
      ticketCode: inscription.ticketCode || buildTicketCode(inscription.id),
      qrToken: inscription.qrToken || buildQrToken(),
    },
    include,
  });
};

const ensureTicketsForValidInscriptions = async (prisma, inscriptionIds = null) => {
  const where = inscriptionIds
    ? {
        id: { in: inscriptionIds },
        statutPaiement: "VALIDE",
        OR: [{ ticketCode: null }, { qrToken: null }],
      }
    : {
        statutPaiement: "VALIDE",
        OR: [{ ticketCode: null }, { qrToken: null }],
      };

  const inscriptions = await prisma.inscriptionGala.findMany({
    where,
    select: { id: true },
  });

  for (const inscription of inscriptions) {
    await ensureGalaTicket(prisma, inscription.id);
  }
};

module.exports = {
  GALA_QR_TYPE,
  buildQrPayload,
  ensureGalaTicket,
  ensureTicketsForValidInscriptions,
  parseQrPayload,
};
