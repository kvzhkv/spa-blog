import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { MessagesService } from '../../../core/messages/messages.service';
import { Message } from '../../../core/messages/message.model';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class PostsManagerService {

  // public currentPage = 1;
  // public totalPages = 1;
  public postsOnPage = 9;

  constructor(private http: HttpClient, public messagesService: MessagesService, public authService: AuthService) { }

  getPosts(page: number): Observable<any> {
    const skipNumber: number = this.postsOnPage * (page - 1);
    return this.http.get(`api/admin/posts?limit=${this.postsOnPage}&skip=${skipNumber}`).map(res => {
      return res;
    }).catch(err => this.errorHandler(err));
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

  deletePost(id: string): Observable<boolean> {
    return this.http.delete(`api/admin/posts/${id}`).map(res => {
      this.messagesService.showMessage('Post deleted');
      return true;
    }).catch(err => this.errorHandler(err));
  }

  publicatePost(id: string): Observable<boolean> {
    return this.http.put(`api/admin/posts/publicate/${id}`, {}).map(res => {
      this.messagesService.showMessage('Post status changed');
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
