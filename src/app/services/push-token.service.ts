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

@Injectable({
  providedIn: 'root',
})
export class PushTokenService {
  private readonly appName = 'Intern Hub';
  private readonly defaultIcon = '/favicon.ico';
  private messaging: Messaging | null = null;
  private initialized = false;

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
    if (permission !== 'granted') {
      return;
    }

    try {
      const app = initializeApp(config);
      this.messaging = getMessaging(app);
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      const token = await getToken(this.messaging, {
        vapidKey,
        serviceWorkerRegistration: registration,
      });

      if (token) {
        localStorage.setItem('deviceToken', token);
      }

      // Foreground handling: browser does not auto-popup when tab is active.
      onMessage(this.messaging, (payload: MessagePayload) => {
        this.showBrowserNotification(payload);
      });
    } catch {
      // Ignore push token init errors to avoid affecting app startup flow.
    }
  }

  private showBrowserNotification(payload: MessagePayload): void {
    if (typeof window === 'undefined' || Notification.permission !== 'granted') {
      return;
    }

    const title = this.truncate(
      this.toText(payload.notification?.title) ||
        this.toText(payload.data?.['title']) ||
        this.toText(payload.data?.['subject']) ||
        this.appName,
      60,
    );
    const body = this.truncate(
      this.toText(payload.notification?.body) ||
        this.toText(payload.data?.['body']) ||
        this.toText(payload.data?.['content']),
      140,
    );
    const image = this.toText(payload.notification?.image) || this.toText(payload.data?.['imageUrl']);

    const options: NotificationOptions & { image?: string } = {
      body,
      data: payload.data ?? {},
      icon: image || this.defaultIcon,
      badge: this.defaultIcon,
    };

    if (image) {
      options.image = image;
      options.icon = image;
    }

    new Notification(title, options);
  }

  private toText(value: string | undefined): string {
    return (value ?? '').trim();
  }

  private truncate(value: string, maxLength: number): string {
    if (!value) {
      return '';
    }

    return value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value;
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
