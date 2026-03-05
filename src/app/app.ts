import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { DynamicDsService } from 'dynamic-ds';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { PushTokenService } from './services/push-token.service';
import {
  StorageUtil,
  cancelTokenRefresh,
  notifyTokenRefreshed,
} from '@goat-bravos/shared-lib-client';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App implements OnInit, OnDestroy {
  private readonly inAppToastDurationMs = 10000;
  private readonly themeService = inject(DynamicDsService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly pushTokenService = inject(PushTokenService);

  private readonly onAuthTokenExpired = this.handleAuthTokenExpired.bind(this);
  private readonly onForceLogout = this.handleForceLogout.bind(this);
  private readonly onInAppPushNotification = this.handleInAppPushNotification.bind(this);
  private toastTimeoutId: ReturnType<typeof setTimeout> | null = null;

  inAppNotification: { title: string; body: string; image?: string; deeplink: string } | null = null;

  ngOnInit(): void {
    this.themeService.initializeTheme().subscribe();
    void this.pushTokenService.initializeDeviceToken();

    window.addEventListener('AUTH_TOKEN_EXPIRED', this.onAuthTokenExpired);
    window.addEventListener('FORCE_LOGOUT', this.onForceLogout);
    window.addEventListener('IN_APP_PUSH_NOTIFICATION', this.onInAppPushNotification as EventListener);
  }

  ngOnDestroy(): void {
    window.removeEventListener('AUTH_TOKEN_EXPIRED', this.onAuthTokenExpired);
    window.removeEventListener('FORCE_LOGOUT', this.onForceLogout);
    window.removeEventListener('IN_APP_PUSH_NOTIFICATION', this.onInAppPushNotification as EventListener);
    if (this.toastTimeoutId) {
      clearTimeout(this.toastTimeoutId);
    }
  }

  private handleAuthTokenExpired(): void {
    const refreshToken = StorageUtil.getRefreshToken();
    if (!refreshToken) {
      this.handleForceLogout();
      return;
    }

    this.authService.refreshAccessToken({ refreshToken }).subscribe({
      next: (response) => {
        const newAccessToken = response.data?.accessToken;
        const newRefreshToken = response.data?.refreshToken;

        if (newAccessToken) {
          StorageUtil.setAccessToken(newAccessToken);
          if (newRefreshToken) StorageUtil.setRefreshToken(newRefreshToken);
          notifyTokenRefreshed(newAccessToken);
        } else {
          this.handleForceLogout();
        }
      },
      error: () => {
        this.handleForceLogout();
      },
    });
  }

  private handleForceLogout(): void {
    cancelTokenRefresh();
    StorageUtil.clearAll();
    this.router.navigate(['/auth']);
  }

  handleToastClick(): void {
    if (!this.inAppNotification) {
      return;
    }

    const deeplink = this.inAppNotification.deeplink;
    if (deeplink.startsWith('http://') || deeplink.startsWith('https://')) {
      window.location.href = deeplink;
    } else {
      void this.router.navigateByUrl(deeplink);
    }
    this.closeToast();
  }

  closeToast(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.inAppNotification = null;
    if (this.toastTimeoutId) {
      clearTimeout(this.toastTimeoutId);
      this.toastTimeoutId = null;
    }
  }

  private handleInAppPushNotification(event: Event): void {
    const customEvent = event as CustomEvent<{ title?: string; body?: string; image?: string; deeplink?: string }>;
    const detail = customEvent.detail ?? {};

    this.inAppNotification = {
      title: detail.title?.trim() || 'Intern Hub',
      body: detail.body?.trim() || '',
      image: detail.image?.trim() || undefined,
      deeplink: detail.deeplink?.trim() || '/',
    };

    if (this.toastTimeoutId) {
      clearTimeout(this.toastTimeoutId);
    }

    this.toastTimeoutId = setTimeout(() => {
      this.inAppNotification = null;
      this.toastTimeoutId = null;
    }, this.inAppToastDurationMs);
  }
}
