import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { BaseChartDirective } from 'ng2-charts';
import { BenefitUserElement } from 'src/app/benefit-user/interfaces/benefit-user.interface';

@Component( {
  selector: 'bar-chart-component',
  templateUrl: './bar-chart.component.html',
  styles: [],
} )
export class BarChartComponent implements OnChanges {

  @Input() data?: number[];
  @ViewChild( BaseChartDirective ) chart?: BaseChartDirective;


  public barChartOptions: ChartConfiguration[ 'options' ] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        max: 16,
        ticks: {
          stepSize: 0
        }
      }
    },
    plugins: {
      legend: {
        display: true,
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

  public barChartData: ChartData<'bar'> = {
    labels: [ 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic' ],
    datasets: [
      { data: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], label: 'Horas', backgroundColor: "rgba(200, 16, 46, 0.5)" },
    ]
  };

  ngOnChanges ( changes: SimpleChanges ): void {
    this.barChartData.datasets[ 0 ].data = this.data!;
    this.chart?.update();
  }

}
