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
const APP_NAME = 'Intern Hub';
const DEFAULT_ICON = '/favicon.ico';

function toText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function truncate(value, maxLength) {
  if (!value) return '';
  return value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value;
}

function buildNotificationContent(payload) {
  const data = payload?.data || {};
  const title = truncate(
    toText(payload?.notification?.title) || toText(data.title) || toText(data.subject) || APP_NAME,
    60,
  );
  const body = truncate(
    toText(payload?.notification?.body) || toText(data.body) || toText(data.content) || '',
    140,
  );
  const image = toText(payload?.notification?.image) || toText(data.imageUrl);
  const notificationId = toText(data.id) || toText(data.notificationId);
  const deeplink = toText(data.deeplink) || toText(data.url) || '/';

  return {
    title,
    options: {
      body,
      data: { ...data, deeplink },
      icon: image || DEFAULT_ICON,
      badge: DEFAULT_ICON,
      image: image || undefined,
      tag: notificationId || undefined,
      renotify: false,
    },
  };
}

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

messaging.onBackgroundMessage((payload) => {
  const { title, options } = buildNotificationContent(payload);
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
