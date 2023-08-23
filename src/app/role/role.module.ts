import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { DataTablesModule } from 'angular-datatables';

import { CreateComponent } from './pages/create/create.component';
import { IndexComponent } from './pages/index/index.component';
import { ShowComponent } from './pages/show/show.component';
import { RoleRoutingModule } from './role-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule( {
  declarations: [
    CreateComponent,
    IndexComponent,
    ShowComponent,
  ],
  imports: [
    CommonModule,
    DataTablesModule,
    RoleRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
} )
export class RoleModule { }
