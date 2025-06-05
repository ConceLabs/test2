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
  // Página offline
  '/test2/offline.html',
  // Documentos HTML
  '/test2/docs/calculadora_abonos.html',
  '/test2/docs/documento1.html',
  '/test2/docs/documento10.html',
  '/test2/docs/documento11.html',
  '/test2/docs/documento2.html',
  '/test2/docs/documento3.html',
  '/test2/docs/documento4.html',
  '/test2/docs/documento5.html',
  '/test2/docs/documento6.html',
  '/test2/docs/documento7.html',
  '/test2/docs/documento8.html',
  '/test2/docs/documento9.html',
  // Minutas Markdown
  '/test2/minutas/10_COAUTORIA_EN_PORTE_O_TENENCIA_DE_ARMAS.md',
  '/test2/minutas/11_INTERNACION_PROVISIONAL_PREVIA_AL_INFORME_SIQUIATRICO.md',
  '/test2/minutas/12_TESTIGOS_NECESIDAD_DE_UNA_DECLARACION_PREVIA.md',
  '/test2/minutas/13_CONTROL_DE_IDENTIDAD_(ARROJAR_OBJETO).md',
  '/test2/minutas/14_JUICIOS_POR_VIDEOCONFERENCIA_(RECLAMOS_CONCRETOS).md',
  '/test2/minutas/15_CONTROL_DE_IDENTIDAD_Y_DENUNCIA_ANONIMA.md',
  '/test2/minutas/16_DETENCION_POR_GUARDIAS_DE_SEGURIDAD_O_MUNICIPALES.md',
  '/test2/minutas/17_DOLO_EVENTUAL_Y_DELITOS_TENTADOS_O_FRUSTRADOS.md',
  '/test2/minutas/18_DETENCION_POR_PARTICULARES.md',
  '/test2/minutas/19_CONTROL_DE_IDENTIDAD_PREVENTIVO_QUE_MUTA_A_INVESTIGATIVO.md',
  '/test2/minutas/20_CADENA_DE_CUSTODIA_Y_DEBIDO_PROCESO.md',
  '/test2/minutas/21_CONTROL_IDENTIDAD_OLOR_MARIHUANA.md',
  '/test2/minutas/22_CONTROL_IDENTIDAD_Y_HUIDA.md',
  '/test2/minutas/23_CONTROL_IDENTIDAD_Y_CAN_DETECTOR_DE_DROGAS.md',
  '/test2/minutas/24_Reclamos_por_infraccion_de_garantias_de_terceros.md',
  '/test2/minutas/25_Porte_o_tenencia_de_una_municion.md',
  '/test2/minutas/26-Delito-continuado-reiterado_.md',
  '/test2/minutas/26_Delito_continuado_-_reiterado.md',
  '/test2/minutas/27_Control_de_identidad_-_Transaccion_en_la_via_publica.md',
  '/test2/minutas/27_Control_viapublica.md',
  '/test2/minutas/28_Obligatoriedad_del_artíiulo_302_del_CPP_durante_la_etapa_investigativa.md',
  '/test2/minutas/29_Abuso_sexual_-_Introduccion_de_dedos.md',
  '/test2/minutas/2_CONTROL_DE_IDENTIDAD-LEY_DE_TRANSITO_C.md',
  '/test2/minutas/30_Actuaciones_autonomas_de_Carabineros_en_marchas_y_manifestaciones.md',
  '/test2/minutas/31_Retractacion_Victima_331_letra_f_CPP.md',
  '/test2/minutas/32_INSTRUCCION_SOBRE_PRIMERAS_DILIGENCIAS.md',
  '/test2/minutas/3_ACCESO_A_INFORMACION_EN_FACEBOOK.md',
  '/test2/minutas/4_PRUEBA_POSTERIOR_AL_CIERRE.md',
  '/test2/minutas/5_ARTICULO_195_LEY_18290.md',
  '/test2/minutas/6_REVISION_DE_CELULARES.md',
  '/test2/minutas/7_PRIMERAS_DILIGENCIAS_Y_GPS.md',
  '/test2/minutas/8_EFECTO_DE_LA_APELACION_DE_LA_REVOCACION_DE_PENA_SUSTITUTIVA.md',
  '/test2/minutas/9_CONTROL_DE_IDENTIDAD_EN_INVESTIGACION_EN_CURSO.md',
  '/test2/minutas/CONTROL_DE_IDENTIDAD-LEY_DE_TRANSITO_C.md',
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
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request)
        .then(networkResponse => {
          if (!networkResponse || networkResponse.status !== 200 || (networkResponse.type !== 'basic' && networkResponse.type !== 'cors')) {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            if (event.request.method === 'GET') {
              cache.put(event.request, responseToCache);
            }
          });
          return networkResponse;
        })
        .catch(() => caches.match('/test2/offline.html'));
    })
  );
});
