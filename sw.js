/* Leano Service Worker：缓存首屏资源，支持离线与“添加到主屏幕” */
const CACHE = 'leano-v1';
const ASSETS = [
  './index.html',
  './manifest.webmanifest',
  './css/base.css',
  './css/apps.css',
  './js/icons.js',
  './js/data.js',
  './js/store.js',
  './js/ui.js',
  './js/engine.js',
  './js/home.js',
  './js/apps-core.js',
  './js/apps-extra.js',
  './js/system.js',
  './js/main.js',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || !req.url.startsWith('http')) return;
  e.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((res) => {
        if (res && res.ok && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(req, clone));
        }
        return res;
      }).catch(() => {
        if (req.mode === 'navigate') return caches.match('./index.html');
      });
    })
  );
});