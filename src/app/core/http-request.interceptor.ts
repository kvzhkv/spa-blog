import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

import { LoadingBarService } from './loading-bar/loading-bar.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.showLoadingBar();
    return next.handle(req).do(event => {
      if (event instanceof HttpResponse) {
        this.hideLoadingBar();
      }
    }, err => {
      if (err instanceof HttpErrorResponse) {
        this.hideLoadingBar();
      }
    });
  }

  constructor(public loadingBarService: LoadingBarService) { }

  private showLoadingBar(): void {
    this.loadingBarService.show();
  }

  private hideLoadingBar(): void {
    this.loadingBarService.hide();
  }
}
