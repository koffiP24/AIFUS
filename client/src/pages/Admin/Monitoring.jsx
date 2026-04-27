import { useEffect, useCallback, useRef, useState } from "react";
import jsQR from "jsqr";
import {
  ArrowPathIcon,
  CameraIcon,
  CheckBadgeIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  NoSymbolIcon,
  PhotoIcon,
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
  if (!value) return "--";
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
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [cameraSupported, setCameraSupported] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [scannerEngine, setScannerEngine] = useState("manual");
  const [showScroll, setShowScroll] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const resultCardRef = useRef(null);
  const streamRef = useRef(null);
  const frameRef = useRef(null);
  const scanLockRef = useRef(false);
  const detectorRef = useRef(null);

  // Gestion du bouton scroll to top
  useEffect(() => {
    const toggleScrollButton = () => {
      const scrolled = window.pageYOffset || document.documentElement.scrollTop;
      setShowScroll(scrolled > 300);
    };
    window.addEventListener("scroll", toggleScrollButton);
    window.addEventListener("load", toggleScrollButton);
    return () => {
      window.removeEventListener("scroll", toggleScrollButton);
      window.removeEventListener("load", toggleScrollButton);
    };
  }, []);

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
      videoRef.current.pause?.();
      videoRef.current.srcObject = null;
    }
  };

  const decodeQrFromSource = (source, width, height) => {
    if (!canvasRef.current || !source || !width || !height) return "";
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return "";
    canvas.width = width;
    canvas.height = height;
    context.drawImage(source, 0, 0, width, height);
    const imageData = context.getImageData(0, 0, width, height);
    const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "attemptBoth",
    });
    return qrCode?.data || "";
  };

  const fetchOverview = async (showLoader = false) => {
    if (showLoader) setLoading(true);
    else setRefreshing(true);
    try {
      const response = await api.get("/admin/monitoring");
      setOverview(response.data);
    } catch (_error) {
      setScanResult({
        level: "error",
        message: "Impossible de charger le monitoring pour le moment.",
      });
    } finally {
      if (showLoader) setLoading(false);
      else setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOverview(true);
  }, []);

  useEffect(() => {
    if (scanResult) {
      resultCardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [scanResult]);

  useEffect(() => {
    let isMounted = true;
    const detectScannerCapabilities = async () => {
      const canUseCamera = Boolean(navigator.mediaDevices?.getUserMedia);
      if (!isMounted) return;
      setCameraSupported(canUseCamera);
      if (!canUseCamera) {
        detectorRef.current = null;
        setScannerEngine("manual");
        return;
      }
      if (window.BarcodeDetector) {
        try {
          const formats = await window.BarcodeDetector.getSupportedFormats();
          const supportsQr =
            formats.length === 0 || formats.includes("qr_code");
          if (supportsQr) {
            detectorRef.current = new window.BarcodeDetector({
              formats: ["qr_code"],
            });
            if (isMounted) setScannerEngine("native");
            return;
          }
        } catch (_error) {}
      }
      detectorRef.current = null;
      if (isMounted) setScannerEngine("jsqr");
    };
    detectScannerCapabilities();
    return () => {
      isMounted = false;
      detectorRef.current = null;
    };
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
      const nextResult = {
        ...response.data,
        source,
        level: status === "already_checked_in" ? "warning" : "success",
      };
      setScanResult(nextResult);
      setFeedbackOpen(true);
      setManualCode("");
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(
          status === "already_checked_in" ? [80, 60, 80] : [160, 80, 160],
        );
      }
      await fetchOverview(false);
    } catch (error) {
      setScanResult({
        level: "error",
        source,
        message:
          error.response?.data?.message || "Le ticket n'a pas pu être traité.",
        scanStatus: error.response?.data?.scanStatus,
        inscription: error.response?.data?.inscription || null,
      });
      setFeedbackOpen(true);
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate([120, 80, 120, 80, 120]);
      }
    } finally {
      setScanLoading(false);
      scanLockRef.current = false;
    }
  };

  // Utilisation de useCallback au lieu de useEffectEvent
  const handleDetectedCode = useCallback(async (rawValue) => {
    scanLockRef.current = true;
    stopCamera();
    setCameraActive(false);
    await submitScan(rawValue, "camera");
  }, []);

  useEffect(() => {
    if (!cameraActive) {
      stopCamera();
      return;
    }
    if (!cameraSupported) {
      setCameraError(
        "Le scan camera n'est pas disponible sur cet appareil. Utilisez la photo ou la saisie manuelle.",
      );
      setCameraActive(false);
      return;
    }
    let cancelled = false;
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          video.setAttribute("playsinline", "true");
          await video.play();
        }
        const scanFrame = async () => {
          if (cancelled) return;
          const currentVideo = videoRef.current;
          if (!currentVideo) {
            frameRef.current = requestAnimationFrame(scanFrame);
            return;
          }
          if (scanLockRef.current) {
            frameRef.current = requestAnimationFrame(scanFrame);
            return;
          }
          if (currentVideo.readyState < 2 || !currentVideo.videoWidth) {
            frameRef.current = requestAnimationFrame(scanFrame);
            return;
          }
          let rawValue = "";
          if (detectorRef.current) {
            try {
              const detectedCodes =
                await detectorRef.current.detect(currentVideo);
              rawValue =
                detectedCodes.find((item) => item.rawValue)?.rawValue || "";
            } catch (_error) {
              detectorRef.current = null;
              setScannerEngine("jsqr");
            }
          }
          if (!rawValue) {
            rawValue = decodeQrFromSource(
              currentVideo,
              currentVideo.videoWidth,
              currentVideo.videoHeight,
            );
          }
          if (rawValue) {
            await handleDetectedCode(rawValue);
            return;
          }
          frameRef.current = requestAnimationFrame(scanFrame);
        };
        frameRef.current = requestAnimationFrame(scanFrame);
      } catch (_error) {
        if (!cancelled) {
          setCameraError(
            "Impossible d'accéder à la caméra. Vérifiez les autorisations.",
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
  }, [cameraActive, cameraSupported, handleDetectedCode]);

  const handleManualSubmit = async (event) => {
    event.preventDefault();
    await submitScan(manualCode, "manual");
  };

  const handleImageScan = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setScanLoading(true);
    setScanResult(null);
    setCameraError("");
    const objectUrl = URL.createObjectURL(file);
    try {
      const image = await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = objectUrl;
      });
      const rawValue = decodeQrFromSource(
        image,
        image.naturalWidth || image.width,
        image.naturalHeight || image.height,
      );
      if (!rawValue) {
        setScanResult({
          level: "error",
          source: "photo",
          message: "Aucun QR code lisible détecté.",
        });
        return;
      }
      await submitScan(rawValue, "photo");
    } catch (_error) {
      setScanResult({
        level: "error",
        source: "photo",
        message: "Impossible de lire cette image.",
      });
    } finally {
      URL.revokeObjectURL(objectUrl);
      event.target.value = "";
      setScanLoading(false);
    }
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
      title: "Participants scannés",
      value: overview.stats.checkedInCount,
      icon: CheckCircleIcon,
      accent: "text-emerald-600",
      surface: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      title: "Restants",
      value: overview.stats.remainingToCheckIn,
      icon: UserGroupIcon,
      accent: "text-sky-600",
      surface: "bg-sky-50 dark:bg-sky-900/20",
    },
    {
      title: "Check-in",
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

  const feedbackToneClasses =
    scanResult?.level === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-100"
      : scanResult?.level === "warning"
        ? "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-100"
        : "border-red-200 bg-red-50 text-red-900 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-100";

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Bouton retour en haut - apparaît après scroll */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl active:scale-90 ${
          showScroll
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-10 opacity-0"
        }`}
        style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.2)" }}
        aria-label="Remonter en haut"
        title="Remonter en haut"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 transition-transform duration-200 group-hover:rotate-12"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
        <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </button>

      <AdminSectionNav />

      {/* Le reste du contenu est strictement identique à l'original, sans aucune autre modification */}
      <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-5 py-6 text-white shadow-2xl md:rounded-3xl md:px-8 md:py-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[0.68rem] uppercase tracking-[0.25em] text-slate-200 md:text-xs">
              <SignalIcon className="h-4 w-4" />
              Monitoring gala
            </p>
            <h1 className="text-2xl font-bold md:text-3xl">
              Contrôle des entrées et suivi temps réel
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-300">
              Scannez les tickets QR, suivez les check-ins et pilotez l'arrivée
              des participants depuis une interface adaptée au terrain, y
              compris sur mobile.
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

      <section className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
        {statCards.map((card) => (
          <article
            key={card.title}
            className="rounded-[1.7rem] bg-white p-4 shadow-lg dark:bg-slate-800 md:rounded-2xl md:p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500 md:text-sm md:normal-case md:tracking-normal">
                  {card.title}
                </p>
                <p className="mt-2 text-2xl font-bold md:text-3xl">
                  {card.value}
                </p>
              </div>
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl ${card.surface} md:h-12 md:w-12`}
              >
                <card.icon className={`h-6 w-6 ${card.accent}`} />
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="rounded-[2rem] bg-white p-5 shadow-xl dark:bg-slate-800 md:rounded-3xl md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Scanner de tickets</h2>
              <p className="mt-2 text-sm text-slate-500">
                Caméra live, photo importée ou saisie manuelle : tout est prévu
                pour valider rapidement l'entrée.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setScanResult(null);
                  setCameraError("");
                  setCameraActive((prev) => !prev);
                }}
                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  cameraActive
                    ? "bg-slate-900 text-white hover:bg-slate-800"
                    : "bg-sky-600 text-white hover:bg-sky-700"
                }`}
              >
                <CameraIcon className="h-5 w-5" />
                {cameraActive ? "Arrêter la caméra" : "Activer la caméra"}
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <PhotoIcon className="h-5 w-5" />
                Scanner depuis une photo
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 p-4 text-white dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-200">
                    Flux caméra
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-400">
                    {scannerEngine === "native"
                      ? "BarcodeDetector + secours jsQR"
                      : scannerEngine === "jsqr"
                        ? "Mode jsQR optimisé mobile"
                        : "Mode manuel"}
                  </p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-200">
                  {cameraActive ? "Actif" : "Veille"}
                </span>
              </div>
              <div className="relative mt-4 flex min-h-[22rem] items-center justify-center overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900 md:min-h-[24rem]">
                {cameraActive ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className="h-full min-h-[22rem] w-full rounded-[1.6rem] object-cover md:min-h-[24rem]"
                    />
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <div className="h-48 w-48 rounded-[2rem] border-2 border-white/70 shadow-[0_0_0_999px_rgba(15,23,42,0.12)] md:h-56 md:w-56"></div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4 px-6 text-center text-slate-300">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                      <QrCodeIcon className="h-8 w-8 text-slate-100" />
                    </div>
                    <div>
                      <p className="font-medium">Prêt pour le scan</p>
                      <p className="mt-2 text-sm text-slate-400">
                        Activez la caméra ou importez une photo du QR code.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                {!cameraSupported
                  ? "Votre navigateur ne permet pas l'accès à la caméra. Utilisez la photo ou la saisie manuelle."
                  : scannerEngine === "native"
                    ? "Scan temps réel avec BarcodeDetector puis jsQR en secours."
                    : "Scan temps réel avec jsQR, fiable sur mobile."}
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
                    onChange={(e) => setManualCode(e.target.value)}
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
                  valeur.
                </p>
              </form>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/50">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      Importer une photo du QR
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Pratique sur mobile si la lecture live tarde.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Choisir
                  </button>
                </div>
              </div>

              {cameraError && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-200">
                  {cameraError}
                </div>
              )}

              {scanResult && (
                <div
                  ref={resultCardRef}
                  className={`rounded-[2rem] border px-5 py-5 ${feedbackToneClasses}`}
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
                          Source:{" "}
                          {scanResult.source === "camera"
                            ? "Caméra live"
                            : scanResult.source === "photo"
                              ? "Photo"
                              : "Saisie manuelle"}
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
                              Catégorie
                            </p>
                            <p className="mt-1 font-semibold">
                              {categoriesLabels[
                                scanResult.inscription.categorie
                              ] || scanResult.inscription.categorie}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] opacity-70">
                              Check-in
                            </p>
                            <p className="mt-1 font-semibold">
                              {formatDateTime(
                                scanResult.inscription.checkedInAt,
                              )}
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

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleImageScan}
          />
          <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
        </div>

        <aside className="space-y-6">
          <section className="rounded-[2rem] bg-white p-5 shadow-xl dark:bg-slate-800 md:rounded-3xl md:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-700">
                <ClockIcon className="h-6 w-6 text-slate-700 dark:text-slate-200" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Activité récente</h2>
                <p className="text-sm text-slate-500">
                  Derniers check-ins enregistrés
                </p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {overview.recentScans.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-600">
                  Aucun participant scanné pour le moment.
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
                        Présent
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-slate-500">
                      {formatDateTime(ticket.checkedInAt)}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Scanné par{" "}
                      {ticket.checkedInBy
                        ? `${ticket.checkedInBy.prenom} ${ticket.checkedInBy.nom}`
                        : "Admin"}
                    </p>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="rounded-[2rem] bg-white p-5 shadow-xl dark:bg-slate-800 md:rounded-3xl md:p-6">
            <h2 className="text-xl font-semibold">Rappels terrain</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-900/40">
                Vérifiez le nom affiché après chaque scan avant de laisser
                entrer le participant.
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-900/40">
                En cas de QR illisible, importez une photo ou utilisez le code
                ticket en saisie manuelle.
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-900/40">
                Un ticket déjà scanné remonte en alerte orange pour éviter les
                doublons.
              </div>
            </div>
          </section>
        </aside>
      </section>

      {feedbackOpen && scanResult && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/45 p-3 backdrop-blur-sm md:items-center md:p-6">
          <div
            className={`w-full max-w-lg rounded-[2rem] border px-5 py-5 shadow-2xl md:rounded-[2.2rem] md:px-6 md:py-6 ${feedbackToneClasses}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {scanResult.level === "success" ? (
                  <CheckCircleIcon className="h-8 w-8" />
                ) : scanResult.level === "warning" ? (
                  <ExclamationTriangleIcon className="h-8 w-8" />
                ) : (
                  <NoSymbolIcon className="h-8 w-8" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-[0.22em] opacity-70">
                  {scanResult.level === "success"
                    ? "Scan valide"
                    : scanResult.level === "warning"
                      ? "Attention"
                      : "Échec du scan"}
                </p>
                <h3 className="mt-2 text-2xl font-bold">
                  {scanResult.message}
                </h3>
                <p className="mt-2 text-sm opacity-80">
                  Source:{" "}
                  {scanResult.source === "camera"
                    ? "Caméra live"
                    : scanResult.source === "photo"
                      ? "Photo"
                      : "Saisie manuelle"}
                </p>
              </div>
            </div>
            {scanResult.inscription && (
              <div className="mt-5 grid gap-3 rounded-[1.6rem] bg-white/65 p-4 text-sm dark:bg-slate-950/20 sm:grid-cols-2">
                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.2em] opacity-70">
                    Participant
                  </p>
                  <p className="mt-1 text-base font-semibold">
                    {scanResult.inscription.user?.prenom}{" "}
                    {scanResult.inscription.user?.nom}
                  </p>
                </div>
                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.2em] opacity-70">
                    Ticket
                  </p>
                  <p className="mt-1 font-mono text-sm font-semibold">
                    {scanResult.inscription.ticketCode}
                  </p>
                </div>
                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.2em] opacity-70">
                    Catégorie
                  </p>
                  <p className="mt-1 font-semibold">
                    {categoriesLabels[scanResult.inscription.categorie] ||
                      scanResult.inscription.categorie}
                  </p>
                </div>
                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.2em] opacity-70">
                    Statut
                  </p>
                  <p className="mt-1 font-semibold">
                    {scanResult.scanStatus === "checked_in"
                      ? "Participant enregistré"
                      : scanResult.scanStatus === "already_checked_in"
                        ? "Déjà scanné"
                        : "Vérification requise"}
                  </p>
                </div>
              </div>
            )}
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setFeedbackOpen(false);
                  setScanResult(null);
                  setCameraError("");
                  setCameraActive(true);
                }}
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              >
                Scanner un autre ticket
              </button>
              <button
                type="button"
                onClick={() => setFeedbackOpen(false)}
                className="inline-flex items-center justify-center rounded-2xl border border-current/20 bg-white/65 px-4 py-3 text-sm font-semibold transition hover:bg-white/80 dark:bg-slate-950/20 dark:hover:bg-slate-950/35"
              >
                Rester sur le résultat
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="rounded-[2rem] bg-white shadow-xl dark:bg-slate-800 md:rounded-3xl">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-5 dark:border-slate-700 md:flex-row md:items-center md:justify-between md:px-6">
          <div>
            <h2 className="text-2xl font-semibold">
              Liste des tickets valides
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Vue complète des billets émis pour le gala
            </p>
          </div>
          <div className="text-sm text-slate-500">
            {overview.tickets.length} ticket(s) visible(s)
          </div>
        </div>

        {/* Version mobile et desktop inchangées */}
        <div className="space-y-3 px-4 py-4 md:hidden">
          {/* ... (le contenu mobile original est conservé, identique) ... */}
          {overview.tickets.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-600">
              Aucun ticket valide pour le moment.
            </div>
          ) : (
            overview.tickets.map((ticket) => (
              <article
                key={ticket.id}
                className="rounded-[1.6rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">
                      {ticket.user.prenom} {ticket.user.nom}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {ticket.user.email}
                    </p>
                  </div>
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
                    {ticket.checkedInAt ? "Scanné" : "En attente"}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl bg-white px-3 py-3 dark:bg-slate-950">
                    <p className="text-[0.68rem] uppercase tracking-[0.2em] text-slate-500">
                      Ticket
                    </p>
                    <p className="mt-1 font-mono text-xs font-semibold">
                      {ticket.ticketCode}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white px-3 py-3 dark:bg-slate-950">
                    <p className="text-[0.68rem] uppercase tracking-[0.2em] text-slate-500">
                      Catégorie
                    </p>
                    <p className="mt-1 font-semibold">
                      {categoriesLabels[ticket.categorie] || ticket.categorie}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white px-3 py-3 dark:bg-slate-950">
                    <p className="text-[0.68rem] uppercase tracking-[0.2em] text-slate-500">
                      Contact
                    </p>
                    <p className="mt-1 text-xs">
                      {ticket.user.telephone || "Téléphone non renseigné"}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white px-3 py-3 dark:bg-slate-950">
                    <p className="text-[0.68rem] uppercase tracking-[0.2em] text-slate-500">
                      Check-in
                    </p>
                    <p className="mt-1 text-xs">
                      {formatDateTime(ticket.checkedInAt)}
                    </p>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        <div className="hidden overflow-x-auto md:block">
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
                  Catégorie
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Statut entrée
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
                      <p>
                        {ticket.user.telephone || "Téléphone non renseigné"}
                      </p>
                      <p className="mt-1">
                        Paiement {ticket.referencePaiement || "sans référence"}
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
                          {ticket.checkedInAt ? "Scanné" : "En attente"}
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
