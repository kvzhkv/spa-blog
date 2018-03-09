import { Component, OnInit, OnDestroy } from '@angular/core';

import { ConfirmService } from './confirm.service';
import { Subscription } from 'rxjs/Subscription';
import { ConfirmMessage } from './confirm-message.model';
import { trigger, state, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'blog-confirm',
  templateUrl: 'confirm.component.html',
  styleUrls: ['confirm.component.scss'],
  animations: [
    trigger('appearInOut', [
      state('in', style({opacity: '*'})),
      transition('void => *', [
        style({opacity: '0'}),
        animate(150)
      ]),
      transition('* => void', [
        animate(150, style({opacity: '0'}))
      ])
    ]),
    trigger('flyInOut', [
      state('in', style({height: '*'})),
      transition('void => *', [
        style({transform: 'translateY(-100%)'}),
        animate(150)
      ]),
      transition('* => void', [
        animate(150, style({transform: 'translateY(-100%)'}))
      ])
    ])
  ]
})

export class ConfirmComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  public confirmMessage: ConfirmMessage;

  constructor(public confirmService: ConfirmService) { }

  ngOnInit() {
    this.subscription = this.confirmService.confirmMessageState.subscribe((confirmMessage: ConfirmMessage) => {
      this.confirmMessage = confirmMessage;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  action(value: boolean) {
    this.confirmMessage = null;
    this.confirmService.action(value);
  }
}
