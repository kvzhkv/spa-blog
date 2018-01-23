import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { MessagesService } from '../../../core/messages/messages.service';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class MenuManagerService {

  constructor(public http: HttpClient, public messagesService: MessagesService, public authService: AuthService) { }

  getMenu(): Observable<any> {
    return this.http.get('api/admin/menu').map(res => {
      return res;
    }).catch(err => this.errorHandler(err));
  }

  saveMenu(menu: any): Observable<boolean> {
    return this.http.put('api/admin/menu', menu).map(res => {
      this.messagesService.showMessage(res['message']);
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
