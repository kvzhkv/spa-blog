import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { AuthService } from '../auth/auth.service';

@Injectable()
export class DashboardGuard implements CanActivate {
  constructor(public authService: AuthService, public router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (this.authService.isAdminLoggedIn === undefined) {
      return this.authService.checkSession()
        .map(res => {
          if (!res) {
            this.router.navigate(['/administrator/login']);
            return res;
          } else {
            return res;
          }
        });
    } else {
      if (!this.authService.isAdminLoggedIn) {
        this.router.navigate(['/administrator/login']);
      }
      return Observable.of(this.authService.isAdminLoggedIn);
    }
  }
}
