import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from './auth/guards/auth.guard';
import { LoginComponent } from './auth/pages/login/login.component';

const routes: Routes = [
  { path: 'login', loadChildren: () => import( './auth/auth.module' ).then( m => m.AuthModule ), title: 'Login' },
  { path: 'admin', loadChildren: () => import( './admin/admin.module' ).then( m => m.AdminModule ), canMatch: [ authGuard ], title: 'Administración' },
  { path: 'basic', loadChildren: () => import( './basic/basic.module' ).then( m => m.BasicModule ), canMatch: [ authGuard ], title: 'Inicio' },
  { path: '**', component: LoginComponent }
];

@NgModule( {
  imports: [ RouterModule.forRoot( routes ) ],
  exports: [ RouterModule ]
} )
export class AppRoutingModule { }
