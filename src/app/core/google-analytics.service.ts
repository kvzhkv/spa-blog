import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { environment } from '../../environments/environment';

declare var ga: Function;

@Injectable()
export class GoogleAnalyticsService {

  constructor(private router: Router) {
    if (environment.gaTrackingId) {
      this.createGAScript();
      if (typeof ga === 'function') {
        ga('create', {
          trackingId: environment.gaTrackingId,
          cookieDomain: 'auto'
        });
        console.log('GA Service initialized');
      }
    }
  }

  private createGAScript() {
    const script = document.createElement('script');
    script.src = `https://www.google-analytics.com/analytics${environment.gaProduction ? '' : '_debug'}.js`;
    script.async = true;
    document.head.appendChild(script);
  }

  public sendPageView(page: string) {
    if (environment.gaTrackingId && typeof ga === 'function') {
      ga('send', {
        hitType: 'pageview',
        page: page
      });
    }
  }

  public emitEvent(category: string, action: string, label: string = null, value: number = null) {
     if (environment.gaTrackingId && typeof ga === 'function') {
       ga('send', 'event', {
         eventCategory: category,
         eventLabel: label,
         eventAction: action,
         eventValue: value
       });
     }
  }
}
