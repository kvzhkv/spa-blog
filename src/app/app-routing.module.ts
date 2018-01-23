import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundComponent } from './core/not-found.component';
// import { BlogComponent } from './blog/blog.component';

const blogRoutes: Routes = [
    { path: 'administrator', loadChildren: 'app/admin/admin.module#AdminModule' },
    { path: '**', component: NotFoundComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(blogRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {}
