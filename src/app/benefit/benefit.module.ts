import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { DataTablesModule } from 'angular-datatables';

import { BackButtonDirective } from '../shared/directives/back-button-directive.directive';
import { BenefitRoutingModule } from './benefit-routing.module';
import { CreateComponent } from './pages/create/create.component';
import { IndexComponent } from './pages/index/index.component';
import { ShowComponent } from './pages/show/show.component';

@NgModule( {
  declarations: [
    BackButtonDirective,
    CreateComponent,
    IndexComponent,
    ShowComponent,
  ],
  imports: [
    BenefitRoutingModule,
    CommonModule,
    DataTablesModule,
    ReactiveFormsModule
  ]
} )
export class BenefitModule { }
