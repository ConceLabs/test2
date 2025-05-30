// sw.js
const CACHE_NAME = 'biblioteca-juridica-cache-v1';
const urlsToCache = [
  '/test2/', // Página principal
  '/test2/index.html',
  '/test2/estilo_juridico_optimizado.css',
  '/test2/js/app.js',
  '/test2/manifest.json',
  '/test2/favicon.ico',
  '/test2/apple-touch-icon.png',
  '/test2/logo-1.png',
  // URLs de CDNs
  'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
  'https://cdn.jsdelivr.net/npm/mark.js@8.11.1/dist/mark.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
  // Si tienes una página offline, descomenta la siguiente línea:
  // '/test2/offline.html',
];

// Instalación del Service Worker: abrir cache y añadir los assets principales
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting(); // Activa el nuevo SW inmediatamente
});

// Activación del Service Worker: limpiar caches antiguas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.startsWith('biblioteca-juridica-cache-') && cacheName !== CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptar peticiones (fetch)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // No está en cache, ir a la red
        return fetch(event.request).then(
          networkResponse => {
            // Validación corregida
            if (!networkResponse || networkResponse.status !== 200 || (networkResponse.type !== 'basic' && networkResponse.type !== 'cors')) {
              return networkResponse;
            }
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                if (event.request.method === 'GET') {
                  cache.put(event.request, responseToCache);
                }
              });
            return networkResponse;
          }
        ).catch(error => {
          // Si tienes una página offline:
          // return caches.match('/test2/offline.html');
          console.error('Fetching failed:', error);
        });
      })
  );
});