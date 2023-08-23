import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { DataTablesModule } from 'angular-datatables';

import { BenefitDetailRoutingModule } from './benefit-detail-routing.module';
import { IndexComponent } from './pages/index/index.component';
import { ShowComponent } from './pages/show/show.component';
import { CreateComponent } from './pages/create/create.component';
import { BackButtonDirective } from '../shared/directives/back-button-directive.directive';


@NgModule( {
  declarations: [
    CreateComponent,
    BackButtonDirective,
    IndexComponent,
    ShowComponent,
  ],
  imports: [
    BenefitDetailRoutingModule,
    CommonModule,
    DataTablesModule,
    ReactiveFormsModule
  ]
} )
export class BenefitDetailModule { }
