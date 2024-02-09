import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserPreferencesRoutingModule } from './user-preferences-routing.module';
import { IndexComponent } from './pages/index/index.component';
import { ProfileInformationComponent } from './pages/index/components/profile-information/profile-information.component';
import { UpdatePasswordComponent } from './pages/index/components/update-password/update-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserPreferencesComponent } from './pages/index/components/user-preferences/user-preferences.component';
import { PrimengModule } from '../primeng/primeng.module';


@NgModule( {
  declarations: [
    IndexComponent,
    ProfileInformationComponent,
    UpdatePasswordComponent,
    UserPreferencesComponent
  ],
  imports: [
    CommonModule,
    PrimengModule,
    ReactiveFormsModule,
    UserPreferencesRoutingModule
  ]
} )
export class UserPreferencesModule { }
