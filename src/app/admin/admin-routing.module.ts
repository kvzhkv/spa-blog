import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { LoginComponent } from './auth/login/login.component';
// import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginGuard } from './auth/login/login-guard.service';
import { DashboardGuard } from './dashboard/dashboard-guard.service';
import { PostsManagerComponent } from './dashboard/posts-manager/posts-manager.component';
import { MenuManagerComponent } from './dashboard/menu-manager/menu-manager.component';
import { MediaManagerComponent } from './dashboard/media-manager/media-manager.component';
import { PostsComponent } from './dashboard/posts-manager/posts/posts.component';
import { EditPostComponent } from './dashboard/posts-manager/edit-post/edit-post.component';

const adminRoutes: Routes = [
  {
    path: '', component: AdminComponent,
    children: [
      {
        path: 'login', canActivate: [LoginGuard], component: LoginComponent
      },
      {
        path: '', canActivate: [DashboardGuard], redirectTo: 'posts-manager', pathMatch: 'full'
      },
      {
        path: 'posts-manager', canActivate: [DashboardGuard], component: PostsManagerComponent, children: [
          {
            path: '', component: PostsComponent
          },
          // {
          //   path: '', redirectTo: 'posts', pathMatch: 'full'
          // },
          {
            path: 'edit/:postId', component: EditPostComponent
          }
        ]
      },
      {
        path: 'menu-manager', canActivate: [DashboardGuard], component: MenuManagerComponent
      },
      {
        path: 'media-manager', canActivate: [DashboardGuard], component: MediaManagerComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }

// export const routedComponents = [AdminComponent];