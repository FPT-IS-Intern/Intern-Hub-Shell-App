import { HttpInterceptorFn } from '@angular/common/http';
import { StorageUtil } from '@goat-bravos/shared-lib-client';

function getDeviceToken(): string | null {
  const keys = ['deviceToken', 'fcmToken', 'FCM_TOKEN'];

  for (const key of keys) {
    const value = localStorage.getItem(key);
    if (value?.trim()) {
      return value.trim();
    }
  }

  return null;
}

function getOrCreateDeviceId(): string {
  let deviceId = StorageUtil.getDeviceId();
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    StorageUtil.setDeviceId(deviceId);
  }
  return deviceId;
}

export const loginDeviceTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const isAuthSessionRequest = req.url.includes('/auth/login') || req.url.includes('/auth/logout');
  if (!isAuthSessionRequest) {
    return next(req);
  }

  let headers = req.headers;

  if (!headers.has('X-Device-ID')) {
    headers = headers.set('X-Device-ID', getOrCreateDeviceId());
  }

  const deviceToken = getDeviceToken();
  if (deviceToken && !headers.has('X-Device-Token')) {
    headers = headers.set('X-Device-Token', deviceToken);
  }

  return next(req.clone({ headers }));
};

