import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class LoadingBarService {
  // public isLoading: boolean;
  private loaderSubject = new Subject<boolean>();

  public loadingState = this.loaderSubject.asObservable();

  constructor() { }

  show() {
    this.loaderSubject.next(<boolean>true);
  }

  hide() {
    this.loaderSubject.next(<boolean>false);
  }
}
