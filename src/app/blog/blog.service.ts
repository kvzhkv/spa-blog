import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { MessagesService } from '../core/messages/messages.service';

@Injectable()
export class BlogService {

  // public currentPage = 1;
  // public totalPages = 1;
  public postsOnPage = 9; // FIXME: move to settings???
  // public currentTag: string = null;

  constructor(public http: HttpClient, public messagesService: MessagesService) { }

  getPosts(page: number, tag?: string): Observable<any> {
    const skipNumber: number = this.postsOnPage * (page - 1);
    // if (tag !== this.currentTag) {
    //   this.currentPage = 1;
    // }
    // this.currentTag = tag;
    // console.log('currentTag:', this.currentTag);
    if (tag) {
      const encodedTag = encodeURIComponent(tag);
      return this.http.get(`api/blog/postsbytag/${encodedTag}?limit=${this.postsOnPage}&skip=${skipNumber}`).map(res => {
        // this.currentPage = page; // FIXME: другой способ фиксации номера страницы??
        // this.totalPages = body.total_rows / this.postsOnPage;
        // this.totalPagesCount(res['total_rows']);
        return res;
      }).catch(err => this.errorHandler(err));
    } else {
      return this.http.get(`api/blog/posts?limit=${this.postsOnPage}&skip=${skipNumber}`).map(res => {
        // this.currentPage = page; // FIXME: другой способ фиксации номера страницы??
        // this.totalPages = body.total_rows / this.postsOnPage;
        // this.totalPagesCount(res['total_rows']);
        return res;
      }).catch(err => this.errorHandler(err));
    }
  }

  // totalPagesCount(totalRows: number): void {
  //   this.totalPages = Math.ceil(totalRows / this.postsOnPage);
  // }

  getPost(id: string): Observable<any> {
    return this.http.get(`api/blog/posts/${id}`).map(res => {
      return res;
    }).catch(err => this.errorHandler(err));
  }

  getFavorites(): Observable<any> {
    return this.http.get('api/blog/favorites').map(res => {
      return res;
    }).catch(err => this.errorHandler(err));
  }

  errorHandler(error: HttpErrorResponse) {
    this.messagesService.showMessage(error.error.message, true);
    return Observable.of(null);
  }
}
