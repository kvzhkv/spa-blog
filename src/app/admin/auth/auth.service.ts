import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import 'rxjs/add/observable/of';

import { MessagesService } from '../../core/messages/messages.service';

@Injectable()
export class AuthService {

  public isAdminLoggedIn: boolean;

  constructor(public http: HttpClient, public messagesService: MessagesService, public router: Router) { }

  checkSession(): Observable<boolean> {
    return this.http.get('api/admin/session')
      .map(res => {
        if (res['ok']) {
          return this.isAdminLoggedIn = true;
        } else {
          return false;
        }
      })
      .catch(err => this.errorHandler(err));
  }

  login(username: string, password: string): Observable<boolean> {
    username = username.toLowerCase();
    return this.http
      .post('api/admin/login', { username, password })
      .map(res => {
        // console.log(res);
        if (res['ok']) {
          this.messagesService.showMessage(res['message']);
          return this.isAdminLoggedIn = true;
        } else {
          return false;
        }
      })
      .catch(err => this.errorHandler(err));
  }

  logout(): Observable<boolean> {
    return this.http
      .delete('api/admin/logout')
      .map(res => {
        if (res['ok']) {
          this.messagesService.showMessage(res['message']);
          this.isAdminLoggedIn = false;
          return true;
        } else {
          return false;
        }
      })
      .catch(err => this.errorHandler(err));
  }

  navigateToLogin() {
    this.isAdminLoggedIn = false;
    this.router.navigate(['/administrator/login']);
  }

  errorHandler(error: HttpErrorResponse): Observable<boolean> {
    if (error.status === 401) {
      this.navigateToLogin();
    }
    this.messagesService.showMessage(error.error.message, true);
    return Observable.of(false);
  }
}
