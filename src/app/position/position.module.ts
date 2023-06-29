import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PositionRoutingModule } from './position-routing.module';
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
    PositionRoutingModule,
    ReactiveFormsModule
  ]
} )
export class PositionModule { }
