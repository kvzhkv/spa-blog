import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { InfiniteLoaderComponent } from './infinite-loader/infinite-loader.component';
import { ColumnFilterPipe } from './column-filter/column-filter.pipe';
import { PostBrickComponent } from './post-brick/post-brick.component';
import { PostHeaderComponent } from './post-header/post-header.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    ReactiveFormsModule,
    CommonModule,
    InfiniteLoaderComponent,
    PostBrickComponent,
    PostHeaderComponent,
    ColumnFilterPipe
  ],
  declarations: [
    InfiniteLoaderComponent,
    PostBrickComponent,
    PostHeaderComponent,
    ColumnFilterPipe
  ],
  providers: [
  ],
})
export class SharedModule { }
