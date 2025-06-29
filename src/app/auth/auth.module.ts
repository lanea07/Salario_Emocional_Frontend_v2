import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';

import { AuthRoutingModule } from './auth-routing.module';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { MainComponent } from './pages/main/main.component';
import { PassChangeComponent } from './pages/pass-change/pass-change.component';

@NgModule( {
  declarations: [
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
