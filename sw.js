const CACHE_NAME = "breach-app-v2";
const URLS_TO_CACHE =[
  "./",
  "./index.html",
  "./manifest.json",
  "./logo.png",
  "./logo.png"
];

// Install Event: Save files to local storage
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event: Clean up old caches so the app can update
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: Load from cache first, then fall back to network
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response; // Return cached file
      }
      return fetch(event.request); // Fetch from internet
    })
  );
});
