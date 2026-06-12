const CACHE_NAME = 'napoles-v1.0.46';
const urlsToCache = [
  '/NAPOLES-FC/login.html',
  '/NAPOLES-FC/perfil.html',
  '/NAPOLES-FC/config.js',
  '/NAPOLES-FC/manifest.json',
  '/NAPOLES-FC/favicon.ico',
  '/NAPOLES-FC/imagen/logo/napoles_fc.png'
];

self.addEventListener('install', event => {
  console.log('[SW] Instalando', CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('[SW] Activando', CACHE_NAME);
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => key !== CACHE_NAME && caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
