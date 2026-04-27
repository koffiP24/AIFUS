import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownTrayIcon,
  ShareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { isIosDevice, isStandaloneDisplayMode } from "../utils/pwa";

const DISMISS_STORAGE_KEY = "aifus:pwa-install-dismissed";

const getStoredDismissState = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(DISMISS_STORAGE_KEY) === "true";
};

const PwaInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(() => isStandaloneDisplayMode());
  const [isDismissed, setIsDismissed] = useState(() => getStoredDismissState());
  const isIos = useMemo(() => isIosDevice(), []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    const handleInstalled = () => {
      setDeferredPrompt(null);
      setIsInstalled(true);
      window.localStorage.removeItem(DISMISS_STORAGE_KEY);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const dismissPrompt = () => {
    setIsDismissed(true);
    window.localStorage.setItem(DISMISS_STORAGE_KEY, "true");
  };

  const installApp = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  const shouldShow = !isInstalled && !isDismissed && (deferredPrompt || isIos);

  if (!shouldShow) {
    return null;
  }

  return (
    <div className="fixed inset-x-3 bottom-[var(--mobile-install-prompt-offset)] z-[60] md:hidden">
      <div className="relative overflow-hidden rounded-[1.7rem] border border-slate-200/80 bg-white/95 p-4 shadow-[0_28px_65px_-32px_rgba(15,23,42,0.55)] backdrop-blur-2xl dark:border-slate-700/80 dark:bg-slate-900/92">
        <div className="absolute inset-x-4 top-0 h-1 rounded-full bg-gradient-to-r from-sky-400 via-cyan-400 to-violet-400" />
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-sky-200/70 blur-3xl dark:bg-sky-500/20" />

        <button
          type="button"
          onClick={dismissPrompt}
          className="absolute right-3 top-3 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          aria-label="Fermer l'invite d'installation"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>

        <div className="relative flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-300">
            {deferredPrompt ? (
              <ArrowDownTrayIcon className="h-5 w-5" />
            ) : (
              <ShareIcon className="h-5 w-5" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-500">
              Application mobile
            </p>
            <h3 className="mt-1 text-base font-semibold text-slate-950 dark:text-white">
              Installez AIFUS 2026
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {deferredPrompt
                ? "Ajoutez la plateforme sur votre ecran d'accueil pour un acces plus rapide."
                : "Sur iPhone, ouvrez Partager puis choisissez Sur l'ecran d'accueil."}
            </p>

            {deferredPrompt ? (
              <button
                type="button"
                onClick={installApp}
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                Installer l'app
              </button>
            ) : (
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                <ShareIcon className="h-4 w-4" />
                Partager puis ajouter
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PwaInstallPrompt;
