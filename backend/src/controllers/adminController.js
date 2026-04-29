const { prisma } = require("../lib/prisma");
const { prismaTicketing } = require("../lib/prismaTicketing");
const {
  ensureGalaTicket,
  ensureTicketsForValidInscriptions,
  parseQrPayload,
} = require("../utils/galaTicket");
const { ensureEventSettings } = require("../utils/eventSettings");

const galaTicketInclude = {
  user: {
    select: { nom: true, prenom: true, email: true, telephone: true },
  },
  checkedInBy: {
    select: { nom: true, prenom: true, email: true },
  },
};

const eventSettingSelect = {
  id: true,
  key: true,
  title: true,
  subtitle: true,
  description: true,
  location: true,
  startsAt: true,
  endsAt: true,
  isPublished: true,
  createdAt: true,
  updatedAt: true,
};

const emptyDashboardStats = Object.freeze({
  totalUsers: 0,
  totalAdmins: 0,
  totalInscriptions: 0,
  totalBillets: 0,
  validTickets: 0,
  checkedInCount: 0,
  pendingPayments: 0,
  montantTotalInscriptions: 0,
  montantTotalTombola: 0,
});

const getDashboardActivityScore = (stats) =>
  (stats.totalInscriptions || 0) +
  (stats.totalBillets || 0) +
  (stats.validTickets || 0) +
  (stats.checkedInCount || 0) +
  (stats.pendingPayments || 0) +
  (stats.montantTotalInscriptions || 0) +
  (stats.montantTotalTombola || 0);

const getLegacyDashboardStats = async () => {
  await ensureTicketsForValidInscriptions(prisma);

  const [
    totalUsers,
    totalAdmins,
    totalInscriptions,
    totalBillets,
    validTickets,
    checkedInCount,
    pendingPayments,
    montantInscriptions,
    montantTombola,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.inscriptionGala.count(),
    prisma.billetTombola.count(),
    prisma.inscriptionGala.count({ where: { statutPaiement: "VALIDE" } }),
    prisma.inscriptionGala.count({ where: { checkedInAt: { not: null } } }),
    prisma.inscriptionGala.count({ where: { statutPaiement: "EN_ATTENTE" } }),
    prisma.inscriptionGala.aggregate({ _sum: { montantTotal: true } }),
    prisma.billetTombola.aggregate({ _sum: { montant: true } }),
  ]);

  return {
    totalUsers,
    totalAdmins,
    totalInscriptions,
    totalBillets,
    validTickets,
    checkedInCount,
    pendingPayments,
    montantTotalInscriptions: montantInscriptions._sum.montantTotal || 0,
    montantTotalTombola: montantTombola._sum.montant || 0,
  };
};

const getV2DashboardStats = async () => {
  const [
    totalUsers,
    totalAdmins,
    galaOrderItems,
    paidRevenueItems,
    totalBillets,
    validTickets,
    checkedInCount,
    pendingPayments,
  ] = await Promise.all([
    prismaTicketing.user.count(),
    prismaTicketing.user.count({ where: { role: "ADMIN" } }),
    prismaTicketing.orderItem.findMany({
      where: {
        event: { is: { type: "GALA" } },
        order: {
          is: {
            status: {
              in: ["PENDING", "PAYMENT_PROCESSING", "PAID"],
            },
          },
        },
      },
      select: { quantity: true },
    }),
    prismaTicketing.orderItem.findMany({
      where: {
        order: { is: { status: "PAID" } },
        event: { is: { type: { in: ["GALA", "RAFFLE"] } } },
      },
      select: {
        subtotalAmount: true,
        event: { select: { type: true } },
      },
    }),
    prismaTicketing.raffleTicket.count({
      where: { status: { not: "CANCELLED" } },
    }),
    prismaTicketing.ticket.count({
      where: {
        status: "GENERATED",
        event: { is: { type: "GALA" } },
      },
    }),
    prismaTicketing.ticket.count({
      where: {
        checkedInAt: { not: null },
        event: { is: { type: "GALA" } },
      },
    }),
    prismaTicketing.order.count({
      where: {
        status: { in: ["PENDING", "PAYMENT_PROCESSING"] },
        items: {
          some: {
            event: { is: { type: "GALA" } },
          },
        },
      },
    }),
  ]);

  const totalInscriptions = galaOrderItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const revenueByEventType = paidRevenueItems.reduce(
    (accumulator, item) => {
      if (item.event.type === "GALA") {
        accumulator.montantTotalInscriptions += item.subtotalAmount;
      }

      if (item.event.type === "RAFFLE") {
        accumulator.montantTotalTombola += item.subtotalAmount;
      }

      return accumulator;
    },
    {
      montantTotalInscriptions: 0,
      montantTotalTombola: 0,
    },
  );

  return {
    totalUsers,
    totalAdmins,
    totalInscriptions,
    totalBillets,
    validTickets,
    checkedInCount,
    pendingPayments,
    ...revenueByEventType,
  };
};

