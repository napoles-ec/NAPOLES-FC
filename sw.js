const CACHE_NAME = "napoles-fc-v1.0.43"; // 👈 Incrementa cada vez que subas cambios
const urlsToCache = [
    "/NAPOLES-FC/login.html",
    "/NAPOLES-FC/perfil.html",
    "/NAPOLES-FC/config.js",
    "/NAPOLES-FC/manifest.json",
    "/NAPOLES-FC/favicon.ico",
    "/NAPOLES-FC/imagen/logo/napoles_fc.png",
    "/NAPOLES-FC/imagen/logo/icon-192x192.png",
    "/NAPOLES-FC/imagen/logo/icon-512x512.png"
];

self.addEventListener("install", event => {
    console.log("SW instalado", CACHE_NAME);
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
    self.skipWaiting();
});

self.addEventListener("activate", event => {
    console.log("SW activado, limpiando viejas");
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => key !== CACHE_NAME && caches.delete(key))
        ))
    );
    self.clients.claim();
});

self.addEventListener("fetch", event => {
    const url = new URL(event.request.url);
    
    // 🔥 Para peticiones a Google Apps Script → SIEMPRE RED, sin caché
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
