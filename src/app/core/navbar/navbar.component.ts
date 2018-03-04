import { Component, OnInit } from '@angular/core';

import { NavbarService } from './navbar.service';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'blog-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.scss']
})

export class NavbarComponent implements OnInit {

  public env = environment;

  constructor(private navbarService: NavbarService) { }

  ngOnInit() {
    this.navbarService.getInfo();
  }
}
