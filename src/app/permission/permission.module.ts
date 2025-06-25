import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { DataTablesModule } from 'angular-datatables';

import { CreateComponent } from './pages/create/create.component';
import { IndexComponent } from './pages/index/index.component';
import { ShowComponent } from './pages/show/show.component';
import { PermissionRoutingModule } from './permission-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PrimengModule } from '../primeng/primeng.module';

@NgModule( {
  declarations: [
    CreateComponent,
    IndexComponent,
    ShowComponent,
  ],
  imports: [
    CommonModule,
    DataTablesModule,
    PrimengModule,
    PermissionRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
} )
export class PermissionModule { }
