import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

import { BlogService } from './blog.service';
import { BlogTitleService } from '../core/blog-title.service';
import { environment } from '../../environments/environment';
import { Subscription } from 'rxjs/Subscription';
import { GoogleAnalyticsService } from '../core/google-analytics.service';

@Component({
  templateUrl: 'blog.component.html'
})

export class BlogComponent implements OnInit, OnDestroy {

  public env = environment;
  public columns: number[];
  private resizeEvents: Subscription;
  private routeSubscription: Subscription;

  private lgMatchMedia = `(min-width: ${this.env.lgMinScreenWidth}px)`;
  private mdMatchMedia = `(min-width: ${this.env.mdMinScreenWidth}px) and (max-width: ${this.env.lgMinScreenWidth - 0.02}px)`;
  private smMatchMedia = `(max-width: ${this.env.mdMinScreenWidth - 0.02}px)`;

  constructor(public blogService: BlogService,
    public route: ActivatedRoute,
    public blogTitleService: BlogTitleService,
    public googleAnalyticsService: GoogleAnalyticsService) { }

  ngOnInit() {
    this.registerResizeEvent();
    this.setColumnsNumber();
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      if (this.blogService.currentTag !== params.get('tagName') || this.blogService.loadedPostsNumber === 0) {
        this.blogService.currentTag = params.get('tagName');
        this.blogTitleService.pushTitle(this.blogService.currentTag);
        this.blogService.emptyPosts();
        this.blogService.getPosts();
      }
      this.googleAnalyticsService.sendPageView(`/${this.blogService.currentTag ? 'tag/' + this.blogService.currentTag : ''}`);
    });
  }

  ngOnDestroy() {
    if (this.resizeEvents) {
      this.resizeEvents.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
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

  setColumnsNumber() {
    if (window.matchMedia(this.lgMatchMedia).matches) {
      this.columns = [0, 1, 2];
    } else if (window.matchMedia(this.mdMatchMedia).matches) {
      this.columns = [0, 1];
    } else if (window.matchMedia(this.smMatchMedia).matches) {
      this.columns = [0];
    }
  }
}
