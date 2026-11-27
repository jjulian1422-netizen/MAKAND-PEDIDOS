// Service Worker de Makand Pedidos - Estrategia Network-First con Fallback Seguro
const CACHE_NAME = "makand-v6.3";
const ARCHIVOS_A_GUARDAR = [
  "./",
  "./index.html",
  "./app.js?v=6.3",
  "./proveedores_datos.js?v=6.3",
  "./config-supabase.js?v=6.3",
  "./nube-supabase.js?v=6.3",
  "./tailwind.css?v=6.3",
  "./supabase.min.js?v=6.3",
  "./xlsx.full.min.js",
  "./manifest.json",
  "./icono.svg",
  "./assets/makand-wordmark-positivo.svg",
  "./assets/makand-logo-positivo.svg"
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
            return caches.delete(clave); // Limpiar cachés anteriores
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Network-First Seguro:
// NUNCA devolver HTML como fallback para scripts (.js) ni hojas de estilo (.css)
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  // No interceptar ni cachear la API de Supabase (datos y sesiones privados)
  if (new URL(e.request.url).hostname.endsWith("supabase.co")) return;

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
      .catch(async () => {
        const respCache = await caches.match(e.request);
        if (respCache) return respCache;

        // Solo devolver index.html si es una navegación de página principal
        const esNavegacionHtml = e.request.mode === "navigate" || 
          (e.request.headers.get("accept") && e.request.headers.get("accept").includes("text/html"));

        if (esNavegacionHtml) {
          return caches.match("./index.html");
        }

        // Si es un script o estilo externo que falló, devolver error HTTP para no corromper la ejecución de JS
        return new Response("Recurso offline no disponible", {
          status: 503,
          statusText: "Offline",
          headers: { "Content-Type": "text/plain" }
        });
      })
  );
});
