import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'blog-infinite-loader',
  templateUrl: 'infinite-loader.component.html',
  styleUrls: ['infinite-loader.component.scss']
})

export class InfiniteLoaderComponent implements OnInit, OnChanges {
  @Input() loadedPages: number;
  @Input() totalPages: number;
  @Input() loading: boolean;
  @Output() trigger: EventEmitter<number> = new EventEmitter();

  private scrollStream;
  public scrollEvents;

  constructor() { }

  ngOnInit() {
    this.registerScrollStream();
  }

  ngOnChanges() {
    if (this.loadedPages === this.totalPages && this.scrollEvents) {
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
    this.trigger.emit(this.loadedPages + 1);
    this.scrollEvents = this.scrollStream.subscribe(() => this.trigger.emit(this.loadedPages + 1));
  }

  deactivateInfiniteScroll() {
    if (this.scrollEvents) {
      this.scrollEvents.unsubscribe();
    }
  }
}
