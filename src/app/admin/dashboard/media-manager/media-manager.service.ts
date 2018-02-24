import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../../auth/auth.service';
import { MessagesService } from '../../../core/messages/messages.service';

@Injectable()
export class MediaManagerService {

  constructor(public http: HttpClient, public authService: AuthService, public messagesService: MessagesService) { }

  getList(): Observable<any> {
    return this.http.get('api/admin/list').map(res => {
      return res;
    }).catch(err => this.errorHandler(err));
  }

  uploadFile(file: FormData): Observable<boolean> {
    return this.http.put('api/admin/file', file).map(res => {
      this.messagesService.showMessage(`File ${res['name']} is uploaded.`);
      return true;
    }).catch(err => this.errorHandler(err));
  }

  deleteFile(fileName: string): Observable<boolean> {
    return this.http.delete(`api/admin/file/${fileName}`).map(res => {
      this.messagesService.showMessage(`File ${fileName} is deleted.`);
      return true;
    }).catch(err => this.errorHandler(err));
  }

  errorHandler(error: HttpErrorResponse) {
    if (error.status === 401) {
      this.authService.navigateToLogin();
    }
    this.messagesService.showMessage(error.error.message, true);
    return Observable.of(null);
  }
}
