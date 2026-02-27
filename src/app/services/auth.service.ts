import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LogoutRequest } from '../models/auth.model';
import { ResponseApi } from '@goat-bravos/shared-lib-client';
import { StorageUtil } from '../utils/storage.util';
import { getBaseUrl } from '../core/config/app-config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly httpClient: HttpClient) {}

  logout(data: LogoutRequest): Observable<ResponseApi<void>> {
    const token = StorageUtil.getAccessToken();
    const headers = new HttpHeaders({
      'X-Device-ID': this.getDeviceId(),
      Authorization: `Bearer ${token}`,
    });

    return this.httpClient
      .post<ResponseApi<void>>(`${getBaseUrl()}/auth/logout`, data, {
        headers,
      })
      .pipe(
        tap((res) => {
          if (res.status === null || res.status.code === '200') {
            StorageUtil.clearAuthData();
          }
        }),
      );
  }

  private getDeviceId(): string {
    let deviceId = StorageUtil.getDeviceId();
    if (!deviceId) {
      deviceId = crypto.randomUUID();
      StorageUtil.setDeviceId(deviceId);
    }
    return deviceId;
  }
}
