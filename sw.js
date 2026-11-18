// Service Worker — الكاش للتطبيقات
const CACHE = 'chem-app-v1';
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
  './Periodic_Table_Animation/ali.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
