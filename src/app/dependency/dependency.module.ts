import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


import { DependencyRoutingModule } from './dependency-routing.module';
import { CreateComponent } from './pages/create/create.component';
import { IndexComponent } from './pages/index/index.component';
import { ShowComponent } from './pages/show/show.component';
import { DataTablesModule } from 'angular-datatables';
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
    DependencyRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
} )
export class DependencyModule { }
