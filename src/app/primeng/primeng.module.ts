import { NgModule } from '@angular/core';

import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
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
    ButtonModule,
    DatePickerModule,
    ChartModule,
    CheckboxModule,
    ConfirmDialogModule,
    DialogModule,
    DynamicDialogModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    PanelModule,
    SelectModule,
    SkeletonModule,
    TableModule,
    TabMenuModule,
    TabViewModule,
    TextareaModule,
    ToastModule,
    ToolbarModule,
    TooltipModule,
    TreeSelectModule,
  ]
} )
export class PrimengModule { }
