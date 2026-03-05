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
        if (document.visibilityState === 'visible') {
          this.emitInAppNotification(content);
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
      data: content.data,
      icon: content.image || this.defaultIcon,
      badge: this.defaultIcon,
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
            payload?: { title?: string; body?: string; image?: string; deeplink?: string };
          }
        | undefined;

      if (message?.type !== 'IN_APP_PUSH_NOTIFICATION' || !message.payload) {
        return;
      }

      this.emitInAppNotification({
        title: this.toText(message.payload.title) || this.appName,
        body: this.toText(message.payload.body),
        image: this.toText(message.payload.image) || undefined,
        deeplink: this.toText(message.payload.deeplink) || '/',
        data: {},
      });
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
    const deeplink = this.toText(data['deeplink']) || this.toText(data['url']) || '/';

    return {
      title,
      body,
      image: image || undefined,
      deeplink,
      data,
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
