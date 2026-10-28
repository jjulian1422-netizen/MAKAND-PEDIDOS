// Service Worker para AgroGestión - Estrategia Network-First (Siempre busca la versión más reciente)
const CACHE_NAME = "agrogestion-v5.3";
const ARCHIVOS_A_GUARDAR = [
  "./",
  "./index.html",
  "./app.js?v=5.3",
  "./proveedores_datos.js?v=5.3",
  "./xlsx.full.min.js",
  "./manifest.json",
  "./icono.svg"
];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ARCHIVOS_A_GUARDAR);
    })
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((claves) => {
      return Promise.all(
        claves.map((clave) => {
          if (clave !== CACHE_NAME) {
            return caches.delete(clave); // Borra caché viejo v1
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Network-First: Siempre intenta descargar la versión nueva de Netlify; si no hay internet, usa el caché
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;

  e.respondWith(
    fetch(e.request)
      .then((respuestaRed) => {
        if (respuestaRed && respuestaRed.status === 200) {
          const copiaRespuesta = respuestaRed.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, copiaRespuesta);
          });
        }
        return respuestaRed;
      })
      .catch(() => {
        return caches.match(e.request).then((respCache) => {
          return respCache || caches.match("./index.html");
        });
      })
  );
});
