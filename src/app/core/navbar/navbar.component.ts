import { Component, OnInit } from '@angular/core';

import { NavbarService } from './navbar.service';

class Info {
  facebookLink?: string;
  instagramLink?: string;
  vkLink?: string;
  youtubeLink?: string;
}

@Component({
  selector: 'blog-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.scss']
})

export class NavbarComponent implements OnInit {
  public menuItems: {} = null;
  public info: Info = null;
  // public tags: string[] = null;

  // public showTagsList = false;

  constructor(private navbarService: NavbarService) { }

  ngOnInit() {
    this.getInfo();
    // this.getTags();
  }

  getInfo() {
    this.navbarService.getInfo().subscribe(res => {
      this.menuItems = res.menuItems;
      this.info = res.info;
    });
  }

  // getTags() {
  //   this.navbarService.getTags().subscribe(res => {
  //     this.tags = res;
  //   });
  // }
}
