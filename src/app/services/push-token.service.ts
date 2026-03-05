import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, Messaging, MessagePayload, onMessage } from 'firebase/messaging';
import { environment } from '../../environments/environment';

type FirebaseConfig = {
  apiKey: string;
  authDomain?: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
};

type PushContent = {
  title: string;
  body: string;
  image?: string;
  deeplink: string;
  data: Record<string, string>;
  silent: boolean;
  dedupeKey: string;
  tag?: string;
  badgeCount?: number;
  nativeNotification: boolean;
  hasNativeDisplayPayload: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class PushTokenService {
  private readonly appName = 'Intern Hub';
  private readonly defaultIcon = '/favicon.ico';
  private messaging: Messaging | null = null;
  private initialized = false;
  private swMessageBound = false;
  private readonly dedupeTtlMs = 5 * 60 * 1000;
  private readonly seenDedupeMap = new Map<string, number>();

  async initializeDeviceToken(): Promise<void> {
    if (this.initialized) {
      return;
    }
    this.initialized = true;

    if (typeof window === 'undefined' || typeof Notification === 'undefined') {
      return;
    }

    if (!('serviceWorker' in navigator)) {
      return;
    }

    const config = this.getFirebaseConfig();
    const vapidKey = this.getVapidKey();

    if (!config || !vapidKey) {
      return;
    }

    const permission = await this.ensureNotificationPermission();
    localStorage.setItem('notificationPermission', permission);
    if (permission !== 'granted') {
      localStorage.removeItem('deviceToken');
      return;
    }

    try {
      const app = initializeApp(config);
      this.messaging = getMessaging(app);
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      this.bindServiceWorkerMessageListener();
      const token = await getToken(this.messaging, {
        vapidKey,
        serviceWorkerRegistration: registration,
      });

      if (token) {
        localStorage.setItem('deviceToken', token);
      } else {
        localStorage.removeItem('deviceToken');
      }

      onMessage(this.messaging, (payload: MessagePayload) => {
        const content = this.extractPushContent(payload);
        if (content.silent || this.isDuplicate(content.dedupeKey)) {
          return;
        }

        this.updateAppBadge(content.badgeCount);

        if (document.visibilityState === 'visible') {
          this.emitInAppNotification(content);
          return;
        }

        if (content.nativeNotification && content.hasNativeDisplayPayload) {
          return;
        }

        this.showBrowserNotification(content);
      });
    } catch {
      // Ignore push token init errors to avoid affecting app startup flow.
    }
  }

  private showBrowserNotification(content: PushContent): void {
    if (typeof window === 'undefined' || Notification.permission !== 'granted') {
      return;
    }

    const options: NotificationOptions & { image?: string } = {
      body: content.body,
      data: { ...content.data, deeplink: content.deeplink },
      icon: content.image || this.defaultIcon,
      badge: this.defaultIcon,
      tag: content.tag,
    };

    if (content.image) {
      options.image = content.image;
      options.icon = content.image;
    }

    const notification = new Notification(content.title, options);
    notification.onclick = () => {
      if (content.deeplink) {
        window.open(content.deeplink, '_self');
      }
      notification.close();
    };
  }

  private emitInAppNotification(content: PushContent): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.dispatchEvent(
      new CustomEvent('IN_APP_PUSH_NOTIFICATION', {
        detail: {
          title: content.title,
          body: content.body,
          image: content.image,
          deeplink: content.deeplink,
        },
      }),
    );
  }

  private bindServiceWorkerMessageListener(): void {
    if (this.swMessageBound || typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    navigator.serviceWorker.addEventListener('message', (event: MessageEvent) => {
      const message = event.data as
        | {
            type?: string;
            payload?: {
              title?: string;
              body?: string;
              image?: string;
              deeplink?: string;
              silent?: string | boolean;
              dedupeKey?: string;
              tag?: string;
              badgeCount?: string | number;
              nativeNotification?: string | boolean;
            };
          }
        | undefined;

      if (message?.type !== 'IN_APP_PUSH_NOTIFICATION' || !message.payload) {
        return;
      }

      const content: PushContent = {
        title: this.toText(message.payload.title) || this.appName,
        body: this.toText(message.payload.body),
        image: this.toText(message.payload.image) || undefined,
        deeplink: this.toText(message.payload.deeplink) || '/',
        data: {},
        silent: this.parseBooleanInput(message.payload.silent),
        dedupeKey: this.toText(message.payload.dedupeKey),
        tag: this.toText(message.payload.tag) || undefined,
        badgeCount: this.parseNumberInput(message.payload.badgeCount),
        nativeNotification: this.parseBooleanInput(message.payload.nativeNotification),
        hasNativeDisplayPayload: false,
      };
      if (content.silent) {
        return;
      }
      this.updateAppBadge(content.badgeCount);
      const dedupeKey = content.dedupeKey || `sw:${content.title}:${content.body}`;
      if (this.isDuplicate(dedupeKey)) {
        return;
      }

      this.emitInAppNotification(content);
    });

    this.swMessageBound = true;
  }

  private extractPushContent(payload: MessagePayload): PushContent {
    const data = payload.data ?? {};
    const title = this.truncate(
      this.toText(payload.notification?.title) ||
        this.toText(data['title']) ||
        this.toText(data['subject']) ||
        this.appName,
      60,
    );
    const body = this.truncate(
      this.toText(payload.notification?.body) ||
        this.toText(data['body']) ||
        this.toText(data['content']),
      140,
    );
    const image = this.toText(payload.notification?.image) || this.toText(data['imageUrl']);
    const deeplink =
      this.toText(data['targetUrl']) ||
      this.toText((payload as MessagePayload & { fcmOptions?: { link?: string } }).fcmOptions?.link) ||
      '/';
    const dedupeKey =
      this.toText(data['dedupeKey']) ||
      this.toText(data['notificationId']) ||
      this.toText(data['id']) ||
      `${title}:${body}`;
    const tag = this.toText(data['tag']) || this.toText(data['collapseKey']) || undefined;
    const silent = this.parseBoolean(data['silent']);
    const badgeCount = this.parseNumber(data['badgeCount']);
    const nativeNotification = this.parseBoolean(data['nativeNotification']);
    const hasNativeDisplayPayload = Boolean(
      this.toText(payload.notification?.title) || this.toText(payload.notification?.body),
    );

    return {
      title,
      body,
      image: image || undefined,
      deeplink,
      data,
      silent,
      dedupeKey,
      tag,
      badgeCount,
      nativeNotification,
      hasNativeDisplayPayload,
    };
  }

  private toText(value: string | undefined): string {
    return (value ?? '').trim();
  }

  private truncate(value: string, maxLength: number): string {
    if (!value) {
      return '';
    }

    return value.length > maxLength ? `${value.slice(0, maxLength - 1)}...` : value;
  }

  private parseBoolean(value: string | undefined): boolean {
    return (value ?? '').trim().toLowerCase() === 'true';
  }

  private parseBooleanInput(value: string | boolean | undefined): boolean {
    if (typeof value === 'boolean') {
      return value;
    }

    return this.parseBoolean(value);
  }

  private parseNumber(value: string | undefined): number | undefined {
    const normalized = (value ?? '').trim();
    if (!normalized) {
      return undefined;
    }
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  private parseNumberInput(value: string | number | undefined): number | undefined {
    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : undefined;
    }

    return this.parseNumber(value);
  }

  private updateAppBadge(badgeCount: number | undefined): void {
    if (typeof navigator === 'undefined') {
      return;
    }

    const navWithBadge = navigator as Navigator & {
      setAppBadge?: (contents?: number) => Promise<void>;
      clearAppBadge?: () => Promise<void>;
    };

    if (!Number.isFinite(badgeCount) || badgeCount === undefined || badgeCount < 0) {
      return;
    }

    if (badgeCount === 0 && typeof navWithBadge.clearAppBadge === 'function') {
      void navWithBadge.clearAppBadge();
      return;
    }

    if (typeof navWithBadge.setAppBadge === 'function') {
      void navWithBadge.setAppBadge(Math.trunc(badgeCount));
    }
  }

  private isDuplicate(dedupeKey: string | undefined): boolean {
    const key = (dedupeKey ?? '').trim();
    if (!key) {
      return false;
    }

    const now = Date.now();
    for (const [mapKey, expiresAt] of this.seenDedupeMap.entries()) {
      if (expiresAt <= now) {
        this.seenDedupeMap.delete(mapKey);
      }
    }

    const expiresAt = this.seenDedupeMap.get(key);
    if (expiresAt && expiresAt > now) {
      return true;
    }

    this.seenDedupeMap.set(key, now + this.dedupeTtlMs);
    return false;
  }

  private async ensureNotificationPermission(): Promise<NotificationPermission> {
    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      return 'denied';
    }

    return Notification.requestPermission();
  }

  private getFirebaseConfig(): FirebaseConfig | null {
    const envConfig = ((window as any).__env?.firebase ?? environment.firebase) as FirebaseConfig | undefined;

    if (!envConfig?.apiKey || !envConfig?.projectId || !envConfig?.messagingSenderId || !envConfig?.appId) {
      return null;
    }

    return envConfig;
  }

  private getVapidKey(): string {
    const key = ((window as any).__env?.firebaseVapidKey ?? environment.firebaseVapidKey ?? '') as string;
    return key.trim();
  }
}
