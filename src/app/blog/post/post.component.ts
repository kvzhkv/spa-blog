import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { BlogService } from '../blog.service';

const Quill = require('quill');
// import { Quill } from 'quill';

@Component({
  templateUrl: 'post.component.html'
})

export class PostComponent implements OnInit, AfterViewInit {

  public post: any = {};
  public renderer: any;

  constructor(public blogService: BlogService, public route: ActivatedRoute, public location: Location) { }

  ngOnInit() {
    const id = this.route.snapshot.params['postId'];
    this.getPost(id);
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
      }
    });
  }

  goBack() {
    this.location.back();
  }
}