const getAllInscriptions = async (_req, res) => {
  try {
    await ensureTicketsForValidInscriptions(prisma);

    const inscriptions = await prisma.inscriptionGala.findMany({
      include: galaTicketInclude,
      orderBy: { createdAt: "desc" },
    });

    res.json(inscriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const validerInscription = async (req, res) => {
  const { id } = req.params;

  try {
    let inscription = await prisma.inscriptionGala.update({
      where: { id: parseInt(id, 10) },
      data: { statutPaiement: "VALIDE" },
    });

    inscription = await ensureGalaTicket(prisma, inscription.id, galaTicketInclude);

    res.json(inscription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const getAllBilletsTombola = async (_req, res) => {
  try {
    const billets = await prisma.billetTombola.findMany({
      include: {
        user: { select: { nom: true, prenom: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(billets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const validerBilletTombola = async (req, res) => {
  const { id } = req.params;

  try {
    const billet = await prisma.billetTombola.update({
      where: { id: parseInt(id, 10) },
      data: { statutPaiement: "VALIDE" },
    });

    res.json(billet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const getStats = async (_req, res) => {
  let legacyStats = emptyDashboardStats;
  let v2Stats = emptyDashboardStats;
  let legacyError = null;
  let v2Error = null;

  try {
    legacyStats = await getLegacyDashboardStats();
  } catch (error) {
    legacyError = error;
    console.error("Admin dashboard legacy stats unavailable:", error.message);
  }

  try {
    v2Stats = await getV2DashboardStats();
  } catch (error) {
    v2Error = error;
    console.error("Admin dashboard v2 stats unavailable:", error.message);
  }

  if (legacyError && v2Error) {
    console.error(legacyError);
    console.error(v2Error);
    return res.status(500).json({ message: "Erreur serveur" });
  }

  const preferV2 =
    !v2Error &&
    (legacyError ||
      getDashboardActivityScore(v2Stats) > getDashboardActivityScore(legacyStats));

  const preferredStats = preferV2 ? v2Stats : legacyStats;

  res.json({
    ...preferredStats,
    totalUsers: Math.max(legacyStats.totalUsers || 0, v2Stats.totalUsers || 0),
    totalAdmins: Math.max(
      legacyStats.totalAdmins || 0,
      v2Stats.totalAdmins || 0,
    ),
  });
};

const getUsers = async (req, res) => {
  try {
    const search = req.query.search?.trim();
    const where = search
      ? {
          OR: [
            { nom: { contains: search } },
            { prenom: { contains: search } },
            { email: { contains: search } },
            { telephone: { contains: search } },
          ],
        }
      : {};

    const [users, totalUsers, totalAdmins, totalGalaParticipants] =
      await Promise.all([
        prisma.user.findMany({
          where,
          orderBy: [{ role: "desc" }, { createdAt: "desc" }],
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            telephone: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            _count: {
              select: {
                inscriptionsGala: true,
                billetsTombola: true,
              },
            },
            inscriptionsGala: {
              select: {
                id: true,
                statutPaiement: true,
                ticketCode: true,
                checkedInAt: true,
                createdAt: true,
              },
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        }),
        prisma.user.count(),
        prisma.user.count({ where: { role: "ADMIN" } }),
        prisma.user.count({ where: { inscriptionsGala: { some: {} } } }),
      ]);

    res.json({
      stats: {
        totalUsers,
        totalAdmins,
        totalParticipants: Math.max(totalUsers - totalAdmins, 0),
        totalGalaParticipants,
      },
      users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const updateUser = async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const { role } = req.body;

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "Utilisateur invalide" });
  }

  if (!["USER", "ADMIN"].includes(role)) {
    return res.status(400).json({ message: "Role invalide" });
  }

  if (req.user.id === id && role !== "ADMIN") {
    return res.status(400).json({
      message: "Vous ne pouvez pas retirer votre propre acces administrateur.",
    });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        telephone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const getEventSettings = async (_req, res) => {
  try {
    await ensureEventSettings(prisma);

    const events = await prisma.eventSetting.findMany({
      select: eventSettingSelect,
      orderBy: { createdAt: "asc" },
    });

    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const updateEventSetting = async (req, res) => {
  const { key } = req.params;
  const { title, subtitle, description, location, startsAt, endsAt, isPublished } =
    req.body;

  try {
    await ensureEventSettings(prisma);

    const updatedEvent = await prisma.eventSetting.update({
      where: { key },
      data: {
        title: typeof title === "string" ? title.trim() : undefined,
        subtitle: typeof subtitle === "string" ? subtitle.trim() : undefined,
        description:
          typeof description === "string" ? description.trim() : undefined,
        location: typeof location === "string" ? location.trim() : undefined,
        startsAt:
          typeof startsAt === "string" && startsAt
            ? new Date(startsAt)
            : startsAt === null
              ? null
              : undefined,
        endsAt:
          typeof endsAt === "string" && endsAt
            ? new Date(endsAt)
            : endsAt === null
              ? null
              : undefined,
        isPublished:
          typeof isPublished === "boolean" ? isPublished : undefined,
      },
      select: eventSettingSelect,
    });

    res.json(updatedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const getMonitoringOverview = async (_req, res) => {
  try {
    await ensureTicketsForValidInscriptions(prisma);

    const [
      totalInscriptions,
      validTickets,
      checkedInCount,
      pendingPayments,
      tickets,
      recentScans,
    ] = await Promise.all([
      prisma.inscriptionGala.count(),
      prisma.inscriptionGala.count({ where: { statutPaiement: "VALIDE" } }),
      prisma.inscriptionGala.count({ where: { checkedInAt: { not: null } } }),
      prisma.inscriptionGala.count({ where: { statutPaiement: "EN_ATTENTE" } }),
      prisma.inscriptionGala.findMany({
        where: { statutPaiement: "VALIDE" },
        include: galaTicketInclude,
        orderBy: [{ checkedInAt: "desc" }, { createdAt: "desc" }],
      }),
      prisma.inscriptionGala.findMany({
        where: { checkedInAt: { not: null } },
        include: galaTicketInclude,
        orderBy: { checkedInAt: "desc" },
        take: 8,
      }),
    ]);

    const remainingToCheckIn = Math.max(validTickets - checkedInCount, 0);
    const checkInRate = validTickets
      ? Math.round((checkedInCount / validTickets) * 100)
      : 0;

    res.json({
      stats: {
        totalInscriptions,
        validTickets,
        checkedInCount,
        pendingPayments,
        remainingToCheckIn,
        checkInRate,
      },
      tickets,
      recentScans,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const scanGalaTicket = async (req, res) => {
  const { qrData } = req.body;

  try {
    const parsedTicket = parseQrPayload(qrData);

    if (!parsedTicket?.qrToken && !parsedTicket?.ticketCode) {
      return res.status(400).json({ message: "QR code ou ticket invalide" });
    }

    const inscription = await prisma.inscriptionGala.findFirst({
      where: {
        OR: [
          parsedTicket.qrToken ? { qrToken: parsedTicket.qrToken } : undefined,
          parsedTicket.ticketCode
            ? { ticketCode: parsedTicket.ticketCode }
            : undefined,
        ].filter(Boolean),
      },
      include: galaTicketInclude,
    });

    if (!inscription) {
      return res.status(404).json({ message: "Ticket introuvable" });
    }

    if (inscription.statutPaiement !== "VALIDE") {
      return res.status(400).json({
        message: "Cette inscription n'est pas encore validee",
        scanStatus: "invalid_payment",
        inscription,
      });
    }

    if (inscription.checkedInAt) {
      return res.json({
        message: "Ce ticket a deja ete scanne",
        scanStatus: "already_checked_in",
        inscription,
      });
    }

    const updatedInscription = await prisma.inscriptionGala.update({
      where: { id: inscription.id },
      data: {
        checkedInAt: new Date(),
        checkedInById: req.user.id,
      },
      include: galaTicketInclude,
    });

    res.json({
      message: "Ticket valide. Participant enregistre a l'entree.",
      scanStatus: "checked_in",
      inscription: updatedInscription,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  getAllInscriptions,
  validerInscription,
  getAllBilletsTombola,
  validerBilletTombola,
  getStats,
  getUsers,
  updateUser,
  getEventSettings,
  updateEventSetting,
  getMonitoringOverview,
  scanGalaTicket,
};
