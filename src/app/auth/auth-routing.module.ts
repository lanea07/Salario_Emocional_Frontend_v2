import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { MainComponent } from './pages/main/main.component';
import { PassChangeComponent } from './pages/pass-change/pass-change.component';

const routes: Routes = [ {
  path: '',
  component: MainComponent,
  children: [
    { path: 'login', component: LoginComponent, title: 'Login' },
    { path: 'password-change', component: PassChangeComponent, title: 'Cambiar Contraseña' },
    { path: '**', redirectTo: 'login' },
  ]
} ];

@NgModule( {
  imports: [ RouterModule.forChild( routes ) ],
  exports: [ RouterModule ]
} )
export class AuthRoutingModule { }
