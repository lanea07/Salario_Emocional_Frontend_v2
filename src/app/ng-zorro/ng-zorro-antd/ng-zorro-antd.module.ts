import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';


@NgModule( {
  imports: [
    NzDatePickerModule
  ],
  exports: [
    NzDatePickerModule
  ]
} )
export class NgZorroAntdModule {

}