const SW_VERSION = "aifus-pwa-v1";
const APP_SHELL_CACHE = `${SW_VERSION}-shell`;
const RUNTIME_CACHE = `${SW_VERSION}-runtime`;
const OFFLINE_URL = "/offline.html";

const APP_SHELL_ASSETS = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/favicon.svg",
  "/logo.jpg",
  "/pwa/icon-192.png",
  "/pwa/icon-512.png",
  "/pwa/icon-maskable-192.png",
  "/pwa/icon-maskable-512.png",
  "/pwa/apple-touch-icon.png",
  OFFLINE_URL,
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => cache.addAll(APP_SHELL_ASSETS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheKeys = await caches.keys();
      await Promise.all(
        cacheKeys
          .filter((cacheKey) => ![APP_SHELL_CACHE, RUNTIME_CACHE].includes(cacheKey))
          .map((cacheKey) => caches.delete(cacheKey)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const requestUrl = new URL(request.url);
  const isSameOrigin = requestUrl.origin === self.location.origin;

  if (request.method !== "GET" || !isSameOrigin) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request);
          const runtimeCache = await caches.open(RUNTIME_CACHE);
          runtimeCache.put("/", networkResponse.clone());
          return networkResponse;
        } catch (_error) {
          const cachedPage =
            (await caches.match(request)) ||
            (await caches.match("/")) ||
            (await caches.match(OFFLINE_URL));

          return (
            cachedPage ||
            new Response("Mode hors ligne indisponible.", {
              status: 503,
              headers: { "Content-Type": "text/plain; charset=utf-8" },
            })
          );
        }
      })(),
    );
    return;
  }

  const destination = request.destination;
  const isStaticAsset = ["image", "style", "font", "script"].includes(destination);

  if (!isStaticAsset && !requestUrl.pathname.endsWith(".webmanifest")) {
    return;
  }

  event.respondWith(
    (async () => {
      const runtimeCache = await caches.open(RUNTIME_CACHE);
      const cachedResponse = await runtimeCache.match(request);
      const fetchAndCache = () =>
        fetch(request)
          .then((networkResponse) => {
            runtimeCache.put(request, networkResponse.clone());
            return networkResponse;
          })
          .catch(() => cachedResponse);

      if (["script", "style"].includes(destination)) {
        return fetchAndCache();
      }

      return cachedResponse || fetchAndCache();
    })(),
  );
});
