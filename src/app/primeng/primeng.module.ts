import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { PanelModule } from 'primeng/panel';
import { TreeSelectModule } from 'primeng/treeselect';

@NgModule( {
  declarations: [],
  imports: [
    CommonModule,
    CalendarModule,
    DialogModule,
    DropdownModule,
    PanelModule,
    TreeSelectModule
  ],
  exports: [
    CalendarModule,
    DialogModule,
    DropdownModule,
    PanelModule,
    TreeSelectModule
  ]
} )
export class PrimengModule { }
