import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { MainComponent } from './pages/main/main.component';
import { PassChangeComponent } from './pages/pass-change/pass-change.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';

@NgModule( {
  declarations: [
    LoginComponent,
    MainComponent,
    PassChangeComponent,
    ForgotPasswordComponent
  ],
  imports: [
    AuthRoutingModule,
    CommonModule,
    LoadingBarModule,
    LoadingBarRouterModule,
    ReactiveFormsModule
  ]
} )
export class AuthModule { }
