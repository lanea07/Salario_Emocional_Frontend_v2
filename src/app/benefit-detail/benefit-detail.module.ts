import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BenefitDetailRoutingModule } from './benefit-detail-routing.module';
import { IndexComponent } from './pages/index/index.component';
import { ShowComponent } from './pages/show/show.component';
import { CreateComponent } from './pages/create/create.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule( {
  declarations: [
    IndexComponent,
    ShowComponent,
    CreateComponent
  ],
  imports: [
    CommonModule,
    BenefitDetailRoutingModule,
    ReactiveFormsModule
  ]
} )
export class BenefitDetailModule { }
