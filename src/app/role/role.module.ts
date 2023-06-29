import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoleRoutingModule } from './role-routing.module';
import { IndexComponent } from './pages/index/index.component';
import { ShowComponent } from './pages/show/show.component';
import { CreateComponent } from './pages/create/create.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule( {
  declarations: [
    IndexComponent,
    ShowComponent,
    CreateComponent
  ],
  imports: [
    CommonModule,
    RoleRoutingModule,
    ReactiveFormsModule
  ]
} )
export class RoleModule { }
