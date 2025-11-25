// sw.js: Service Worker con caché de recursos

const CACHE_NAME = "pwa-geolocalizacion-v1";
const ASSETS_TO_CACHE = [
    "./",
    "./index.html",
    "./app.js",
    "./manifest.webmanifest",
    "./images/icons/192.png",
    "./images/icons/512.png"
];

self.addEventListener("install", (event) => {
    console.log("SW: instalado");
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("SW: cacheando archivos");
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    console.log("SW: activado");
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log("SW: eliminando caché antigua:", cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// Estrategia: Cache first, fallback a network
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        }).catch(() => {
            // Fallback si no hay conexión
            return caches.match("./index.html");
        })
    );
});
