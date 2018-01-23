import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { Message } from './message.model';

@Injectable()
export class MessagesService {

  private messagesSubject = new Subject<Message>();

  public messagesState = this.messagesSubject.asObservable();

  constructor() { }

  showMessage(message: string, isError?: boolean) {
    this.messagesSubject.next(new Message(message, isError));
  }
}
