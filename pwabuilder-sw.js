const CACHE_VERSION = 'paulo-pwa-v5';
const APP_SHELL_CACHE = `${CACHE_VERSION}-app-shell`;
const OFFLINE_PAGE = '/offline.html';
const APP_SHELL = [
  '/',
  OFFLINE_PAGE,
  '/manifest.json',
  '/img/avatar-icon.png',
  '/css/bootstrap.min.css',
  '/css/main.css',
  '/js/manup.js'
];

self.addEventListener('install', function (event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then(function (cache) {
      return cache.addAll(APP_SHELL);
    })
  );
});

self.addEventListener('activate', function (event) {
  self.clients.claim();
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys
          .filter(function (key) {
            return key.startsWith('paulo-pwa-') && key !== APP_SHELL_CACHE;
          })
          .map(function (key) {
            return caches.delete(key);
          })
      );
    })
  );
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);

  if (requestUrl.origin === self.location.origin && event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(function (response) {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(APP_SHELL_CACHE).then(function (cache) {
              cache.put(event.request, copy);
            });
          }
          return response;
        })
        .catch(function () {
          return caches.match(event.request).then(function (response) {
            return response || caches.match(OFFLINE_PAGE);
          });
        })
    );
    return;
  }

  if (
    requestUrl.origin === self.location.origin &&
    ['style', 'script', 'font', 'image'].includes(event.request.destination)
  ) {
    event.respondWith(
      caches.match(event.request).then(function (cachedResponse) {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request).then(function (response) {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(APP_SHELL_CACHE).then(function (cache) {
              cache.put(event.request, copy);
            });
          }
          return response;
        }).catch(function () {
          return cachedResponse || caches.match(OFFLINE_PAGE);
        });
      })
    );
    return;
  }

  event.respondWith(
    fetch(event.request).catch(function () {
      return caches.match(event.request) || caches.match(OFFLINE_PAGE);
    })
  );
});

