import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlogComponent } from './blog.component';
import { PostComponent } from './post/post.component';

const blogRoutes: Routes = [
  {
    path: '', component: BlogComponent
  },
  {
    path: 'tag/:tagName', component: BlogComponent
  },
  {
    path: 'posts/:postId', component: PostComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(blogRoutes)],
  exports: [RouterModule],
})
export class BlogRoutingModule { }
