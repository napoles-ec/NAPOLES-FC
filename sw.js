const CACHE_NAME = 'napoles-v1.0.52';

self.addEventListener('install', event => {
  console.log('[SW] Instalando', CACHE_NAME);
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('[SW] Activando', CACHE_NAME);
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => key !== CACHE_NAME && caches.delete(key))
    ))
  );
  // Forzar que el SW tome el control inmediatamente
  event.waitUntil(self.clients.claim());
  console.log('[SW] Ahora tiene el control de la página');
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
