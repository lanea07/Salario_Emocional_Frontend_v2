import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { PrimengModule } from '../primeng/primeng.module';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { ContainerComponent } from './container/container.component';
import { OffcanvasComponent } from './offcanvas/offcanvas.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ViewAllBenefitUserComponent } from './view-all-benefit-user/view-all-benefit-user.component';

@NgModule( {
  declarations: [
    ViewAllBenefitUserComponent,
    ContainerComponent,
    SidebarComponent,
    OffcanvasComponent,
  ],
  imports: [
    AdminRoutingModule,
    CommonModule,
    DataTablesModule,
    PrimengModule,
    ReactiveFormsModule,
    SharedModule
  ]
} )
export class AdminModule { }
