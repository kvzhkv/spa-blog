import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

import { PostsManagerService } from '../posts-manager.service';
import { BlogTitleService } from '../../../../core/blog-title.service';
import { ConfirmService } from '../../../../core/confirm/confirm.service';
import { environment } from '../../../../../environments/environment';

@Component({
  templateUrl: 'posts.component.html',
  styleUrls: ['posts.component.scss']
})

export class PostsComponent implements OnInit, OnDestroy {

  public env = environment;
  public columns: number[];
  private resizeEvents;

  private lgMatchMedia = `(min-width: ${this.env.lgMinScreenWidth}px)`;
  private mdMatchMedia = `(min-width: ${this.env.mdMinScreenWidth}px) and (max-width: ${this.env.lgMinScreenWidth - 0.02}px)`;
  private smMatchMedia = `(max-width: ${this.env.mdMinScreenWidth - 0.02}px)`;

  constructor(public postsManagerService: PostsManagerService,
    public router: Router,
    public blogTitleService: BlogTitleService,
    public confirmService: ConfirmService) { }

  ngOnInit() {
    this.blogTitleService.pushTitle('Posts Manager');
    this.registerResizeEvent();
    this.setColumnsNumber();
    this.postsManagerService.emptyPosts();
    this.postsManagerService.getPosts();
  }

  ngOnDestroy() {
    if (this.resizeEvents) {
      this.resizeEvents.unsubscribe();
    }
  }

  setColumnsNumber() {
    if (window.matchMedia(this.lgMatchMedia).matches) {
      this.columns = [0, 1, 2];
    } else if (window.matchMedia(this.mdMatchMedia).matches) {
      this.columns = [0, 1];
    } else if (window.matchMedia(this.smMatchMedia).matches) {
      this.columns = [0];
    }
  }

  registerResizeEvent() {
    this.resizeEvents = Observable.fromEvent(window, 'resize')
      .debounceTime(100)
      .filter(($event) => {
        if ($event['target'].matchMedia(this.lgMatchMedia).matches && this.columns.length !== 3) {
          return true;
        } else if ($event['target'].matchMedia(this.mdMatchMedia).matches && this.columns.length !== 2) {
          return true;
        } else if ($event['target'].matchMedia(this.smMatchMedia).matches && this.columns.length !== 1) {
          return true;
        }
      })
      .subscribe(($event) => {
        this.setColumnsNumber();
      });
  }

  editPost(postId?: string) {
    this.router.navigate(['administrator', 'posts-manager', 'edit', postId || '0']);
  }

  deletePost(postId: string) {
    this.confirmService.confirm(`Are you sure you want to delete post ${postId}?`, 'Delete', 'Cancel')
      .subscribe((value) => {
        if (value) {
          this.postsManagerService.deletePost(postId);
        }
      });
  }

  publicatePost(postId: string) {
    this.postsManagerService.publicatePost(postId);
  }
}
