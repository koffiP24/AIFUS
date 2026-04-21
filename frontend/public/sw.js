self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheKeys = await caches.keys();
      await Promise.all(cacheKeys.map((cacheKey) => caches.delete(cacheKey)));
      await self.clients.claim();
      await self.registration.unregister();
    })(),
  );
});

self.addEventListener("fetch", () => {
  // Intentionally empty: this file only removes stale service workers/caches.
});
