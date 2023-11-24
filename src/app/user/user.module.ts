import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { DataTablesModule } from 'angular-datatables';

// import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { CreateComponent } from './pages/create/create.component';
import { IndexComponent } from './pages/index/index.component';
import { ShowComponent } from './pages/show/show.component';
import { UserRoutingModule } from './user-routing.module';
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
    ReactiveFormsModule,
    UserRoutingModule,
    SharedModule
  ]
} )
export class UserModule { }
