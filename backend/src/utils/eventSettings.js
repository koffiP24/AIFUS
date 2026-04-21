const defaultEventSettings = [
  {
    key: "village",
    title: "Village Opportunites Ivoiro-Russe",
    subtitle: "Evenement gratuit",
    description:
      "Plateforme d'information, d'orientation et de cooperation entre la Cote d'Ivoire et la Russie.",
    location: "Abidjan",
    startsAt: new Date("2026-07-31T09:00:00.000Z"),
    endsAt: new Date("2026-07-31T18:00:00.000Z"),
    isPublished: true,
  },
  {
    key: "gala",
    title: "Gala des Alumni",
    subtitle: "Soiree de prestige",
    description:
      "Grande soiree de celebration, de reconnaissance et de reseautage intergenerationnel.",
    location: "Hotel Palm Club / Sofitel",
    startsAt: new Date("2026-08-01T18:00:00.000Z"),
    endsAt: new Date("2026-08-02T02:00:00.000Z"),
    isPublished: true,
  },
  {
    key: "tombola",
    title: "Grande Tombola AIFUS",
    subtitle: "Tirage lors du gala",
    description:
      "Tombola officielle des festivites AIFUS 2026 avec tirage pendant la soiree du gala.",
    location: "Scene principale du gala",
    startsAt: new Date("2026-08-01T21:30:00.000Z"),
    endsAt: new Date("2026-08-01T22:00:00.000Z"),
    isPublished: true,
  },
];

const ensureEventSettings = async (prisma) => {
  await Promise.all(
    defaultEventSettings.map((event) =>
      prisma.eventSetting.upsert({
        where: { key: event.key },
        update: {},
        create: event,
      }),
    ),
  );
};

module.exports = {
  defaultEventSettings,
  ensureEventSettings,
};
