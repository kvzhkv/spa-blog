import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { NavbarService } from './navbar/navbar.service';

import { environment } from '../../environments/environment';

@Injectable()
export class BlogTitleService {

  private blogTitle = environment.blogTitle;

  constructor(private titleService: Title) { }

  pushTitle(title: string) {
    const titleUppercased = title ? title.charAt(0).toUpperCase() + title.slice(1) : '';
    this.titleService.setTitle(this.createTitle(titleUppercased));
  }

  private createTitle(title: string): string {
    if (title && this.blogTitle) {
      return title + ' - ' + this.blogTitle;
    } else if (title || this.blogTitle) {
      return title || this.blogTitle;
    } else {
      return '';
    }
  }
}
