import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from '../auth/pages/main/main.component';
import { LoginComponent } from '../auth/pages/login/login.component';

const routes: Routes = [ {
  path: '',
  component: MainComponent,
  children: [
    { path: '', component: LoginComponent, title: 'Login' },
    { path: '**', redirectTo: '' },
  ]
} ];

@NgModule( {
  imports: [ RouterModule.forChild( routes ) ],
  exports: [ RouterModule ]
} )
export class LoginRoutingModule { }
