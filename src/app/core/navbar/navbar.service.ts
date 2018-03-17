import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { MessagesService } from '../messages/messages.service';
import { BlogTitleService } from '../blog-title.service';

class MenuItem {
  tag: string;
  subtags: string[];
}

@Injectable()
export class NavbarService {

  public menuItems: MenuItem[] = [];

  constructor(private http: HttpClient, public messagesService: MessagesService) { }

  getMenu() {
    this.http.get('api/blog/menu').catch(err => this.errorHandler(err)).subscribe((res) => {
      if (res) {
        this.menuItems = res.menuItems;
      }
    });
  }

  errorHandler(error: HttpErrorResponse) {
    this.messagesService.showMessage(error.error.message, true);
    return Observable.of(null);
  }
}
