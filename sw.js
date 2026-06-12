const CACHE_NAME = 'napoles-v1.0.47'; // Incrementa este número en cada cambio

// Eliminamos 'urlsToCache' por ahora para evitar errores. El SW funcionará igual.
// El navegador ahora se centrará en si el SW se instala y activa, no en lo que cachea.

self.addEventListener('install', event => {
  console.log('[SW] Instalando', CACHE_NAME);
  // FORZAR a que el SW se active inmediatamente, sin esperar a que se cierren otras pestañas.
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('[SW] Activando', CACHE_NAME);
  event.waitUntil(
    // Limpiar viejas caches (opcional pero recomendado)
    caches.keys().then(keys => Promise.all(
      keys.map(key => key !== CACHE_NAME && caches.delete(key))
    ))
  );
  // 👇 ESTA ES LA LÍNEA QUE FALTABA: TOMAR EL CONTROL DE LA PÁGINA INMEDIATAMENTE
  event.waitUntil(self.clients.claim());
  console.log('[SW] Ahora tiene el control de la página.');
});

self.addEventListener('fetch', event => {
  // No necesitas cachear nada para que la instalación funcione.
  // Solo respondemos con la red para que todo vaya fluido.
  event.respondWith(fetch(event.request));
});
