const CACHE = 'network-or-cache-v1';
const assetUrls = [
    './index.html',
    './css/style.css',
    './js/main.js',
];
self.addEventListener('install', async (event) => {
    const cache = await caches.open(CACHE);
    cache.addAll(assetUrls);
});

self.addEventListener('activate', async (event) => {
    const cacheNames = await caches.keys();
    await Promise.all(
        cacheNames
            .filter(name => name !== CACHE)
            .map(name => caches.delete(name))
)
});

self.addEventListener('fetch', (event) => {
    event.respondWith(cacheFirst(event.request));
});

async function cacheFirst(request) {
    const cached = await caches.match(request);
    return cached ?? await fetch(request);
}