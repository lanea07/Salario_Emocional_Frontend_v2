import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './pages/main/main.component';
import { PassChangeComponent } from './pages/pass-change/pass-change.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';

const routes: Routes = [ {
  path: '',
  component: MainComponent,
  children: [
    { path: 'password-change', component: PassChangeComponent, title: 'Cambiar Contraseña' },
    { path: 'forgot-password', component: ForgotPasswordComponent, title: 'Olvidar Contraseña' },
    { path: '**', redirectTo: 'login' },
  ]
} ];

@NgModule( {
  imports: [ RouterModule.forChild( routes ) ],
  exports: [ RouterModule ]
} )
export class AuthRoutingModule { }
