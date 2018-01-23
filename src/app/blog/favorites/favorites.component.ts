import { Component, OnInit } from '@angular/core';

import { BlogService } from '../blog.service';

@Component({
  selector: 'blog-favorites',
  templateUrl: 'favorites.component.html'
})

export class FavoritesComponent implements OnInit {
  public favorites: any[] = [];

  constructor(public blogService: BlogService) { }

  ngOnInit() {
    this.getFavorites();
  }

  getFavorites(): void {
    this.blogService.getFavorites().subscribe(res => {
      this.favorites = res;
    }, err => {

    });
  }
}