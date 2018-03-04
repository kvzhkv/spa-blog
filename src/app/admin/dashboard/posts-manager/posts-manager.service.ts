import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { MessagesService } from '../../../core/messages/messages.service';
import { Message } from '../../../core/messages/message.model';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class PostsManagerService {

  public posts: any[] = []; // FIXME: сделать post.model;

  public loadedPostsNumber = 0;
  public totalPostsNumber = 0;

  public postsOnPage = 9;

  public loading = false;

  constructor(private http: HttpClient, public messagesService: MessagesService, public authService: AuthService) { }

  emptyPosts(): void {
    this.posts = [];
    this.loadedPostsNumber = 0;
    this.totalPostsNumber = 0;
  }

  getPosts(): void {
    this.loading = true;
    this.http.get(`api/admin/posts?limit=${this.postsOnPage}&skip=${this.loadedPostsNumber}`)
      .catch(err => this.errorHandler(err))
      .subscribe(res => {
        if (res) {
          this.posts = this.posts.concat(res['rows']);
          this.totalPostsNumber = res['total_rows'];
          this.loadedPostsNumber = this.posts.length;
        }
      }, err => { }, () => {
        this.loading = false;
      });
  }

  deletePost(id: string): void {
    this.http.delete(`api/admin/posts/${id}`).map(res => {
      return true;
    }).catch(err => this.errorHandler(err)).subscribe(res => {
      if (res) {
        this.messagesService.showMessage('Post deleted');
        this.posts = [];
        this.loadedPostsNumber = 0;
        this.getPosts();
      }
    });
  }

  publicatePost(id: string): void {
    this.http.put(`api/admin/posts/publicate/${id}`, {}).map(res => {
      return true;
    }).catch(err => this.errorHandler(err)).subscribe(res => {
      if (res) {
        this.messagesService.showMessage('Post status changed');
        const index = this.posts.findIndex((post) => {
          return post.id === id;
        });
        if (index !== -1) {
          this.posts[index].value.published = !this.posts[index].value.published;
        }
      }
    });
  }

  getPost(postId: string): Observable<any> {
    return this.http.get(`api/admin/posts/${postId}`).map(res => {
      return res;
    }).catch(err => this.errorHandler(err));
  }

  savePost(post: any, id?: string): Observable<boolean> {
    if (id) {
      return this.http.put(`api/admin/posts/${id}`, post).map(res => {
        this.messagesService.showMessage('Post updated');
        return true;
      }).catch(err => this.errorHandler(err));
    } else {
      return this.http.post('api/admin/posts', post).map(res => {
        this.messagesService.showMessage('New post created');
        return true;
      }).catch(err => this.errorHandler(err));
    }
  }

  errorHandler(error: HttpErrorResponse) {
    if (error.status === 401) {
      this.authService.navigateToLogin();
    }
    this.messagesService.showMessage(error.error.message, true);
    return Observable.of(null);
  }
}
