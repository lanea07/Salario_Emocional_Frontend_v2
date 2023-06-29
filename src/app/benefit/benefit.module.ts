import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BenefitRoutingModule } from './benefit-routing.module';
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
    BenefitRoutingModule,
    ReactiveFormsModule
  ]
} )
export class BenefitModule { }
