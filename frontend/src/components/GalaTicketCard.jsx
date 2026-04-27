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
  RETRAITE: "Retrait",
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
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900/70">
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-6 py-5 text-white">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-slate-200">
              <TicketIcon className="h-4 w-4" />
              Ticket gala
            </p>
            <h3 className="text-2xl font-semibold">Acces officiel AIFUS 2026</h3>
             <p className="mt-2 text-sm text-slate-300">
               Présentez ce QR code à l'entrée pour le check-in admin.
             </p>
          </div>

          <div
            className={`inline-flex items-center gap-2 self-start rounded-full px-4 py-2 text-sm font-medium ${
              inscription.checkedInAt
                ? "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/30"
                : "bg-amber-500/15 text-amber-100 ring-1 ring-amber-300/30"
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

      <div className="grid gap-8 px-6 py-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Ticket
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                {inscription.ticketCode}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Participant
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                {participantName || "Membre AIFUS"}
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700">
              <CalendarDaysIcon className="h-5 w-5 text-amber-600" />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Date
                </p>
                <p className="font-medium">
                  {formatEventDateLabel(galaEvent)}, {formatEventTimeRange(galaEvent)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700">
              <MapPinIcon className="h-5 w-5 text-sky-600" />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Lieu
                </p>
                 <p className="font-medium">{galaEvent?.location || "Lieu à confirmer"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700">
              <UserGroupIcon className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Categorie
                </p>
                <p className="font-medium">
                   {categoriesLabels[inscription.categorie] || inscription.categorie}
                   {" · "}
                   {inscription.nombreInvites} invité(s)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700">
              <CheckBadgeIcon className="h-5 w-5 text-violet-600" />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Dernier statut
                </p>
                <p className="font-medium">{formatDateTime(inscription.checkedInAt)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 text-center dark:border-slate-700 dark:bg-slate-800/60">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900">
            <QrCodeIcon className="h-6 w-6" />
          </div>

           <p className="mt-4 text-sm font-medium text-slate-500">
             QR code à scanner
           </p>

          <div className="mx-auto mt-4 flex min-h-[260px] items-center justify-center rounded-3xl bg-white p-5 shadow-inner">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`QR code ${inscription.ticketCode}`}
                className="h-full max-h-[220px] w-full max-w-[220px] rounded-2xl object-contain"
              />
            ) : (
              <div className="space-y-3 text-center text-slate-500">
                <QrCodeIcon className="mx-auto h-12 w-12" />
                <p className="text-sm">Génération du QR code...</p>
              </div>
            )}
          </div>

          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-500">
            Code de secours
          </p>
          <p className="mt-2 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-3 font-mono text-sm font-semibold tracking-[0.2em] text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-white">
            {inscription.ticketCode}
          </p>
        </div>
      </div>
    </section>
  );
};

export default GalaTicketCard;
