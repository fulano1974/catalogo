const CACHE_NAME = 'haris-estoque-cache-v1.1'; // Atualize a versão do cache se mudar os arquivos!
const urlsToCache = [
  './', // A página inicial
  './index.html',
  // Se você tiver arquivos CSS ou JS separados, adicione-es aqui:
  // './style.css',
  // './script.js',
  'https://cdn-icons-png.flaticon.com/512/3238/3238058.png', // Seu ícone
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap', // Google Fonts
  // Imagem de fundo aleatória (pode mudar, então talvez não seja ideal cachear fixamente)
  // 'https://source.unsplash.com/random/1920x1080/?warehouse,logistics,abstract',
  './animao-de-um-rebocador-com-haris-escrito-na-inscri.jpeg', // Sua imagem local
  './manifest.json' // Adicione o manifest
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
        // Cache hit - return response
        if (response) {
          console.log('Service Worker: Serving from cache', event.request.url);
          return response;
        }
        // Fallback para a rede
        console.log('Service Worker: Fetching from network', event.request.url);
        return fetch(event.request).then(networkResponse => {
            // Clona a resposta para que ela possa ser usada pelo navegador e adicionada ao cache
            return caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
            });
        }).catch(error => {
            console.error('Service Worker: Fetch failed', event.request.url, error);
            // Você pode retornar uma página offline aqui, se quiser
            // return caches.match('/offline.html');
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
