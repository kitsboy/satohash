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
  // Don't cache API responses — they change (proof status, confirmations)
  if (event.request.url.includes('/api/')) {
    event.respondWith(fetch(event.request).catch(
      () =>
        new Response(JSON.stringify({ error: 'offline', offline: true }), {
          headers: { 'Content-Type': 'application/json' }
        })
    ))
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

// Handle push notifications
self.addEventListener('push', (event) => {
  let data = { title: 'Satohash', body: 'Your proof has been updated.' }
  try {
    if (event.data) data = event.data.json()
  } catch {}
  event.waitUntil(
    self.registration.showNotification(data.title || 'Satohash', {
      body: data.body || 'Proof update',
      icon: '/logo.png',
      badge: '/logo.png',
      tag: data.tag || 'satohash-notification',
      data: { url: data.url || '/' }
    })
  )
})

// Handle notification click — open the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url || '/'
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) return client.focus()
      }
      if (clients.openWindow) return clients.openWindow(url)
    })
  )
})

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
