import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DataTablesModule } from 'angular-datatables';

import { NgZorroAntdModule } from '../ng-zorro/ng-zorro-antd/ng-zorro-antd.module';
import { SharedModule } from '../shared/shared.module';
import { NgZorroTreeviewComponent } from './components/ng-zorro-treeview/ng-zorro-treeview.component';
import { NzTreeSelectComponent } from './components/tree-select/tree-select.component';
import { DependencyRoutingModule } from './dependency-routing.module';
import { CreateComponent } from './pages/create/create.component';
import { IndexComponent } from './pages/index/index.component';
import { ShowComponent } from './pages/show/show.component';


@NgModule( {
  declarations: [
    CreateComponent,
    IndexComponent,
    ShowComponent,
    NzTreeSelectComponent,
    NgZorroTreeviewComponent,
  ],
  imports: [
    CommonModule,
    DataTablesModule,
    DependencyRoutingModule,
    FormsModule,
    NgZorroAntdModule,
    ReactiveFormsModule,
    SharedModule,
  ]
} )
export class DependencyModule { }
