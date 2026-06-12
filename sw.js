const CACHE_NAME = 'napoles-v1.0.37'; // 🔥 Cambia este número CADA VEZ que modifiques archivos

const ASSETS = [
  'login.html',
  'perfil.html',
  'config.js',
  'manifest.json',
  'imagen/logo/napoles_fc.png',
  'imagen/logo/icon-192x192.png',
  'imagen/logo/icon-512x512.png',
  'favicon.ico',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Outfit:wght@600;800;900&display=swap',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;700;800&display=swap'
];

// ====================== INSTALACIÓN ======================
self.addEventListener('install', (e) => {
  console.log('[SW] Instalando nueva versión:', CACHE_NAME);
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// ====================== ACTIVACIÓN ======================
self.addEventListener('activate', (e) => {
  console.log('[SW] Activando nueva versión:', CACHE_NAME);
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Eliminando caché antigua:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ====================== ESTRATEGIA NETWORK FIRST ======================
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then(response => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, responseClone));
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});
