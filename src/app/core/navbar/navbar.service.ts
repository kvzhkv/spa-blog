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

class Info {
  blogTitle?: string;
  facebookLink?: string;
  instagramLink?: string;
  vkLink?: string;
  youtubeLink?: string;
}

@Injectable()
export class NavbarService {

  public menuItems: MenuItem[] = [];
  public info: Info = null;

  constructor(private http: HttpClient, public messagesService: MessagesService, public blogTitleService: BlogTitleService) { }

  getdata() {
    return this.http.get('api/blog/info').catch(err => this.errorHandler(err));
  }

  getInfo() {
    this.http.get('api/blog/info').catch(err => this.errorHandler(err)).subscribe((res) => {
      if (res) {
        this.menuItems = res.menuItems;
        this.info = res.info;
        if (this.info.blogTitle) {
          this.blogTitleService.pushBlogName(this.info.blogTitle);
        }
      }
    });
  }

  errorHandler(error: HttpErrorResponse) {
    this.messagesService.showMessage(error.error.message, true);
    return Observable.of(null);
  }
}
