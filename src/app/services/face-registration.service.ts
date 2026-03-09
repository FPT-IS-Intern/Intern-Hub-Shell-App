import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getBaseUrl } from '../core/config/app-config';

@Injectable({
  providedIn: 'root',
})
export class FaceRegistrationService {
  constructor(private readonly http: HttpClient) {}

  registerFace(userName: string, imageFiles: File[]): Observable<any> {
    const formData = new FormData();
    formData.append('userName', userName);

    imageFiles.forEach((file) => {
      formData.append('files', file);
    });

    return this.http.post(`${getBaseUrl()}/hrm/users/me/face-registry`, formData);
  }
}
