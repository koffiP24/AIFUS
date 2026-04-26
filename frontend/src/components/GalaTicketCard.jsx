import { useEffect, useState } from "react";
import QRCode from "qrcode";
import {
  CalendarDaysIcon,
  CheckBadgeIcon,
  ClockIcon,
  MapPinIcon,
  QrCodeIcon,
  TicketIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useEvents } from "../context/EventContext";
import {
  formatEventDateLabel,
  formatEventTimeRange,
} from "../utils/eventSettings";

const categoriesLabels = {
  ACTIF: "Alumni en fonction",
  RETRAITE: "Retraite",
  SANS_EMPLOI: "Sans emploi",
  INVITE: "Invité",
};

const buildGalaQrPayload = (inscription) => {
  if (!inscription?.ticketCode) {
    return "";
  }
  return inscription.ticketCode;
};

const formatDateTime = (value) => {
  if (!value) {
    return "En attente de scan";
  }
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const GalaTicketCard = ({ inscription, participantName }) => {
  const { getEvent } = useEvents();
  const [qrDataUrl, setQrDataUrl] = useState("");
  const galaEvent = getEvent("gala");

  useEffect(() => {
    let isActive = true;

    const generateQrCode = async () => {
      const qrValue = buildGalaQrPayload(inscription);

      if (!qrValue) {
        setQrDataUrl("");
        return;
      }

      try {
        const dataUrl = await QRCode.toDataURL(qrValue, {
          width: 320,
          margin: 1,
          errorCorrectionLevel: "M",
          color: {
            dark: "#0f172a",
            light: "#ffffff",
          },
        });

        if (isActive) {
          setQrDataUrl(dataUrl);
        }
      } catch (_error) {
        if (isActive) {
          setQrDataUrl("");
        }
      }
    };

    generateQrCode();

    return () => {
      isActive = false;
    };
  }, [inscription?.ticketCode]);

  if (!inscription || inscription.statutPaiement !== "VALIDE") {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900/70">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-6 py-6 text-white">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-primary-500 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-amber-500 blur-2xl"></div>
        </div>

        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-200 backdrop-blur-sm">
              <TicketIcon className="h-4 w-4" />
              Ticket Gala
            </div>
            <h3 className="text-2xl font-bold text-white md:text-3xl">
              Accès officiel AIFUS 2026
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              Présentez ce QR code à l'entrée pour le check-in
            </p>
          </div>

          <div
            className={`inline-flex items-center gap-2 self-start rounded-full px-5 py-2.5 text-sm font-semibold backdrop-blur-sm ${
              inscription.checkedInAt
                ? "bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-400/50"
                : "bg-amber-500/20 text-amber-100 ring-1 ring-amber-300/50"
            }`}
          >
            {inscription.checkedInAt ? (
              <CheckBadgeIcon className="h-5 w-5" />
            ) : (
              <ClockIcon className="h-5 w-5" />
            )}
            {inscription.checkedInAt ? "Déjà scanné" : "Non scanné"}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid gap-8 px-6 py-6 lg:grid-cols-[1.2fr_1fr]">
        {/* Left Column - Details */}
        <div className="space-y-5">
          {/* Ticket & Participant Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-4 backdrop-blur-sm dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                Billet
              </p>
              <p className="font-mono text-lg font-bold text-slate-900 dark:text-white">
                {inscription.ticketCode}
              </p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-4 backdrop-blur-sm dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                Participant
              </p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {participantName || "Membre AIFUS"}
              </p>
            </div>
          </div>

          {/* Event Details */}
          <div className="space-y-3">
            <div className="group flex items-center gap-4 overflow-hidden rounded-2xl border border-slate-200 px-4 py-3 transition-all hover:border-amber-200 hover:bg-amber-50/30 dark:border-slate-700 dark:hover:bg-amber-900/20">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40">
                <CalendarDaysIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="mb-1 text-xs uppercase tracking-[0.15em] text-slate-500">
                  Date
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {formatEventDateLabel(galaEvent)}, {formatEventTimeRange(galaEvent)}
                </p>
              </div>
            </div>

            <div className="group flex items-center gap-4 overflow-hidden rounded-2xl border border-slate-200 px-4 py-3 transition-all hover:border-sky-200 hover:bg-sky-50/30 dark:border-slate-700 dark:hover:bg-sky-900/20">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-100 to-sky-200 dark:from-sky-900/40 dark:to-sky-800/40">
                <MapPinIcon className="h-5 w-5 text-sky-600 dark:text-sky-400" />
              </div>
              <div>
                <p className="mb-1 text-xs uppercase tracking-[0.15em] text-slate-500">
                  Lieu
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {galaEvent?.location || "Lieu à confirmer"}
                </p>
              </div>
            </div>

            <div className="group flex items-center gap-4 overflow-hidden rounded-2xl border border-slate-200 px-4 py-3 transition-all hover:border-emerald-200 hover:bg-emerald-50/30 dark:border-slate-700 dark:hover:bg-emerald-900/20">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/40 dark:to-emerald-800/40">
                <UserGroupIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="mb-1 text-xs uppercase tracking-[0.15em] text-slate-500">
                  Catégorie
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {categoriesLabels[inscription.categorie] || inscription.categorie}
                  {" · "}
                  {inscription.nombreInvites} invité(s)
                </p>
              </div>
            </div>

            <div className="group flex items-center gap-4 overflow-hidden rounded-2xl border border-slate-200 px-4 py-3 transition-all hover:border-violet-200 hover:bg-violet-50/30 dark:border-slate-700 dark:hover:bg-violet-900/20">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-violet-200 dark:from-violet-900/40 dark:to-violet-800/40">
                <CheckBadgeIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <p className="mb-1 text-xs uppercase tracking-[0.15em] text-slate-500">
                  Dernier statut
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {formatDateTime(inscription.checkedInAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - QR Code */}
        <div className="flex flex-col">
          <div className="overflow-hidden rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-6 text-center shadow-lg dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
            {/* QR Container */}
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-white shadow-xl dark:from-white dark:to-slate-200 dark:text-slate-900">
              <QrCodeIcon className="h-7 w-7" />
            </div>

            <p className="mb-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
              QR code à scanner
            </p>

            {/* QR Image */}
            <div className="mx-auto flex min-h-[240px] w-full max-w-[240px] items-center justify-center rounded-3xl bg-white p-4 shadow-inner dark:bg-slate-950">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR code ${inscription.ticketCode}`}
                  className="h-full max-h-[200px] w-full max-w-[200px] rounded-2xl object-contain"
                />
              ) : (
                <div className="space-y-3 text-center text-slate-500">
                  <QrCodeIcon className="mx-auto h-12 w-12" />
                  <p className="text-sm">Génération du QR code...</p>
                </div>
              )}
            </div>

            {/* Backup Code */}
            <div className="mt-6">
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                Code de secours
              </p>
              <div className="overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-white px-4 py-4 font-mono text-sm font-bold tracking-[0.2em] text-slate-900 shadow-inner dark:border-slate-600 dark:bg-slate-950 dark:text-white">
                {inscription.ticketCode}
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
            <p>Présentez ce billet à l'entrée du Gala</p>
            <p className="mt-1 text-xs">Le scan confirmera votre présence</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GalaTicketCard;
