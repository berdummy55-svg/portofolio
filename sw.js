const CACHE_NAME = 'manga-cache-v1'; // ganti versi jika ada perubahan besar
const BASE_URL = 'https://pub-e8931c5705eb48b4b09534f5efbeacb9.r2.dev';

// Aset yang langsung di-cache saat service worker terpasang (misal cover di halaman index)
const PRECACHE_ASSETS = [
  // Contoh: cover manga1, cover manga2, dll.
  // Kamu bisa menambahkan URL cover spesifik di sini
  '${BASE_URL}/manga1/newnormal.png',
  '${BASE_URL}/manga2/ALCHE.png',
  // ... tambahkan sesuai kebutuhan
];

// Pasang (install) – cache aset statis
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Service Worker: Caching awal');
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
});

// Aktif (activate) – hapus cache lama jika ada versi baru
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
});

// Strategi: Cache Falling Back to Network (cache dulu, network hanya jika belum ada)
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Hanya tangani permintaan ke BASE_URL (gambar chapter/cover)
  if (url.origin === new URL(BASE_URL).origin) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(cachedResponse => {
          // Kembalikan dari cache jika ada
          if (cachedResponse) {
            return cachedResponse;
          }
          // Jika tidak ada, ambil dari jaringan, lalu simpan ke cache
          return fetch(event.request).then(networkResponse => {
            // Simpan salinan ke cache (pastikan response sukses)
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            // Jika offline dan tidak ada di cache, tampilkan fallback (opsional)
            return new Response('Offline', { status: 503 });
          });
        });
      })
    );
  }
  // Untuk request lain (HTML, CSS, JS) biarkan default (tidak di-cache di sini)
});
