const CACHE_NAME = "napoles-fc-v1.0.41";  // 👈 Cambia este número cada vez que subas cambios

const urlsToCache = [
  "/NAPOLES-FC/",
  "/NAPOLES-FC/login.html",
  "/NAPOLES-FC/perfil.html",
  "/NAPOLES-FC/config.js",
  "/NAPOLES-FC/manifest.json",
  "/NAPOLES-FC/favicon.ico",
  "/NAPOLES-FC/imagen/logo/napoles_fc.png",
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Outfit:wght@600;800;900&display=swap",
  "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;700;800&display=swap"
];

self.addEventListener("install", event => {
  console.log("SW instalado", CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // Toma control inmediato
});

self.addEventListener("activate", event => {
  console.log("SW activado, limpiando viejas cachés");
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
  self.clients.claim(); // Hace que el SW controle las páginas ya abiertas
});

self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);
  
  // 🔥 Para peticiones a Google Apps Script (API) → SIEMPRE RED, sin caché
  if (url.hostname.includes("script.google.com") || url.pathname.includes("/exec")) {
    event.respondWith(fetch(event.request, { cache: "no-store" }));
    return;
  }
  
  // 📦 Para archivos estáticos de la app → Network First, fallback a caché
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
