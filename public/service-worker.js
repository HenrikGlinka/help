self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  self.registration.showNotification(data.title || 'Notification', {
    body: data.body || '',
    icon: '/icon512.png',
  });
});