import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChartData } from 'chart.js';

import { BenefitUserElement } from 'src/app/benefit-user/interfaces/benefit-user.interface';

@Component( {
  selector: 'mi-banco-de-horas',
  templateUrl: './mi-banco-de-horas.component.html',
  styles: [],
} )
export class MiBancoDeHorasComponent implements OnInit, OnChanges {

  @Input() data: BenefitUserElement[] = [];
  dataArray: any[] = [];
  barChartData: any;
  barChartOptions: any;
  doughnutChartData: any;
  doughnutChartOptions: any;

  ngOnInit (): void {
    this.barChartOptions = {
      responsive: true,
      scales: {
        x: {
          grid: {
            drawBorder: false
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            drawBorder: false
          }
        },
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
    this.doughnutChartOptions = {
      cutout: '60%',
    };
  }

  ngOnChanges ( changes: SimpleChanges ): void {
    let barChartDatasets: any[] = [];
    let dougnutChartDatasets: any[] = [];

    // BarChart Data
    let data: number[] = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
    this.data?.map( ( item: BenefitUserElement ) => {
      data[ new Date( item.benefit_begin_time ).getMonth() ] += item.benefit_detail.time_hours || 0;
    } );
    barChartDatasets = [ {
      data: data,
      label: 'Horas',
      backgroundColor: "rgba(200, 16, 46, 0.5)"
    } ];
    this.barChartData = {
      labels: [ 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', "Dic" ],
      datasets: barChartDatasets,
    }

    // //DoughnutChart Data
    let hours = 0;
    this.data?.map( ( item: BenefitUserElement ) => hours += item.benefit_detail.time_hours );
    dougnutChartDatasets = [ {
      data: [ hours, 16 - hours ],
      backgroundColor: [ "#C8102E", "gray" ],
      hoverBackgroundColor: [ "#D8102E", "darkgray" ]
    } ];

    this.doughnutChartData = {
      labels: [ 'Usadas', 'Disponibles' ],
      datasets: dougnutChartDatasets,
    }

    // this.dataArray = this.data?.map( ( item: BenefitUserElement ) => {
    //   return new Date( item.benefit_begin_time ).toLocaleDateString( 'es-CO', { year: 'numeric', month: 'long', day: 'numeric' } ) + ': ' + item.benefit_detail.name;
    // } );
  }

}
