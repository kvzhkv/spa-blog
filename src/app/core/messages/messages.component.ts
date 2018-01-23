import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessagesService } from './messages.service';
import { Subscription } from 'rxjs/Subscription';
import { trigger, state, transition, animate, style } from '@angular/animations';

import { Message } from './message.model';

@Component({
  selector: 'blog-messages',
  templateUrl: 'messages.component.html',
  styleUrls: ['messages.component.scss'],
  animations: [
    trigger('flyInOut', [
      state('in', style({height: '*'})),
      transition('void => *', [
        style({transform: 'translateY(-100%)'}),
        animate(150)
      ]),
      transition('* => void', [
        animate(150, style({height: 0, color: 'white'}))
      ])
    ])
  ]
})

export class MessagesComponent implements OnInit, OnDestroy {

  public messagesStream: Message[] = [];
  private subscription: Subscription;

  constructor(public messagesService: MessagesService) { }

  ngOnInit() {
    this.subscription = this.messagesService.messagesState.subscribe((message: Message) => {
      message.timeOut = setTimeout(() => {
        this.messagesStream.splice(0, 1);
      }, 3000);
      this.messagesStream.push(message);
    });
  }

  cleanUpMessage(index: number) {
    clearTimeout(this.messagesStream[index].timeOut);
    this.messagesStream.splice(index, 1);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}