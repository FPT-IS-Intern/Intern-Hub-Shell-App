/* Firebase messaging service worker. */
importScripts('https://www.gstatic.com/firebasejs/11.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.10.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyBJI3pgbxmH-wXF6Qx5FVDxeJcUak_fjqs',
  authDomain: 'internhub-v2.firebaseapp.com',
  projectId: 'internhub-v2',
  storageBucket: 'internhub-v2.firebasestorage.app',
  messagingSenderId: '1009479495930',
  appId: '1:1009479495930:web:9aafb7f4c21ac87f6f1943',
  measurementId: 'G-6PF6H5DCGJ',
});

const messaging = firebase.messaging();

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

messaging.onBackgroundMessage((payload) => {
  const title = payload?.notification?.title || payload?.data?.title || 'Intern Hub';
  const body = payload?.notification?.body || payload?.data?.body || '';
  const image = payload?.notification?.image || payload?.data?.imageUrl;

  const options = {
    body,
    data: payload?.data || {},
    icon: image || '/favicon.ico',
    image: image || undefined,
  };

  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const deeplink = event?.notification?.data?.deeplink || '/';

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if ('focus' in client) {
            client.navigate(deeplink);
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(deeplink);
        }
      }),
  );
});
