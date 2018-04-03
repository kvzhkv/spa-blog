import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { BlogService } from '../blog.service';
import { BlogTitleService } from '../../core/blog-title.service';
import { GoogleAnalyticsService } from '../../core/google-analytics.service';

const Quill = require('quill');
// import { Quill } from 'quill';

@Component({
  templateUrl: 'post.component.html'
})

export class PostComponent implements OnInit, AfterViewInit {

  public post: any = {};
  public renderer: any;
  public postReadingTime: number = null;

  constructor(public blogService: BlogService,
    public route: ActivatedRoute,
    public location: Location,
    public blogTitleService: BlogTitleService,
    public googleAnalyticsService: GoogleAnalyticsService) { }

  ngOnInit() {
    const id = this.route.snapshot.params['postId'];
    this.getPost(id);
    this.googleAnalyticsService.sendPageView('/post/' + id);
  }

  ngAfterViewInit() {
    this.renderer = new Quill('#b-quill-renderer', {
      readOnly: true,
      theme: 'bubble'
    });
  }

  getPost(id: string) {
    this.blogService.getPost(id).subscribe(res => {
      if (res) {
        this.post = res.post;
        this.renderer.setContents(this.post.text.ops);
        this.postReadingTime = Math.ceil(this.renderer.getLength() / 1500);
        this.blogTitleService.pushTitle(this.post.title);
        this.googleAnalyticsService.emitEvent('Post', 'Viewed', 'one', 1);
      }
    });
  }

  goBack() {
    this.location.back();
  }
}
