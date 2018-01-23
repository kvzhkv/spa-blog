import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { AdminComponent } from './admin.component';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AuthService } from './auth/auth.service';
import { LoginGuard } from './auth/login/login-guard.service';
import { DashboardGuard } from './dashboard/dashboard-guard.service';
import { PostsManagerComponent } from './dashboard/posts-manager/posts-manager.component';
import { MenuManagerComponent } from './dashboard/menu-manager/menu-manager.component';
import { MediaManagerComponent } from './dashboard/media-manager/media-manager.component';
import { PostsManagerService } from './dashboard/posts-manager/posts-manager.service';
import { PostsComponent } from './dashboard/posts-manager/posts/posts.component';
import { EditPostComponent } from './dashboard/posts-manager/edit-post/edit-post.component';
import { MenuManagerService } from './dashboard/menu-manager/menu-manager.service';
import { MediaManagerService } from './dashboard/media-manager/media-manager.service';
import { DateValueAccessorDirective } from './dashboard/posts-manager/edit-post/date-value-accessor.directive';
import { FileAccessor } from './dashboard/media-manager/file-value-accessor.directive';
import { TreeComponent } from './dashboard/media-manager/tree/tree.component';

@NgModule({
  imports: [
    SharedModule,
    AdminRoutingModule
  ],
  exports: [],
  declarations: [
    AdminComponent,
    LoginComponent,
    DashboardComponent,
    MenuManagerComponent,
    MediaManagerComponent,
    TreeComponent,
    PostsManagerComponent,
    PostsComponent,
    EditPostComponent,
    DateValueAccessorDirective,
    FileAccessor
  ],
  providers: [
    AuthService,
    LoginGuard,
    DashboardGuard,
    PostsManagerService,
    MenuManagerService,
    MediaManagerService
  ],
})
export class AdminModule { }
