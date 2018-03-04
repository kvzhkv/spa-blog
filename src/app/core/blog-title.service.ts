import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { NavbarService } from './navbar/navbar.service';

@Injectable()
export class BlogTitleService {

  private blogName = '';
  private title = '';

  constructor(private titleService: Title) { }

  pushTitle(title: string) {
    this.title = title ? title.charAt(0).toUpperCase() + title.slice(1) : '';
    this.titleService.setTitle(this.createTitle());
  }

  private createTitle(): string {
    if (this.title && this.blogName) {
      return this.title + ' - ' + this.blogName;
    } else if (this.title || this.blogName) {
      return this.title || this.blogName;
    } else {
      return '';
    }
  }

  pushBlogName(name: string) {
    this.blogName = name;
    this.titleService.setTitle(this.createTitle());
  }
}
