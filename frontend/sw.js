const routes = new Map();
routes.set('index', '/');
routes.set('offline', '/pages/offline.html');

self.addEventListener('push', (event) => {
  const payload = event.data?.text() ?? 'no payload';
  event.waitUntil(
    self.registration.showNotification('PWA Studies', {
      body: payload,
      icon: 'http://127.0.0.1:5500/assets/pwa.png',
    })
  );
});

/* Salvamento de páginas: salve alguma página que nunca
foi acessada para ser exibida na lista de páginas 
salvas em cachê */

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open('v1')
      .then((cache) => cache.addAll(routes.values()))
      .catch((error) => console.log(error))
  );
});

/* Controle de requisições: intercepte a requisição e, 
caso um erro de rede seja lançado, retorne a informação 
de que o dispositivo está sem conexão com internet */

async function handleRequest(request) {
  const store = await caches.open('v1');

  try {
    const response = await fetch(request);

    if (response.type !== 'opaque' && request.method === 'GET') {
      store.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.log(error);

    return (
      (await store.match(request)) || (await store.match(routes.get('offline')))
    );
  }
}

self.addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});
