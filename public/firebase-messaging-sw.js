/* Firebase messaging service worker. */
importScripts('/env.js');
importScripts('https://www.gstatic.com/firebasejs/11.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.10.0/firebase-messaging-compat.js');

const firebaseConfig = self.__env?.firebase ?? {};

function hasFirebaseConfig(config) {
  return Boolean(config?.apiKey && config?.projectId && config?.messagingSenderId && config?.appId);
}

if (hasFirebaseConfig(firebaseConfig)) {
  firebase.initializeApp(firebaseConfig);
}

const messaging = hasFirebaseConfig(firebaseConfig) ? firebase.messaging() : null;
const APP_NAME = 'Intern Hub';
const DEFAULT_ICON = '/favicon.ico';

function toText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function truncate(value, maxLength) {
  if (!value) return '';
  return value.length > maxLength ? `${value.slice(0, maxLength - 1)}...` : value;
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
  const targetUrl = toText(data.targetUrl) || '/';
  const tag = toText(data.tag) || toText(data.collapseKey) || notificationId;
  const silent = toText(data.silent).toLowerCase() === 'true';
  const badgeCount = Number(toText(data.badgeCount));
  const nativeNotification = toText(data.nativeNotification).toLowerCase() === 'true';

  return {
    title,
    body,
    image,
    targetUrl,
    tag: tag || undefined,
    silent,
    badgeCount: Number.isFinite(badgeCount) ? badgeCount : undefined,
    nativeNotification,
    options: {
      body,
      data: { ...data, targetUrl },
      icon: image || DEFAULT_ICON,
      badge: DEFAULT_ICON,
      image: image || undefined,
      tag: tag || undefined,
      renotify: true,
    },
  };
}

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

if (messaging) {
  messaging.onBackgroundMessage((payload) => {
    const content = buildNotificationContent(payload);
    if (content.silent) {
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
              targetUrl: content.targetUrl,
              silent: content.silent,
              tag: content.tag,
              badgeCount: content.badgeCount,
              nativeNotification: content.nativeNotification,
            },
          });
          return;
        }

        return self.registration.showNotification(content.title, content.options);
      });
  });
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event?.notification?.data?.targetUrl || '/';

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if ('focus' in client) {
            client.navigate(targetUrl);
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      }),
  );
});
