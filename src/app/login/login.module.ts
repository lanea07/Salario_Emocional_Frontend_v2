import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from '../auth/pages/login/login.component';
import { LoginRoutingModule } from './login-routing.module';


@NgModule( {
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    ReactiveFormsModule
  ]
} )
export class LoginModule { }
