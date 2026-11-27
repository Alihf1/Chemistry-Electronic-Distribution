// Service Worker — الكاش للتطبيقات (دعم العمل بدون نت)
const CACHE = 'chem-app-v4';
const RUNTIME_CACHE = 'chem-runtime-v4';
const ASSETS = [
  './index.html',
  './style.css',
  './script.js',
  './element-info.js',
  './manifest.json',
  './Chemistry.jpg',
  './logo.png',
  './icon-192x192.png',
  './icon-512x512.png',
  './Periodic_Table_Animation/index.html',
  './Periodic_Table_Animation/ali.css',
  './Periodic_Table_Animation/ali.js',
  './Periodic_Table_Animation/animejs.bundle.mjs',
  './Periodic_Table_Animation/IoskeleyMono-Regular.woff2',
  './Periodic_Table_Animation/IoskeleyMono-Bold.woff2'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS)).catch(err => console.log('Precache failed:', err))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE && k !== RUNTIME_CACHE).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // External resources (CDN animejs, fonts): cache-first with runtime cache
  if (url.origin !== self.location.origin) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(cache =>
        cache.match(req).then(cached => {
          if (cached) return cached;
          return fetch(req).then(res => {
            // Cache successful (or opaque) responses
            if (res && (res.status === 200 || res.type === 'opaque')) {
              cache.put(req, res.clone());
            }
            return res;
          }).catch(() => cached);
        })
      )
    );
    return;
  }

  // Same-origin: cache-first, fallback to network
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE).then(cache => cache.put(req, clone));
        }
        return res;
      }).catch(() => {
        // Navigation fallback
        if (req.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});