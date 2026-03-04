/* Firebase messaging service worker.
 * Foreground token creation uses this SW registration.
 * Add onBackgroundMessage handling here when needed.
 */
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

