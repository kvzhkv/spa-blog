import { NgModule, Optional, SkipSelf, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import localeRu from '@angular/common/locales/ru';

registerLocaleData(localeRu);

import { LoadingBarComponent } from './loading-bar/loading-bar.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NavbarService } from './navbar/navbar.service';

import { HttpRequestInterceptor } from './http-request.interceptor';
import { LoadingBarService } from './loading-bar/loading-bar.service';
import { MessagesComponent } from './messages/messages.component';
import { MessagesService } from './messages/messages.service';
import { FooterComponent } from './footer/footer.component';
import { BlogTitleService } from './blog-title.service';
import { ConfirmComponent } from './confirm/confirm.component';
import { ConfirmService } from './confirm/confirm.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  exports: [
    LoadingBarComponent,
    NavbarComponent,
    MessagesComponent,
    ConfirmComponent,
    FooterComponent,
    BrowserAnimationsModule
  ],
  declarations: [
    NavbarComponent,
    LoadingBarComponent,
    NotFoundComponent,
    MessagesComponent,
    FooterComponent,
    ConfirmComponent
  ],
  providers: [
    NavbarService,
    LoadingBarService,
    MessagesService,
    ConfirmService,
    BlogTitleService,
    { provide: LOCALE_ID, useValue: 'ru-RU' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true
    }
  ]
})
export class CoreModule {
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
