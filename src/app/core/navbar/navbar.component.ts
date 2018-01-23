import { Component, OnInit } from '@angular/core';

import { NavbarService } from './navbar.service';

@Component({
  selector: 'blog-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.scss']
})

export class NavbarComponent implements OnInit {
  public menuItems: {} = null;
  public tags: string[] = null;

  constructor(private navbarService: NavbarService) { }

  public showTagsList = false;

  ngOnInit() {
    this.getMenuItems();
    this.getTags();
  }

  getMenuItems() {
    this.navbarService.getMenuItems().subscribe(res => {
      this.menuItems = res;
    }, err => {
      console.log(err); // FIXME: change console
    });
  }

  getTags() {
    this.navbarService.getTags().subscribe(res => {
      this.tags = res;
    });
  }
}
