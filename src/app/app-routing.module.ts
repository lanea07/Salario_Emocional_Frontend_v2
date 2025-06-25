import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from './auth/guards/auth.guard';
import { loginGuard } from './auth/guards/login-guard.guard';

const routes: Routes = [
  { path: 'login', loadChildren: () => import( './login/login.module' ).then( m => m.LoginModule ), canMatch: [ loginGuard ], title: 'Login' },
  { path: 'auth', loadChildren: () => import( './auth/auth.module' ).then( m => m.AuthModule ), title: 'Olvidar Contraseña' },
  { path: 'admin', loadChildren: () => import( './admin/admin.module' ).then( m => m.AdminModule ), canMatch: [ authGuard ], title: 'Administración' },
  { path: 'basic', loadChildren: () => import( './basic/basic.module' ).then( m => m.BasicModule ), canMatch: [ authGuard ], title: 'Inicio' },
  { path: '**', redirectTo: 'login' }
];

@NgModule( {
  imports: [ RouterModule.forRoot( routes ) ],
  exports: [ RouterModule ]
} )
export class AppRoutingModule { }