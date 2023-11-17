import { NgModule } from '@angular/core';

import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';



@NgModule( {
  imports: [
    NzDatePickerModule,
    NzTreeSelectModule,
    NzTreeViewModule
  ],
  exports: [
    NzDatePickerModule,
    NzTreeSelectModule,
    NzTreeViewModule,
  ]
} )
export class NgZorroAntdModule {

}