import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { DataTablesModule } from 'angular-datatables';

import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { BackButtonDirective } from '../shared/directives/back-button-directive.directive';
import { CreateComponent } from './pages/create/create.component';
import { IndexComponent } from './pages/index/index.component';
import { ShowComponent } from './pages/show/show.component';
import { UserRoutingModule } from './user-routing.module';


@NgModule( {
  declarations: [
    BackButtonDirective,
    CreateComponent,
    IndexComponent,
    ShowComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    DataTablesModule,
    ReactiveFormsModule,
    UserRoutingModule
  ]
} )
export class UserModule { }
