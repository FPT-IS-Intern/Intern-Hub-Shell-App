import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseApi } from '@goat-bravos/shared-lib-client';
import { getBaseUrl } from '../core/config/app-config';

export interface CurrentUser {
  fullName: string;
  avatarUrl?: string;
  email: string;
  role: string;
  isFaceRegistry?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private readonly httpClient: HttpClient) {}

  getMe(): Observable<ResponseApi<CurrentUser>> {
    return this.httpClient.get<ResponseApi<CurrentUser>>(`${getBaseUrl()}/hrm/users/me`);
  }
}
