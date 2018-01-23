import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PostsManagerService } from '../posts-manager.service';

@Component({
  templateUrl: 'posts.component.html',
  styleUrls: ['posts.component.scss']
})

export class PostsComponent implements OnInit {

  public posts: any[] = [];

  public columns: number[];

  public loadedPages: number;
  public totalPages: number;

  public loading = false;

  constructor(public postsManagerService: PostsManagerService, public router: Router) { }

  ngOnInit() {
    this.setColumnsNumber();
    this.loadedPages = 0;
    this.totalPages = 0;
    this.getPosts(this.loadedPages + 1);
  }

  setColumnsNumber() {
    if (document.body.clientWidth >= 1000) {
      this.columns = [0, 1, 2];
    } else if (document.body.clientWidth > 550 && document.body.clientWidth < 1000) {
      this.columns = [0, 1];
    } else {
      this.columns = [0];
    }
  }

  getPosts(page: number): void {
    this.loading = true;
    this.postsManagerService.getPosts(page).subscribe(res => {
      if (res) {
        this.posts = this.posts.concat(res['rows']);
        this.totalPages = Math.ceil(res['total_rows'] / this.postsManagerService.postsOnPage);
        this.loadedPages = Math.ceil(this.posts.length / this.postsManagerService.postsOnPage);
      }
    }, err => {}, () => {
      this.loading = false;
    });
  }

  changePage(page: number): void {
    this.getPosts(page);
  }

  editPost(postId?: string) {
    this.router.navigate(['administrator', 'posts-manager', 'edit', postId || '0']);
  }

  deletePost(postId: string) {
    this.postsManagerService.deletePost(postId).subscribe(res => {
      // this.getPosts(this.postsManagerService.currentPage);
      // FIXME: сделать исключение поста из массива?
    });
  }

  publicatePost(postId: string) {
    this.postsManagerService.publicatePost(postId).subscribe(res => {
      if (res) {
        const index = this.posts.findIndex((post) => {
          return post.id === postId;
        });
        if (index !== -1) {
          this.posts[index].value.published = !this.posts[index].value.published;
        }
      }
    });
  }
}
