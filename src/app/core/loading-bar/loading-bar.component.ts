import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
// import { trigger, state, transition, style, animate } from '@angular/animations';

import { LoadingBarService } from './loading-bar.service';

@Component({
  selector: 'blog-loading-bar',
  templateUrl: 'loading-bar.component.html',
  styleUrls: ['loading-bar.component.css']
})

export class LoadingBarComponent implements OnInit, OnDestroy {
  public show = false;
  private showStream: boolean[] = [];
  private subscription: Subscription;

  constructor(private loadingBarService: LoadingBarService) { }

  ngOnInit() {
    this.subscription = this.loadingBarService.loadingState.subscribe((state: boolean) => {
        if (state){
          this.showStream.push(true);
          this.toggleLoadingBar(this.showStream);
        } else {
          this.showStream.shift();
          this.toggleLoadingBar(this.showStream);
        }
    });
  }

  toggleLoadingBar(showStr: boolean[]): void {
    if (showStr.length === 0) {
      this.show = false;
    } else {
      this.show = true;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
