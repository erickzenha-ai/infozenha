// Service worker do InfoZenha: permite abrir o app sem internet.
// A página é buscada na rede primeiro (para receber atualizações) e cai no cache quando está offline.
const CACHE = 'infozenha-20260925213221';
const ARQUIVOS = ['./', './gestao-comercial.html', './manifest.webmanifest', './InfoZenha-logo.png', './InfoZenha-simbolo.png', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok) { const copia = res.clone(); caches.open(CACHE).then(c => c.put(req, copia)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('./gestao-comercial.html')))
  );
});
