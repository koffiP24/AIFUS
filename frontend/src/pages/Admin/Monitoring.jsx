import { useEffect, useEffectEvent, useRef, useState } from "react";
import {
  ArrowPathIcon,
  CameraIcon,
  CheckBadgeIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  NoSymbolIcon,
  QrCodeIcon,
  SignalIcon,
  TicketIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import api from "../../services/api";
import AdminSectionNav from "../../components/AdminSectionNav";

const categoriesLabels = {
  ACTIF: "Alumni en fonction",
  RETRAITE: "Retraite",
  SANS_EMPLOI: "Sans emploi",
  INVITE: "Invite",
};

const emptyOverview = {
  stats: {
    totalInscriptions: 0,
    validTickets: 0,
    checkedInCount: 0,
    pendingPayments: 0,
    remainingToCheckIn: 0,
    checkInRate: 0,
  },
  tickets: [],
  recentScans: [],
};

const formatDateTime = (value) => {
  if (!value) {
    return "--";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const Monitoring = () => {
  const [overview, setOverview] = useState(emptyOverview);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [scanLoading, setScanLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [cameraSupported, setCameraSupported] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const frameRef = useRef(null);
  const scanLockRef = useRef(false);

  const stopCamera = () => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const fetchOverview = async (showLoader = false) => {
    if (showLoader) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      const response = await api.get("/admin/monitoring");
      setOverview(response.data);
    } catch (_error) {
      setScanResult({
        level: "error",
        message: "Impossible de charger le monitoring pour le moment.",
      });
    } finally {
      if (showLoader) {
        setLoading(false);
      } else {
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchOverview(true);
  }, []);

  useEffect(() => {
    setCameraSupported(
      Boolean(window.BarcodeDetector && navigator.mediaDevices?.getUserMedia),
    );
  }, []);

  const submitScan = async (qrData, source = "manual") => {
    const trimmedValue = qrData.trim();

    if (!trimmedValue) {
      setScanResult({
        level: "error",
        message: "Entrez un ticket ou scannez un QR code.",
      });
      return;
    }

    setScanLoading(true);
    setCameraError("");

    try {
      const response = await api.post("/admin/monitoring/scan", {
        qrData: trimmedValue,
      });

      const status = response.data.scanStatus;
      setScanResult({
        ...response.data,
        source,
        level: status === "already_checked_in" ? "warning" : "success",
      });
      setManualCode("");
      await fetchOverview(false);
    } catch (error) {
      setScanResult({
        level: "error",
        source,
        message:
          error.response?.data?.message ||
          "Le ticket n'a pas pu etre traite.",
        scanStatus: error.response?.data?.scanStatus,
        inscription: error.response?.data?.inscription || null,
      });
    } finally {
      setScanLoading(false);
      scanLockRef.current = false;
    }
  };

  const handleDetectedCode = useEffectEvent(async (rawValue) => {
    scanLockRef.current = true;
    await submitScan(rawValue, "camera");
    setCameraActive(false);
  });

  useEffect(() => {
    if (!cameraActive) {
      stopCamera();
      return undefined;
    }

    if (!cameraSupported) {
      setCameraError(
        "Le scan camera n'est pas disponible sur ce navigateur. Utilisez la saisie manuelle.",
      );
      setCameraActive(false);
      return undefined;
    }

    let cancelled = false;

    const startCamera = async () => {
      try {
        const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: { ideal: "environment" },
          },
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        const scanFrame = async () => {
          if (cancelled || !videoRef.current || scanLockRef.current) {
            return;
          }

          try {
            const detectedCodes = await detector.detect(videoRef.current);
            const rawValue = detectedCodes.find((item) => item.rawValue)?.rawValue;

            if (rawValue) {
              await handleDetectedCode(rawValue);
              return;
            }
          } catch (_error) {
            setCameraError(
              "La lecture camera a echoue. Vous pouvez utiliser la saisie manuelle.",
            );
            setCameraActive(false);
            return;
          }

          frameRef.current = requestAnimationFrame(scanFrame);
        };

        frameRef.current = requestAnimationFrame(scanFrame);
      } catch (_error) {
        if (!cancelled) {
          setCameraError(
            "Impossible d'acceder a la camera. Verifiez les autorisations du navigateur.",
          );
          setCameraActive(false);
        }
      }
    };

    startCamera();

    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [cameraActive, cameraSupported]);

  const handleManualSubmit = async (event) => {
    event.preventDefault();
    await submitScan(manualCode, "manual");
  };

  const statCards = [
    {
      title: "Tickets valides",
      value: overview.stats.validTickets,
      icon: TicketIcon,
      accent: "text-amber-600",
      surface: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
      title: "Participants scannes",
      value: overview.stats.checkedInCount,
      icon: CheckCircleIcon,
      accent: "text-emerald-600",
      surface: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      title: "Restants a accueillir",
      value: overview.stats.remainingToCheckIn,
      icon: UserGroupIcon,
      accent: "text-sky-600",
      surface: "bg-sky-50 dark:bg-sky-900/20",
    },
    {
      title: "Taux de check-in",
      value: `${overview.stats.checkInRate}%`,
      icon: SignalIcon,
      accent: "text-violet-600",
      surface: "bg-violet-50 dark:bg-violet-900/20",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminSectionNav />

      <section className="rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-8 py-8 text-white shadow-2xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-slate-200">
              <SignalIcon className="h-4 w-4" />
              Monitoring gala
            </p>
            <h1 className="text-3xl font-bold">Controle des entrees et suivi temps reel</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-300">
              Les administrateurs peuvent scanner les tickets QR, suivre les
              check-ins et superviser l'arrivee des participants depuis ce
              poste.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchOverview(false)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 self-start rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-medium transition hover:bg-white/15 disabled:opacity-60"
          >
            <ArrowPathIcon
              className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`}
            />
            Actualiser
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <article
            key={card.title}
            className="rounded-2xl bg-white p-5 shadow-lg dark:bg-slate-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{card.title}</p>
                <p className="mt-2 text-3xl font-bold">{card.value}</p>
              </div>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.surface}`}
              >
                <card.icon className={`h-6 w-6 ${card.accent}`} />
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl bg-white p-6 shadow-xl dark:bg-slate-800">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Scanner de tickets</h2>
              <p className="mt-2 text-sm text-slate-500">
                Scannez un QR code camera ou collez le code du ticket pour
                valider l'entree.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setScanResult(null);
                setCameraError("");
                setCameraActive((current) => !current);
              }}
              className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                cameraActive
                  ? "bg-slate-900 text-white hover:bg-slate-800"
                  : "bg-sky-600 text-white hover:bg-sky-700"
              }`}
            >
              <CameraIcon className="h-5 w-5" />
              {cameraActive ? "Arreter la camera" : "Activer la camera"}
            </button>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 p-4 text-white dark:border-slate-700">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-200">
                  Flux camera
                </p>
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-200">
                  {cameraActive ? "Actif" : "Veille"}
                </span>
              </div>

              <div className="mt-4 flex min-h-[320px] items-center justify-center rounded-[1.75rem] border border-white/10 bg-slate-900">
                {cameraActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="h-[320px] w-full rounded-[1.5rem] object-cover"
                  />
                ) : (
                  <div className="space-y-3 px-6 text-center text-slate-300">
                    <QrCodeIcon className="mx-auto h-12 w-12 text-slate-400" />
                    <p className="text-sm">
                      Activez la camera pour scanner les QR codes a l'entree.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                {cameraSupported
                  ? "Le scan camera fonctionne mieux sur Chrome ou Edge recents."
                  : "Votre navigateur ne propose pas BarcodeDetector. Utilisez la saisie manuelle ou un lecteur douchette."}
              </div>
            </div>

            <div className="space-y-4">
              <form
                onSubmit={handleManualSubmit}
                className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/40"
              >
                <label
                  htmlFor="manualTicket"
                  className="text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Saisie manuelle / douchette
                </label>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <input
                    id="manualTicket"
                    type="text"
                    value={manualCode}
                    onChange={(event) => setManualCode(event.target.value)}
                    placeholder="Collez le QR brut ou le code AIFUS-GALA-2026-000001"
                    className="input-field flex-1"
                  />
                  <button
                    type="submit"
                    disabled={scanLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-500 px-5 py-3 font-medium text-white transition hover:bg-amber-600 disabled:opacity-60"
                  >
                    {scanLoading ? (
                      <ArrowPathIcon className="h-5 w-5 animate-spin" />
                    ) : (
                      <QrCodeIcon className="h-5 w-5" />
                    )}
                    Scanner
                  </button>
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  Compatible avec un lecteur QR qui colle automatiquement la
                  valeur dans le champ puis envoie Entree.
                </p>
              </form>

              {cameraError && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-200">
                  {cameraError}
                </div>
              )}

              {scanResult && (
                <div
                  className={`rounded-[2rem] border px-5 py-5 ${
                    scanResult.level === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-100"
                      : scanResult.level === "warning"
                        ? "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-100"
                        : "border-red-200 bg-red-50 text-red-900 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-100"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {scanResult.level === "success" ? (
                        <CheckCircleIcon className="h-6 w-6" />
                      ) : scanResult.level === "warning" ? (
                        <ExclamationTriangleIcon className="h-6 w-6" />
                      ) : (
                        <NoSymbolIcon className="h-6 w-6" />
                      )}
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="font-semibold">{scanResult.message}</p>
                        <p className="text-sm opacity-80">
                          Source: {scanResult.source === "camera" ? "Camera" : "Saisie manuelle"}
                        </p>
                      </div>

                      {scanResult.inscription && (
                        <div className="grid gap-3 rounded-2xl bg-white/60 p-4 text-sm dark:bg-slate-950/20 sm:grid-cols-2">
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] opacity-70">
                              Participant
                            </p>
                            <p className="mt-1 font-semibold">
                              {scanResult.inscription.user?.prenom}{" "}
                              {scanResult.inscription.user?.nom}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] opacity-70">
                              Ticket
                            </p>
                            <p className="mt-1 font-semibold">
                              {scanResult.inscription.ticketCode}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] opacity-70">
                              Categorie
                            </p>
                            <p className="mt-1 font-semibold">
                              {categoriesLabels[scanResult.inscription.categorie] ||
                                scanResult.inscription.categorie}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] opacity-70">
                              Check-in
                            </p>
                            <p className="mt-1 font-semibold">
                              {formatDateTime(scanResult.inscription.checkedInAt)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <section className="rounded-3xl bg-white p-6 shadow-xl dark:bg-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-700">
                <ClockIcon className="h-6 w-6 text-slate-700 dark:text-slate-200" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Activite recente</h2>
                <p className="text-sm text-slate-500">
                  Derniers check-ins enregistres
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {overview.recentScans.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-600">
                  Aucun participant scanne pour le moment.
                </div>
              ) : (
                overview.recentScans.map((ticket) => (
                  <article
                    key={ticket.id}
                    className="rounded-2xl border border-slate-200 px-4 py-4 dark:border-slate-700"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold">
                          {ticket.user.prenom} {ticket.user.nom}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {ticket.ticketCode}
                        </p>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                        Present
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-slate-500">
                      {formatDateTime(ticket.checkedInAt)}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Scanne par{" "}
                      {ticket.checkedInBy
                        ? `${ticket.checkedInBy.prenom} ${ticket.checkedInBy.nom}`
                        : "Admin"}
                    </p>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-xl dark:bg-slate-800">
            <h2 className="text-xl font-semibold">Rappels terrain</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-900/40">
                Verifiez le nom affiche apres chaque scan avant de laisser entrer
                le participant.
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-900/40">
                En cas de QR illisible, utilisez le code ticket ou la douchette
                dans la saisie manuelle.
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-900/40">
                Un ticket deja scanne remonte en alerte orange pour eviter les
                doublons.
              </div>
            </div>
          </section>
        </aside>
      </section>

      <section className="rounded-3xl bg-white shadow-xl dark:bg-slate-800">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 dark:border-slate-700 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Liste des tickets valides</h2>
            <p className="mt-1 text-sm text-slate-500">
              Vue complete des billets emis pour le gala
            </p>
          </div>
          <div className="text-sm text-slate-500">
            {overview.tickets.length} ticket(s) visible(s)
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-900/40">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Participant
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Ticket
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Categorie
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Statut entree
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {overview.tickets.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    Aucun ticket valide pour le moment.
                  </td>
                </tr>
              ) : (
                overview.tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/30"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold">
                        {ticket.user.prenom} {ticket.user.nom}
                      </p>
                      <p className="text-sm text-slate-500">
                        {ticket.user.email}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-mono text-sm font-semibold">
                        {ticket.ticketCode}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {ticket.nombreInvites} invite(s)
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                        {categoriesLabels[ticket.categorie] || ticket.categorie}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      <p>{ticket.user.telephone || "Telephone non renseigne"}</p>
                      <p className="mt-1">
                        Paiement {ticket.referencePaiement || "sans reference"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                            ticket.checkedInAt
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                          }`}
                        >
                          {ticket.checkedInAt ? (
                            <CheckBadgeIcon className="h-4 w-4" />
                          ) : (
                            <ClockIcon className="h-4 w-4" />
                          )}
                          {ticket.checkedInAt ? "Scanne" : "En attente"}
                        </span>
                        <p className="text-xs text-slate-500">
                          {formatDateTime(ticket.checkedInAt)}
                        </p>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Monitoring;
