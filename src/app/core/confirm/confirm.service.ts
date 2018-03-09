import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ConfirmMessage } from './confirm-message.model';

@Injectable()
export class ConfirmService {

  private confirmMessageSubject = new Subject<ConfirmMessage>();

  public confirmMessageState = this.confirmMessageSubject.asObservable();

  public confirmSubject: Subject<boolean>;

  constructor() { }

  confirm(message: string, okButton: string = 'OK', cancelButton: string = 'Cancel'): Observable<boolean> {
    this.confirmMessageSubject.next({
      message,
      okButton,
      cancelButton
    });
    this.confirmSubject = new Subject<boolean>();
    return this.confirmSubject.asObservable();
  }

  action(value: boolean) {
    this.confirmSubject.next(value);
    this.confirmSubject.complete();
  }
}
