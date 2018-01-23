import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'admin-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  constructor(public authService: AuthService, public router: Router) { }

  ngOnInit() { }

  logout() {
    this.authService.logout().subscribe(res => {
      if (res) {
        this.router.navigate(['/administrator/login']);
      }
    });
  }
}
