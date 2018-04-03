import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'blog-post-brick',
  templateUrl: 'post-brick.component.html',
  styleUrls: ['post-brick.component.scss']
})

export class PostBrickComponent implements OnInit {

  @Input() post: any;
  @Input() id: string;

  public readingTime: number = null;

  constructor() { }

  ngOnInit() {
    if (this.post.length) {
      this.readingTime = Math.ceil(this.post.length / 1500);
    }
  }
}
