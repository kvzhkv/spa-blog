import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'blog-infinite-loader',
  templateUrl: 'infinite-loader.component.html',
  styleUrls: ['infinite-loader.component.scss']
})

export class InfiniteLoaderComponent implements OnInit, OnChanges {
  @Input() loadedPostsNumber: number;
  @Input() totalPostsNumber: number;
  @Input() loading: boolean;
  @Output() trigger: EventEmitter<any> = new EventEmitter();

  private scrollStream: Observable<any>;
  public scrollEvents: Subscription;

  constructor() { }

  ngOnInit() {
    this.registerScrollStream();
  }

  ngOnChanges() {
    if (this.loadedPostsNumber === this.totalPostsNumber && this.scrollEvents) {
      this.deactivateInfiniteScroll();
    }
  }

  registerScrollStream() {
    this.scrollStream = Observable.fromEvent(window, 'scroll')
      .debounceTime(100)
      .map(($event) => {
        return {
          sH: $event['target'].scrollingElement.scrollHeight,
          sT: $event['target'].scrollingElement.scrollTop,
          cH: $event['target'].scrollingElement.clientHeight
        };
      })
      .filter(val => !this.loading)
      .filter(val => {
        return val.sH === val.sT + val.cH;
      });
  }

  activateInfiniteScroll() {
    this.trigger.emit(null);
    this.scrollEvents = this.scrollStream.subscribe(() => this.trigger.emit(null));
  }

  deactivateInfiniteScroll() {
    if (this.scrollEvents) {
      this.scrollEvents.unsubscribe();
    }
  }
}
