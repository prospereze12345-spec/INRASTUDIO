// INRA Studio Service Worker
//
// Important:
// - Never cache API responses.
// - Never cache Django authentication traffic.
// - Cache only frontend/static resources.
// - PWA failures must never interfere with normal website usage.

const SW_VERSION = 'inra-sw-v1';
const CACHE_NAME = `inra-shell-${SW_VERSION}`;

const APP_SHELL = [
  '/',
  '/offline',
  '/manifest.webmanifest',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .catch(() => {
        // Installation should not break the website.
      })
  );

  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) =>
                key.startsWith('inra-shell-') &&
                key !== CACHE_NAME
            )
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

function isApiRequest(url) {
  return (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/admin/') ||
    url.hostname.includes('api.')
  );
}

self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Only GET requests can safely use this cache strategy.
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  // NEVER intercept API/auth/admin requests.
  if (isApiRequest(url)) {
    return;
  }

  const shouldHandle =
    request.mode === 'navigate' ||
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'image' ||
    request.destination === 'font';

  if (!shouldHandle) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(request);

      const networkResponse = fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            cache.put(request, response.clone());
          }

          return response;
        })
        .catch(() => {
          // If offline, use cached resource.
          return (
            cachedResponse ||
            caches.match('/offline')
          );
        });

      // Cached content is returned immediately.
      // Network refreshes it in the background.
      return cachedResponse || networkResponse;
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'PING') {
    event.ports?.[0]?.postMessage({
      type: 'PONG',
      version: SW_VERSION,
    });
  }
});