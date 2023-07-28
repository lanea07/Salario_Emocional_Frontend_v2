import { NgModule } from '@angular/core';
import { CommonModule, LocationStrategy } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { MainComponent } from './pages/main/main.component';
import { LoginComponent } from './pages/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PassChangeComponent } from './pages/pass-change/pass-change.component';

@NgModule( {
  declarations: [
    MainComponent,
    LoginComponent,
    PassChangeComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule
  ]
} )
export class AuthModule { }
