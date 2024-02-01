import { NgModule } from '@angular/core';

import { ChartsModule } from '../charts/charts.module';
import { PrimengModule } from '../primeng/primeng.module';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { ContainerComponent } from './container/container.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ViewAllBenefitUserComponent } from './view-all-benefit-user/view-all-benefit-user.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';

@NgModule( {
  declarations: [
    ViewAllBenefitUserComponent,
    ContainerComponent,
    SidebarComponent,
  ],
  imports: [
    AdminRoutingModule,
    CommonModule,
    ChartsModule,
    DataTablesModule,
    PrimengModule,
    ReactiveFormsModule,
    SharedModule
  ]
} )
export class AdminModule { }
