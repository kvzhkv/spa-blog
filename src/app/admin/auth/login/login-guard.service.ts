import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { AuthService } from '../auth.service';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(public authService: AuthService, public router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>  {
    if (this.authService.isAdminLoggedIn === undefined) {
      return this.authService.checkSession()
        .map(res => {
          if (res) {
            this.router.navigate(['/administrator']);
            return !res;
          } else {
            return !res;
          }
        });
    } else {
      return Observable.of(!this.authService.isAdminLoggedIn);
    }
  }
}
