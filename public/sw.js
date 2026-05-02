// Service Worker for push notifications
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
