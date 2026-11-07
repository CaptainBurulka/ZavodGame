// Offline play. The page is fetched fresh whenever there is a network, and served from the cache when there is none.
const CACHE = 'nichna-zavod-market-p1';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('nichna-zavod-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// On a weak signal the network can hang for a minute; after this long the cached game opens instead.
const NETWORK_WAIT_MS = 3000;

const fromCache = req => caches.match(req, { ignoreSearch: true }).then(hit => hit || caches.match('index.html'));

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  const network = fetch(e.request).then(res => {
    if (res.ok) {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
    }
    return res;
  });
  e.waitUntil(network.catch(() => {})); // a slow download still refreshes the cache for next time
  const slow = new Promise(resolve => setTimeout(resolve, NETWORK_WAIT_MS))
    .then(() => fromCache(e.request))
    .then(hit => hit || network); // nothing cached yet: keep waiting for the network
  e.respondWith(Promise.race([network, slow]).catch(() => fromCache(e.request)));
});
