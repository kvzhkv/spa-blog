import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'blog-post-header',
  templateUrl: 'post-header.component.html',
  styleUrls: ['post-header.component.scss']
})

export class PostHeaderComponent implements OnInit {
  @Input() title: string;
  @Input() tags: string[];
  @Input() date: number;
  @Input() readingTime: number;
  @Input() viewsNumber: number;
  @Input() likesNumber: number;

  constructor() { }

  ngOnInit() { }
}
