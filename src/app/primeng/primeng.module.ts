import { NgModule } from '@angular/core';

import { AccordionModule } from 'primeng/accordion';
import { DatePickerModule } from 'primeng/datepicker';
import { ChartModule } from 'primeng/chart';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { SkeletonModule } from 'primeng/skeleton';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TreeSelectModule } from 'primeng/treeselect';
import { TextareaModule } from 'primeng/textarea';


@NgModule( {
  declarations: [],
  imports: [],
  exports: [
    AccordionModule,
    DatePickerModule,
    ChartModule,
    ConfirmDialogModule,
    DialogModule,
    SelectModule,
    DynamicDialogModule,
    TextareaModule,
    InputTextModule,
    PanelModule,
    SkeletonModule,
    TabMenuModule,
    TabViewModule,
    ToastModule,
    ToolbarModule,
    TooltipModule,
    TreeSelectModule,
  ]
} )
export class PrimengModule { }
