const canRegisterPwa = () => {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return false;
  }

  const { protocol, hostname } = window.location;

  return (
    protocol === "https:" ||
    hostname === "localhost" ||
    hostname === "127.0.0.1"
  );
};

export const isStandaloneDisplayMode = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
};

export const isIosDevice = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
};

export const registerPwaServiceWorker = () => {
  if (!canRegisterPwa()) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .catch((error) => {
        console.error("PWA service worker registration failed:", error);
      });
  });
};
