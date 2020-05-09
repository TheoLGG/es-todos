console.log('Service worker registration');

const excludeFromCache = [
    'https://www.google.com/images/phd/px.gif',
    'http://localhost:3000/todos',
    '/http://localhost:8080/config.json'
];

const cacheVersion = 'v1';

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(cacheVersion)
            .then(function(cache) {
                return cache.addAll([
                    '/',
                    '/styles/tailwind.css',
                    '/js/network.js',
                    '/js/api/todo.js',
                    '/js/idb.js',
                    '/web_modules/idb.js',
                    '/web_modules/lit-html.js',
                    '/web_modules/page.js',
                    '/web_modules/lit-icon.js',
                ]);
            })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', function(event) {
    const url = new URL(event.request.url);
    const link = `${url.origin}${url.pathname}`;

    if (event.request.method === 'GET' && !excludeFromCache.includes(link)) {
        event.respondWith(
            caches.match(event.request)
                .then(function(response) {
                    return response || fetch(event.request)
                        .then(function(response) {
                            const responseClone = response.clone();
                            caches.open(cacheVersion)
                                .then(function(cache) {
                                    cache.put(event.request, responseClone);
                                });

                            return response;
                        })
                })
                .catch(function() {
                    return caches.match('index.html');
                })
        )
    }
});

self.addEventListener('message', function (event) {
    if (event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});