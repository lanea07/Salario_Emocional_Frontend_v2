import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CalendarModule } from 'primeng/calendar';
import { ChartModule } from 'primeng/chart';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PanelModule } from 'primeng/panel';
import { TabViewModule } from 'primeng/tabview';
import { ToolbarModule } from 'primeng/toolbar';
import { TreeSelectModule } from 'primeng/treeselect';


@NgModule( {
  declarations: [],
  imports: [
    CalendarModule,
    ChartModule,
    CommonModule,
    DialogModule,
    DropdownModule,
    DynamicDialogModule,
    InputTextareaModule, 
    InputTextModule,
    PanelModule,
    TabViewModule,
    TreeSelectModule,
  ],
  exports: [
    CalendarModule,
    ChartModule,
    DialogModule,
    DropdownModule,
    DynamicDialogModule,
    InputTextareaModule,
    InputTextModule,
    PanelModule,
    TabViewModule,
    ToolbarModule,
    TreeSelectModule,
  ]
} )
export class PrimengModule { }
