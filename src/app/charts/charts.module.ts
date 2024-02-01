import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgChartsModule } from 'ng2-charts';
import { DoughnutChartComponent } from './doughnut-chart/doughnut-chart.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';

@NgModule( {
  declarations: [
    BarChartComponent,
    DoughnutChartComponent,
  ],
  imports: [
    CommonModule,
    NgChartsModule,
  ],
  exports: [
    BarChartComponent,
    DoughnutChartComponent,
  ],
} )
export class ChartsModule { }
