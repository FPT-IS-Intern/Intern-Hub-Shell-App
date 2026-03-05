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
const DEDUPE_TTL_MS = 5 * 60 * 1000;
const seenDedupeMap = new Map();

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
  const deeplink =
    toText(data.clickAction) ||
    toText(payload?.fcmOptions?.link) ||
    toText(data.deeplink) ||
    toText(data.url) ||
    '/';
  const dedupeKey = toText(data.dedupeKey) || notificationId || `${title}:${body}`;
  const tag = toText(data.tag) || toText(data.collapseKey) || notificationId;
  const silent = toText(data.silent).toLowerCase() === 'true';
  const badgeCount = Number(toText(data.badgeCount));
  const nativeNotification = toText(data.nativeNotification).toLowerCase() === 'true';
  const ttlSeconds = Number(toText(data.ttlSeconds));
  const sound = toText(data.sound);

  return {
    title,
    body,
    image,
    deeplink,
    dedupeKey,
    tag: tag || undefined,
    silent,
    badgeCount: Number.isFinite(badgeCount) ? badgeCount : undefined,
    nativeNotification,
    ttlSeconds: Number.isFinite(ttlSeconds) ? ttlSeconds : undefined,
    sound: sound || undefined,
    options: {
      body,
      data: { ...data, deeplink },
      icon: image || DEFAULT_ICON,
      badge: DEFAULT_ICON,
      image: image || undefined,
      tag: tag || undefined,
      renotify: false,
    },
  };
}

function isDuplicate(dedupeKey) {
  if (!dedupeKey) return false;

  const now = Date.now();
  for (const [key, expiresAt] of seenDedupeMap.entries()) {
    if (expiresAt <= now) {
      seenDedupeMap.delete(key);
    }
  }

  const expiresAt = seenDedupeMap.get(dedupeKey);
  if (expiresAt && expiresAt > now) {
    return true;
  }

  seenDedupeMap.set(dedupeKey, now + DEDUPE_TTL_MS);
  return false;
}

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

messaging.onBackgroundMessage((payload) => {
  const content = buildNotificationContent(payload);
  if (content.silent || isDuplicate(content.dedupeKey)) {
    return;
  }

  return clients
    .matchAll({ type: 'window', includeUncontrolled: true })
    .then((windowClients) => {
      const visibleClient = windowClients.find((client) => client.visibilityState === 'visible');
      if (visibleClient) {
        visibleClient.postMessage({
          type: 'IN_APP_PUSH_NOTIFICATION',
          payload: {
            title: content.title,
            body: content.body,
            image: content.image,
            deeplink: content.deeplink,
            silent: content.silent,
            dedupeKey: content.dedupeKey,
            tag: content.tag,
            badgeCount: content.badgeCount,
            nativeNotification: content.nativeNotification,
            ttlSeconds: content.ttlSeconds,
            sound: content.sound,
          },
        });
        return;
      }

      if (content.nativeNotification) {
        return;
      }

      return self.registration.showNotification(content.title, content.options);
    });
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
