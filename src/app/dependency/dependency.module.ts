import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DataTablesModule } from 'angular-datatables';

import { SharedModule } from '../shared/shared.module';
import { DependencyRoutingModule } from './dependency-routing.module';
import { CreateComponent } from './pages/create/create.component';
import { IndexComponent } from './pages/index/index.component';
import { ShowComponent } from './pages/show/show.component';
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
    DependencyRoutingModule,
    FormsModule,
    PrimengModule,
    ReactiveFormsModule,
    SharedModule,
  ]
} )
export class DependencyModule { }
