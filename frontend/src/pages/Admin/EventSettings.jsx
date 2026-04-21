import { useEffect, useState } from "react";
import {
  ArrowPathIcon,
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import api from "../../services/api";
import AdminSectionNav from "../../components/AdminSectionNav";
import { useEvents } from "../../context/EventContext";
import {
  eventOrder,
  formatEventSchedule,
  toDateTimeLocalValue,
} from "../../utils/eventSettings";

const emptyEvent = {
  title: "",
  subtitle: "",
  description: "",
  location: "",
  startsAt: "",
  endsAt: "",
  isPublished: true,
};

const EventSettings = () => {
  const [events, setEvents] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState("");
  const [feedback, setFeedback] = useState("");
  const { refreshEvents } = useEvents();

  const fetchEvents = async () => {
    try {
      const response = await api.get("/admin/events");
      const mappedEvents = response.data.reduce((accumulator, event) => {
        accumulator[event.key] = {
          ...emptyEvent,
          ...event,
          startsAt: toDateTimeLocalValue(event.startsAt),
          endsAt: toDateTimeLocalValue(event.endsAt),
        };
        return accumulator;
      }, {});

      setEvents(mappedEvents);
    } catch (_error) {
      setFeedback("Impossible de charger la configuration des evenements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = (key, field, value) => {
    setEvents((currentEvents) => ({
      ...currentEvents,
      [key]: {
        ...currentEvents[key],
        [field]: value,
      },
    }));
  };

  const handleSave = async (key) => {
    const event = events[key];
    if (!event) {
      return;
    }

    setSavingKey(key);
    setFeedback("");

    try {
      const payload = {
        title: event.title,
        subtitle: event.subtitle,
        description: event.description,
        location: event.location,
        startsAt: event.startsAt || null,
        endsAt: event.endsAt || null,
        isPublished: event.isPublished,
      };

      const response = await api.put(`/admin/events/${key}`, payload);

      setEvents((currentEvents) => ({
        ...currentEvents,
        [key]: {
          ...currentEvents[key],
          ...response.data,
          startsAt: toDateTimeLocalValue(response.data.startsAt),
          endsAt: toDateTimeLocalValue(response.data.endsAt),
        },
      }));

      await refreshEvents();
      setFeedback("Configuration evenement mise a jour.");
    } catch (error) {
      setFeedback(
        error.response?.data?.message ||
          "Impossible d'enregistrer cet evenement.",
      );
    } finally {
      setSavingKey("");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminSectionNav />

      <section className="rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-8 py-8 text-white shadow-2xl">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-slate-200">
          <CalendarDaysIcon className="h-4 w-4" />
          Calendrier administrable
        </p>
        <h1 className="text-3xl font-bold">Dates et lieux des evenements</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-300">
          Mettez a jour ici les informations diffusees sur le site public et le
          ticket gala. Les modifications sont visibles apres enregistrement.
        </p>
      </section>

      {feedback && (
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {feedback}
        </div>
      )}

      <section className="grid gap-6 xl:grid-cols-3">
        {eventOrder.map((key) => {
          const event = events[key];

          if (!event) {
            return null;
          }

          return (
            <article
              key={key}
              className="rounded-3xl bg-white p-6 shadow-xl dark:bg-slate-800"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold">{event.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">{event.subtitle}</p>
                </div>
                <button
                  type="button"
                  onClick={() => fetchEvents()}
                  className="rounded-2xl border border-slate-200 p-3 text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900/40"
                >
                  <ArrowPathIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="label">Titre</label>
                  <input
                    type="text"
                    value={event.title}
                    onChange={(evt) => handleChange(key, "title", evt.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label">Sous-titre</label>
                  <input
                    type="text"
                    value={event.subtitle || ""}
                    onChange={(evt) =>
                      handleChange(key, "subtitle", evt.target.value)
                    }
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label">Description</label>
                  <textarea
                    rows="3"
                    value={event.description || ""}
                    onChange={(evt) =>
                      handleChange(key, "description", evt.target.value)
                    }
                    className="input-field min-h-[112px]"
                  />
                </div>

                <div>
                  <label className="label">Lieu</label>
                  <div className="relative">
                    <MapPinIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={event.location || ""}
                      onChange={(evt) =>
                        handleChange(key, "location", evt.target.value)
                      }
                      className="input-field pl-12"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="label">Debut</label>
                    <div className="relative">
                      <ClockIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input
                        type="datetime-local"
                        value={event.startsAt || ""}
                        onChange={(evt) =>
                          handleChange(key, "startsAt", evt.target.value)
                        }
                        className="input-field pl-12"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label">Fin</label>
                    <div className="relative">
                      <ClockIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input
                        type="datetime-local"
                        value={event.endsAt || ""}
                        onChange={(evt) =>
                          handleChange(key, "endsAt", evt.target.value)
                        }
                        className="input-field pl-12"
                      />
                    </div>
                  </div>
                </div>

                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700">
                  <input
                    type="checkbox"
                    checked={event.isPublished}
                    onChange={(evt) =>
                      handleChange(key, "isPublished", evt.target.checked)
                    }
                    className="h-4 w-4 rounded border-slate-300 text-primary-600"
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Afficher cet evenement sur le site
                  </span>
                </label>

                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:bg-slate-900/40 dark:text-slate-300">
                  <p className="font-medium text-slate-900 dark:text-white">
                    Apercu public
                  </p>
                  <p className="mt-1">{formatEventSchedule(event)}</p>
                  <p className="mt-1">{event.location || "Lieu a confirmer"}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleSave(key)}
                  disabled={savingKey === key}
                  className="btn-primary w-full py-3"
                >
                  {savingKey === key ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
};

export default EventSettings;
