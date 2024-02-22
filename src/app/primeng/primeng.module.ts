import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { TabViewModule } from 'primeng/tabview';
import { ToolbarModule } from 'primeng/toolbar';
import { TreeSelectModule } from 'primeng/treeselect';

@NgModule( {
  declarations: [],
  imports: [
    CommonModule,
    CalendarModule,
    DialogModule,
    DropdownModule,
    InputTextareaModule, 
    InputTextModule,
    PanelModule,
    TabViewModule,
    TreeSelectModule,
  ],
  exports: [
    CalendarModule,
    DialogModule,
    DropdownModule,
    InputTextareaModule,
    InputTextModule,
    PanelModule,
    TabViewModule,
    ToolbarModule,
    TreeSelectModule,
  ]
} )
export class PrimengModule { }
