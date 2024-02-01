import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { BaseChartDirective } from 'ng2-charts';

@Component( {
  selector: 'bar-chart-component',
  templateUrl: './bar-chart.component.html',
  styles: [],
} )
export class BarChartComponent implements OnChanges {

  @ViewChild( BaseChartDirective ) chart?: BaseChartDirective;
  @Input() barChartData: ChartData<'bar'> = {
    datasets: [],
    labels: [],
  };

  public barChartOptions: ChartConfiguration[ 'options' ] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {}
    },
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        anchor: 'end',
        align: 'end'
      }
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [
    DataLabelsPlugin
  ];

  ngOnChanges ( changes: SimpleChanges ): void {
    let max = Math.max( ...this.barChartData.datasets.map( dataset => Math.max( ...dataset.data as number[] ) ) )
    this.barChartOptions!.scales = {
      y: {
        max: ( ( Math.ceil( max / 5 ) ) * 5 ) + 5,
        ticks: {
          stepSize: ( Math.ceil( max / 5 ) )
        }
      }
    }
  }

}
