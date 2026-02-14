        // service-worker.js
        const CACHE_NAME = 'haris-estoque-cache-v1';
        const urlsToCache = [
          '/', // O seu index.html
          'index.html',
          'manifest.json',
          // Inclua todos os seus assets estáticos aqui
          'https://cdn-icons-png.flaticon.com/512/3238/3238058.png', // Ícone da caixa
          'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap', // Sua fonte
          'animao-de-um-rebocador-com-haris-escrito-na-inscri.jpeg', // Sua imagem do rebocador, se for local
          // e os ícones definidos no manifest.json
          'rebocador-192.png',
          'rebocador-512.png'
        ];

        self.addEventListener('install', event => {
          event.waitUntil(
            caches.open(CACHE_NAME)
              .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
              })
          );
        });

        self.addEventListener('fetch', event => {
          event.respondWith(
            caches.match(event.request)
              .then(response => {
                // Cache hit - return response
                if (response) {
                  return response;
                }
                return fetch(event.request);
              })
          );
        });