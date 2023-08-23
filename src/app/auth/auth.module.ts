import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { MainComponent } from './pages/main/main.component';
import { PassChangeComponent } from './pages/pass-change/pass-change.component';

@NgModule( {
  declarations: [
    LoginComponent,
    MainComponent,
    PassChangeComponent
  ],
  imports: [
    AuthRoutingModule,
    CommonModule,
    ReactiveFormsModule
  ]
} )
export class AuthModule { }
