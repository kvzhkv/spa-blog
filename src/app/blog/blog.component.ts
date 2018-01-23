import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

import { BlogService } from './blog.service';

@Component({
  templateUrl: 'blog.component.html'
})

export class BlogComponent implements OnInit, OnDestroy {

  public posts: any[] = [];
  public tag: string = null;

  public loadedPages = 0;
  public totalPages = 0;

  public loading = false;

  public columns: number[];

  private resizeEvents;

  constructor(public blogService: BlogService, public route: ActivatedRoute) { }

  ngOnInit() {
    // console.log('init blog component');
    this.registerResizeEvent();
    this.setColumnsNumber();
    this.route.paramMap.subscribe(params => {
      this.tag = params.get('tagName');
      // console.log('changing tag');
      this.posts = [];
      this.totalPages = 0;
      this.loadedPages = 0;
      this.getPosts(this.loadedPages + 1);
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

  getPosts(page: number): void {
    this.loading = true;
    this.blogService.getPosts(page, this.tag).subscribe(res => {
      if (res) {
        this.posts = this.posts.concat(res['rows']);
        // this.populateCols(this.posts);
        // console.log(this.columns);
        this.totalPages = Math.ceil(res['total_rows'] / this.blogService.postsOnPage);
        this.loadedPages = Math.ceil(this.posts.length / this.blogService.postsOnPage);
      }
    }, err => { }, () => {
      this.loading = false;
    });
  }
}
