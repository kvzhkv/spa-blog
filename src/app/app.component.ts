import { Component } from '@angular/core';
import { GoogleAnalyticsService } from './core/google-analytics.service';

@Component({
  selector: 'app-spa-blog',
  templateUrl: './app.component.html'
})
export class AppComponent {

  constructor(private googleAnalyticsService: GoogleAnalyticsService) { }
}
