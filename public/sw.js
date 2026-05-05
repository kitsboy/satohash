// ─── App Shell Cache Strategy ──────────────────────────────────────────────

const CACHE_NAME = 'satohash-v1'

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(['/']))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  // Network-first for API calls; return a JSON offline sentinel on failure
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request).catch(
        () =>
          new Response(JSON.stringify({ error: 'offline', offline: true }), {
            headers: { 'Content-Type': 'application/json' }
          })
      )
    )
    return
  }

  // Cache-first for everything else (app shell, assets)
  event.respondWith(
    caches.match(event.request).then(
      (cached) =>
        cached ||
        fetch(event.request).then((response) => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
          }
          return response
        })
    )
  )
})

// ─── Push Notifications ────────────────────────────────────────────────────

self.addEventListener('push', (event) => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: '/favicon.ico',
      badge: '/badge.png',
      vibrate: [100, 50, 100],
      data: { link: '/' },
    };
    event.waitUntil(
      self.registration.showNotification('Satohash Confirmation', options)
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.link || '/')
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
