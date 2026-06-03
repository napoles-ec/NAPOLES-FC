const CACHE_NAME = 'napoles-v1.0.34'; // 🔥 Cambia el número CADA VEZ que actualices archivos (HTML, CSS, JS, etc.)

const ASSETS = [
  'login.html',
  'perfil.html',     // Ajusta según tu archivo principal después del login
  'index.html',      // Si usas index.html como entrada
  'manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Outfit:wght@600;800;900&display=swap'
];

// ====================== INSTALACIÓN ======================
self.addEventListener('install', (e) => {
  console.log('[SW] Instalando nueva versión:', CACHE_NAME);
  self.skipWaiting(); // El nuevo SW toma el control de inmediato
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
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
    }).then(() => {
      // Notificar a la página que hay una nueva versión disponible
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'NEW_VERSION_AVAILABLE',
            version: CACHE_NAME
          });
        });
      });
    })
  );
});

// ====================== ESTRATEGIA NETWORK FIRST ======================
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then(response => {
        // Clonar la respuesta para guardar en caché
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(e.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        return caches.match(e.request);
      })
  );
});
