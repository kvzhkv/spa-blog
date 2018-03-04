import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { BlogRoutingModule } from './blog-routing.module';

import { BlogComponent } from './blog.component';
import { PostComponent } from './post/post.component';

import { BlogService } from './blog.service';

@NgModule({
  imports: [
    SharedModule,
    BlogRoutingModule
  ],
  exports: [],
  declarations: [
    BlogComponent,
    PostComponent
  ],
  providers: [
    BlogService
  ],
})
export class BlogModule { }
