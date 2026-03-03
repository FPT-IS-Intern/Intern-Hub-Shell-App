import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseApi } from '@goat-bravos/shared-lib-client';
import { getBaseUrl } from '../core/config/app-config';
import { InAppNotificationResponse } from '../models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private readonly httpClient: HttpClient) {}

  getMyNotifications(
    page: number = 0,
    size: number = 10,
    isRead?: boolean,
  ): Observable<ResponseApi<InAppNotificationResponse[]>> {
    const isReadParam = isRead === undefined ? '' : `&isRead=${isRead}`;
    return this.httpClient.get<ResponseApi<InAppNotificationResponse[]>>(
      `${getBaseUrl()}/noti/me?page=${page}&size=${size}${isReadParam}`,
    );
  }

  getUnreadCount(): Observable<ResponseApi<number>> {
    return this.httpClient.get<ResponseApi<number>>(`${getBaseUrl()}/noti/unread-count`);
  }

  markOneAsRead(id: string): Observable<ResponseApi<boolean>> {
    return this.httpClient.put<ResponseApi<boolean>>(`${getBaseUrl()}/noti/${id}/read`, {});
  }

  markAllAsRead(): Observable<ResponseApi<boolean>> {
    return this.httpClient.put<ResponseApi<boolean>>(`${getBaseUrl()}/noti/read-all`, {});
  }
}
