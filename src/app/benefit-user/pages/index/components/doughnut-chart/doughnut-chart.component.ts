import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

import { ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component( {
  selector: 'doughnut-chart-component',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: []
} )
export class DoughnutChartComponent implements OnChanges {

  @ViewChild( BaseChartDirective ) chart?: BaseChartDirective;
  @Input() data?: number;

  ngOnChanges ( changes: SimpleChanges ): void {
    this.doughnutChartData.datasets[ 0 ].data = [ this.data!, 16 - this.data! ];
    this.chart?.chart?.update();
  }

  // Doughnut
  public doughnutChartLabels: string[] = [ 'Usadas', 'Disponibles' ];
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      {
        data: [ this.data!, 16 - this.data! ],
        backgroundColor: [ "#C8102E", "gray" ],
        hoverBackgroundColor: [ "#D8102E", "darkgray" ]
      },
    ]
  };
  public doughnutChartType: ChartType = 'doughnut';

  // events
  // public chartClicked ( { event, active }: { event: ChartEvent, active: {}[] } ): void {
  //   console.log( event, active );
  // }

  // public chartHovered ( { event, active }: { event: ChartEvent, active: {}[] } ): void {
  //   console.log( event, active );
  // }

}
