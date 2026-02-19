const CACHE_NAME = 'haris-estoque-cache-v1.1';
const urlsToCache = [
  './',
  './index.html',
  'https://cdn-icons-png.flaticon.com/512/3238/3238058.png',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
  // Sua imagem local (se ainda usar como fallback, caso contrário remova)
  './animao-de-um-rebocador-com-haris-escrito-na-inscri.jpeg',
  './manifest.json',
  // URLs dos seus ícones de alerta/crítico no Cloudinary para cache offline
  'https://res.cloudinary.com/dqp57nr5g/image/upload/v1771459662/icone_amarelo_alerta_ykelar.png',
  'https://res.cloudinary.com/dqp57nr5g/image/upload/v1771459681/icone_vermelho_critico_zsxrwm.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
     .then(cache => {
        console.log('Service Worker: Cache opened');
        return cache.addAll(urlsToCache).then(() => {
          console.log('Service Worker: All URLs cached');
        }).catch(error => {
          console.error('Service Worker: Failed to cache some URLs', error);
        });
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
     .then(response => {
        if (response) {
          console.log('Service Worker: Serving from cache', event.request.url);
          return response;
        }
        console.log('Service Worker: Fetching from network', event.request.url);
        return fetch(event.request).then(networkResponse => {
            return caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
            });
        }).catch(error => {
            console.error('Service Worker: Fetch failed', event.request.url, error);
        });
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
