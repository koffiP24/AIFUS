export const defaultEventSettings = {
  village: {
    key: "village",
    title: "Village Opportunites Ivoiro-Russe",
    subtitle: "Événement gratuit",
    description:
      "Plateforme d'information, d'orientation et de coopération entre la Côte d'Ivoire et la Russie.",
    location: "Abidjan",
    startsAt: "2026-07-31T09:00:00.000Z",
    endsAt: "2026-07-31T18:00:00.000Z",
    isPublished: true,
  },
  gala: {
    key: "gala",
    title: "Gala des Alumni",
    subtitle: "Soirée de prestige",
    description:
      "Grande soirée de célébration, de reconnaissance et de réseautage intergénérationnel.",
    location: "Hotel Palm Club / Sofitel",
    startsAt: "2026-08-01T18:00:00.000Z",
    endsAt: "2026-08-02T02:00:00.000Z",
    isPublished: true,
  },
  tombola: {
    key: "tombola",
    title: "Grande Tombola AIFUS",
    subtitle: "Tirage lors du gala",
    description:
      "Tombola officielle des festivités AIFUS 2026 avec tirage pendant la soirée du gala.",
    location: "Scene principale du gala",
    startsAt: "2026-08-01T21:30:00.000Z",
    endsAt: "2026-08-01T22:00:00.000Z",
    isPublished: true,
  },
};

export const eventOrder = ["village", "gala", "tombola"];

const capitalize = (value) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : value;

export const normalizeEventSettings = (events = []) => {
  const normalized = { ...defaultEventSettings };

  events.forEach((event) => {
    if (!event?.key) {
      return;
    }

    normalized[event.key] = {
      ...normalized[event.key],
      ...event,
    };
  });

  return normalized;
};

export const formatEventDateLabel = (event) => {
  if (!event?.startsAt) {
    return "Date a confirmer";
  }

  return capitalize(
    new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(event.startsAt)),
  );
};

export const formatEventShortDate = (event) => {
  if (!event?.startsAt) {
    return "Date a confirmer";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(event.startsAt));
};

export const formatEventTimeRange = (event) => {
  if (!event?.startsAt) {
    return "Horaire a confirmer";
  }

  const startLabel = new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(event.startsAt));

  if (!event?.endsAt) {
    return startLabel;
  }

  const endLabel = new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(event.endsAt));

  return `${startLabel} - ${endLabel}`;
};

export const formatEventSchedule = (event) => {
  const dateLabel = formatEventDateLabel(event);
  const timeLabel = formatEventTimeRange(event);

  if (timeLabel === "Horaire a confirmer") {
    return dateLabel;
  }

  return `${dateLabel} • ${timeLabel}`;
};

export const toDateTimeLocalValue = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};
