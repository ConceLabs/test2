// sw.js
const CACHE_NAME = 'biblioteca-juridica-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './estilo_juridico_optimizado.css',
  './js/app.js',
  './manifest.json',
  './favicon.ico',
  './apple-touch-icon.png',
  './logo-1.png',
  // URLs de CDNs
  'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
  'https://cdn.jsdelivr.net/npm/mark.js@8.11.1/dist/mark.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
  // Considerar añadir los archivos .woff2 de Font Awesome si los usas localmente o quieres cachearlos específicamente
  // Los documentos .html y .md se cachearán dinámicamente
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
});

// Activación del Service Worker: limpiar caches antiguas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          // Borrar caches que no sean la actual
          return cacheName.startsWith('biblioteca-juridica-cache-') && cacheName !== CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
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
            // Comprobar si recibimos una respuesta válida
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' && !networkResponse.type === 'cors') {
              return networkResponse;
            }

            // Importante: Clonar la respuesta. Una respuesta es un stream y
            // solo puede ser consumida una vez. Necesitamos una para el browser y otra para la cache.
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                // Cachear solo peticiones GET
                if (event.request.method === 'GET') {
                    cache.put(event.request, responseToCache);
                }
              });

            return networkResponse;
          }
        ).catch(error => {
            // Manejar errores de red, por ejemplo, mostrar una página offline genérica
            console.error('Fetching failed:', error);
            // Podrías retornar una respuesta offline aquí si tienes una página offline.html cacheada
            // return caches.match('./offline.html');
        });
      })
  );
});