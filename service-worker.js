console.log('Service worker loaded !');

const excludeFromCache = [
  'https://www.google.com/images/phd/px.gif',
  'http://localhost:8081/data/spacex.json'
];

const cacheVersion = 'v7';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheVersion)
      .then(function(cache) {
        return cache.addAll([
          '/',
          '/index.html',
          '/js/app.js',
          '/js/view/home.js',
          '/js/view/todo.js',
          '/js/api/todo.js',
          '/js/idb.js',
          '/js/network.js',
          '/style/tailwind.css',
        ])
      })
  );
});

self.addEventListener('activate', event => {
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
                })

                return response;
            })
        })
        .catch(function() {
          return caches.match('index.html');
        })
    )
  }
});

self.addEventListener('message', function(event) {
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
