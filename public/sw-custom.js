/**
 * Custom Service Worker for Gaia Plant Care
 * Handles notification clicks and background sync
 */

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Open the app when notification is clicked
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If app is already open, focus it
      for (const client of clientList) {
        if (client.url === self.registration.scope && 'focus' in client) {
          return client.focus();
        }
      }

      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Handle push events (for future web push API integration)
self.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }

  const data = event.data.json();
  const options = {
    body: data.body || 'Time to check on your plants!',
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    tag: 'plant-reminder',
    data: data.data || {}
  };

  event.waitUntil(
    self.registration.showNotification(data.title || '🌱 Gaia Plant Care', options)
  );
});
