import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, Messaging } from 'firebase/messaging';
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
  private messaging: Messaging | null = null;
  private initialized = false;

  async initializeDeviceToken(): Promise<void> {
    if (this.initialized) {
      console.info('[FCM] Skip init: already initialized');
      return;
    }
    this.initialized = true;

    if (typeof window === 'undefined' || typeof Notification === 'undefined') {
      console.warn('[FCM] Notification API is not available');
      return;
    }

    if (!('serviceWorker' in navigator)) {
      console.warn('[FCM] Service Worker is not supported');
      return;
    }

    const config = this.getFirebaseConfig();
    const vapidKey = this.getVapidKey();

    if (!config || !vapidKey) {
      console.warn('[FCM] Missing firebase config or vapid key');
      return;
    }

    const permission = await this.ensureNotificationPermission();
    console.info('[FCM] Notification permission:', permission);
    if (permission !== 'granted') {
      return;
    }

    try {
      const app = initializeApp(config);
      this.messaging = getMessaging(app);
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.info('[FCM] Service worker registered:', registration.scope);

      const token = await getToken(this.messaging, {
        vapidKey,
        serviceWorkerRegistration: registration,
      });

      if (token) {
        localStorage.setItem('deviceToken', token);
        console.info('[FCM] Device token saved', `${token.slice(0, 16)}...`);
      } else {
        console.warn('[FCM] getToken returned empty token');
      }
    } catch (error) {
      console.error('Failed to initialize FCM device token:', error);
    }
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
