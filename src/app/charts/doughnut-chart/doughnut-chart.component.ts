import { Component, Input, ViewChild } from '@angular/core';

import { ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component( {
  selector: 'doughnut-chart-component',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: []
} )
export class DoughnutChartComponent {

  @ViewChild( BaseChartDirective ) chart?: BaseChartDirective;
  @Input() doughnutChartData: ChartData<'doughnut'> = {
    datasets: [],
    labels: [],
  }
  @Input() doughnutChartLabels: string[] = [];

  public doughnutChartType: ChartType = 'doughnut';

}
