const CACHE_NAME = 'napoles-v1.0.39'; // Cambia el número cuando modifiques archivos

const ASSETS = [
  'login.html',
  'perfil.html',
  'config.js',
  'manifest.json',
  'imagen/logo/icon-192x192.png',
  'imagen/logo/icon-512x512.png',
  'favicon.ico',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Outfit:wght@600;800;900&display=swap',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;700;800&display=swap'
];

self.addEventListener('install', (e) => {
  console.log('[SW] Instalando', CACHE_NAME);
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => key !== CACHE_NAME && caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).then(res => {
      const clone = res.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
      return res;
    }).catch(() => caches.match(e.request))
  );
});
