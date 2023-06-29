import { NgModule } from '@angular/core';
import { CommonModule, LocationStrategy } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { MainComponent } from './pages/main/main.component';
import { LoginComponent } from './pages/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule( {
  declarations: [
    MainComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule
  ]
} )
export class AuthModule { }
