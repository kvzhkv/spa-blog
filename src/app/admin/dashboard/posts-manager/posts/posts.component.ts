import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

import { PostsManagerService } from '../posts-manager.service';
import { BlogTitleService } from '../../../../core/blog-title.service';

@Component({
  templateUrl: 'posts.component.html',
  styleUrls: ['posts.component.scss']
})

export class PostsComponent implements OnInit, OnDestroy {

  public columns: number[];
  private resizeEvents;

  constructor(public postsManagerService: PostsManagerService,
    public router: Router,
    public blogTitleService: BlogTitleService) { }

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
    if (window.matchMedia('(min-width: 1000px)').matches) {
      this.columns = [0, 1, 2];
    } else if (window.matchMedia('(min-width: 600px) and (max-width: 999px)').matches) {
      this.columns = [0, 1];
    } else if (window.matchMedia('(max-width: 599px)').matches) {
      this.columns = [0];
    }
  }

  registerResizeEvent() {
    this.resizeEvents = Observable.fromEvent(window, 'resize')
      .debounceTime(100)
      .filter(($event) => {
        if ($event['target'].matchMedia('(min-width: 1000px)').matches && this.columns.length !== 3) {
          return true;
        } else if ($event['target'].matchMedia('(min-width: 600px) and (max-width: 999px)').matches && this.columns.length !== 2) {
          return true;
        } else if ($event['target'].matchMedia('(max-width: 599px)').matches && this.columns.length !== 1) {
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
    this.postsManagerService.deletePost(postId);
  }

  publicatePost(postId: string) {
    this.postsManagerService.publicatePost(postId);
  }
}
