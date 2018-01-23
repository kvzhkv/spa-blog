import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'blog-file-tree',
  templateUrl: 'tree.component.html',
  styleUrls: ['tree.component.scss']
})

export class TreeComponent implements OnInit {
  @Input() items: {}[];
  @Input() selectedItem: any;
  @Output() pickItem: EventEmitter<{}> = new EventEmitter<{}>();

  constructor() { }

  ngOnInit() { }

  pick(item: string) {
    this.pickItem.emit(item);
  }
}