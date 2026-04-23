const { prisma } = require("../lib/prisma");
const { ensureEventSettings } = require("../utils/eventSettings");

const getPublishedEvents = async (_req, res) => {
  try {
    await ensureEventSettings(prisma);

    const events = await prisma.eventSetting.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "asc" },
    });

    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  getPublishedEvents,
};
