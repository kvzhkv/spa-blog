import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  // selector: 'blog-admin',
  templateUrl: 'admin.component.html'
})

export class AdminComponent implements OnInit {
  constructor(public authService: AuthService) { }

  ngOnInit() { }
}
