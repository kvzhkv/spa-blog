import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { MessagesService } from '../messages/messages.service';

@Injectable()
export class NavbarService {
  constructor(private http: HttpClient, public messagesService: MessagesService) { }

  getInfo() {
    return this.http.get('api/blog/info').catch(err => this.errorHandler(err));
  }

  // getTags(): Observable<string[]> {
  //   return this.http.get('api/blog/tags').map(res => {
  //     const body = res['tags'];
  //     return body;
  //   }).catch(err => this.errorHandler(err));
  // }

  errorHandler(error: HttpErrorResponse) {
    this.messagesService.showMessage(error.error.message, true);
    return Observable.of(null);
  }
}
