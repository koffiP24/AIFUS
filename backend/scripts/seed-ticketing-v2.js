const bcrypt = require("bcryptjs");

const { prismaTicketing } = require("../src/lib/prismaTicketing");

const upsertEventWithTicketTypes = async (eventPayload, ticketTypes) => {
  const event = await prismaTicketing.event.upsert({
    where: { slug: eventPayload.slug },
    update: eventPayload,
    create: eventPayload,
  });

  for (const ticketType of ticketTypes) {
    await prismaTicketing.ticketType.upsert({
      where: {
        eventId_code: {
          eventId: event.id,
          code: ticketType.code,
        },
      },
      update: {
        ...ticketType,
        eventId: event.id,
      },
      create: {
        ...ticketType,
        eventId: event.id,
      },
    });
  }

  return event;
};

const seedAdminIfConfigured = async () => {
  const email = process.env.V2_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.V2_ADMIN_PASSWORD?.trim();

  if (!email || !password) {
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prismaTicketing.user.upsert({
    where: { email },
    update: {
      passwordHash,
      firstName: process.env.V2_ADMIN_FIRST_NAME || "Admin",
      lastName: process.env.V2_ADMIN_LAST_NAME || "AIFUS",
      role: "ADMIN",
      isActive: true,
    },
    create: {
      email,
      passwordHash,
      firstName: process.env.V2_ADMIN_FIRST_NAME || "Admin",
      lastName: process.env.V2_ADMIN_LAST_NAME || "AIFUS",
      role: "ADMIN",
      isActive: true,
    },
  });
};

async function main() {
  await prismaTicketing.$connect();

  await upsertEventWithTicketTypes(
    {
      name: "Gala AIFUS 2026",
      slug: "gala-aifus-2026",
      type: "GALA",
      description: "Soiree de gala AIFUS 2026",
      venue: "Hotel Palm Club / Sofitel",
      timezone: "Africa/Abidjan",
      capacity: 300,
      saleStartsAt: new Date("2026-04-01T00:00:00Z"),
      saleEndsAt: new Date("2026-08-01T17:00:00Z"),
      startAt: new Date("2026-08-01T18:00:00Z"),
      endAt: new Date("2026-08-02T02:00:00Z"),
      isActive: true,
    },
    [
      {
        name: "Actif",
        code: "GALA_ACTIF",
        description: "Billet gala actif",
        priceAmount: 40000,
        currency: "XOF",
        stockTotal: 170,
        maxPerOrder: 4,
        sortOrder: 1,
      },
      {
        name: "Retraite",
        code: "GALA_RETRAITE",
        description: "Billet gala retraite",
        priceAmount: 25000,
        currency: "XOF",
        stockTotal: 40,
        maxPerOrder: 4,
        sortOrder: 2,
      },
      {
        name: "Sans emploi",
        code: "GALA_SANS_EMPLOI",
        description: "Billet gala sans emploi",
        priceAmount: 15000,
        currency: "XOF",
        stockTotal: 10,
        maxPerOrder: 2,
        sortOrder: 3,
      },
      {
        name: "Invite",
        code: "GALA_INVITE",
        description: "Billet gala invite",
        priceAmount: 20000,
        currency: "XOF",
        stockTotal: 50,
        maxPerOrder: 4,
        sortOrder: 4,
      },
    ],
  );

  await upsertEventWithTicketTypes(
    {
      name: "Village Ivoiro-Russe 2026",
      slug: "village-ivoiro-russe-2026",
      type: "VILLAGE",
      description: "Village d'opportunites et d'echanges",
      venue: "Abidjan",
      timezone: "Africa/Abidjan",
      capacity: 2000,
      saleStartsAt: new Date("2026-04-01T00:00:00Z"),
      saleEndsAt: new Date("2026-08-01T08:00:00Z"),
      startAt: new Date("2026-08-01T09:00:00Z"),
      endAt: new Date("2026-08-01T18:00:00Z"),
      isActive: true,
    },
    [
      {
        name: "Pass village",
        code: "VILLAGE_PASS",
        description: "Acces standard au village",
        priceAmount: 0,
        currency: "XOF",
        stockTotal: null,
        maxPerOrder: 10,
        sortOrder: 1,
      },
    ],
  );

  await upsertEventWithTicketTypes(
    {
      name: "Tombola AIFUS 2026",
      slug: "tombola-aifus-2026",
      type: "RAFFLE",
      description: "Tombola officielle AIFUS 2026",
      venue: "Abidjan",
      timezone: "Africa/Abidjan",
      capacity: 100,
      saleStartsAt: new Date("2026-04-01T00:00:00Z"),
      saleEndsAt: new Date("2026-08-01T18:00:00Z"),
      startAt: new Date("2026-08-01T19:00:00Z"),
      endAt: new Date("2026-08-01T20:00:00Z"),
      isActive: true,
    },
    [
      {
        name: "Ticket tombola",
        code: "TOMBOLA_STD",
        description: "Billet numerote de tombola",
        priceAmount: 10000,
        currency: "XOF",
        stockTotal: 100,
        maxPerOrder: 50,
        sortOrder: 1,
      },
    ],
  );

  await seedAdminIfConfigured();

  console.log("[seed-v2] Evenements, tarifs et admin V2 initialises");
}

main()
  .catch((error) => {
    console.error("[seed-v2] Echec:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prismaTicketing.$disconnect();
  });
