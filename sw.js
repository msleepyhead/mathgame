// Define a name for our cache
const CACHE_NAME = 'math-practice-v1';

// List all the files and assets we want to cache
const FILES_TO_CACHE = [
  '/',
  'index.html',
  'Success.json',
  'error.json',
  'icons/icon-192x192.png',
  'icons/icon-512x512.png'
];

// The install event is fired when the service worker is first installed.
self.addEventListener('install', (evt) => {
  console.log('[ServiceWorker] Install');
  // We wait until the cache is opened and all our assets are added to it.
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching offline page');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// The activate event is fired when the service worker becomes active.
self.addEventListener('activate', (evt) => {
  console.log('[ServiceWorker] Activate');
  // This helps remove old, unused caches.
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

// The fetch event is fired every time the app makes a network request.
self.addEventListener('fetch', (evt) => {
  console.log('[ServiceWorker] Fetch', evt.request.url);
  // We check if the request is for a page navigation.
  evt.respondWith(
    // We try to find a response for this request in our cache.
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(evt.request)
        .then((response) => {
          // If a response is found in cache, we return it.
          // Otherwise, we make a network request.
          return response || fetch(evt.request);
        });
    })
  );
});
