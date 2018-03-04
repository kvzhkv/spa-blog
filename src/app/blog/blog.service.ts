import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { MessagesService } from '../core/messages/messages.service';

@Injectable()
export class BlogService {

  public posts: any[] = []; // FIXME: post.model

  public loadedPostsNumber = 0;
  public totalPostsNumber = 0;

  public postsOnPage = 9;

  public currentTag: string = null;

  public loading = false;

  constructor(public http: HttpClient, public messagesService: MessagesService) { }

  emptyPosts() {
    this.posts = [];
    this.loadedPostsNumber = 0;
    this.totalPostsNumber = 0;
  }

  getPosts() {
    this.loading = true;
    if (this.currentTag) {
      const encodedTag = encodeURIComponent(this.currentTag);
      this.http.get(`api/blog/postsbytag/${encodedTag}?limit=${this.postsOnPage}&skip=${this.loadedPostsNumber}`)
        .catch(err => this.errorHandler(err))
        .subscribe(res => {
          if (res) {
            this.populatePosts(res['rows'], res['total_rows']);
          }
        }, err => { }, () => {
          this.loading = false;
        });
    } else {
      this.http.get(`api/blog/posts?limit=${this.postsOnPage}&skip=${this.loadedPostsNumber}`)
        .catch(err => this.errorHandler(err))
        .subscribe(res => {
          if (res) {
            this.populatePosts(res['rows'], res['total_rows']);
          }
        }, err => { }, () => {
          this.loading = false;
        });
    }
  }

  populatePosts(posts: any[], postsNumber: number) { // FIXME: posts.model
    this.posts = this.posts.concat(posts);
    this.totalPostsNumber = postsNumber;
    this.loadedPostsNumber = this.posts.length;
  }

  getPost(id: string): Observable<any> {
    return this.http.get(`api/blog/posts/${id}`).map(res => {
      return res;
    }).catch(err => this.errorHandler(err));
  }

  errorHandler(error: HttpErrorResponse) {
    this.messagesService.showMessage(error.error.message, true);
    return Observable.of(null);
  }
}
