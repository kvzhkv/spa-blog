import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

import { BlogService } from './blog.service';
import { BlogTitleService } from '../core/blog-title.service';

@Component({
  templateUrl: 'blog.component.html'
})

export class BlogComponent implements OnInit, OnDestroy {

  public columns: number[];
  private resizeEvents;

  constructor(public blogService: BlogService, public route: ActivatedRoute, public blogTitleService: BlogTitleService) { }

  ngOnInit() {
    this.registerResizeEvent();
    this.setColumnsNumber();
    this.route.paramMap.subscribe(params => {
      if (this.blogService.currentTag !== params.get('tagName') || this.blogService.loadedPostsNumber === 0) {
        this.blogService.currentTag = params.get('tagName');
        this.blogTitleService.pushTitle(this.blogService.currentTag);
        this.blogService.emptyPosts();
        this.blogService.getPosts();
      }
    });
  }

  ngOnDestroy() {
    if (this.resizeEvents) {
      this.resizeEvents.unsubscribe();
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

  setColumnsNumber() {
    if (window.matchMedia('(min-width: 1000px)').matches) {
      this.columns = [0, 1, 2];
    } else if (window.matchMedia('(min-width: 600px) and (max-width: 999px)').matches) {
      this.columns = [0, 1];
    } else if (window.matchMedia('(max-width: 599px)').matches) {
      this.columns = [0];
    }
  }
}
