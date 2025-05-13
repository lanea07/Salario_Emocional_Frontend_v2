import { Component, Input, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BenefitUserElement } from 'src/app/benefit-user/interfaces/benefit-user.interface';
import { Benefit } from 'src/app/benefit/interfaces/benefit.interface';
import { BenefitService } from 'src/app/benefit/services/benefit.service';
import { DefaultPreferences } from 'src/app/shared/interfaces/Preferences.interface';
import { HelpersService } from 'src/app/shared/services/helpers.service';

@Component( {
    selector: 'benefit-detail',
    templateUrl: './benefit-detail.component.html',
    styles: ``,
    standalone: false
} )
export class BenefitDetailComponent {

  @Input() data?: any;

  barChartData: any;
  barChartOptions: any;
  benefit?: Benefit;
  benefitSettings?: DefaultPreferences[] = [];
  userBenefits: any;
  doughnutChartData: any;
  doughnutChartOptions: any;
  uses_barchart: boolean = false;
  uses_doughnutchart: boolean = false;
  max_allowed_hours: number = 0;

  constructor (
    public activatedRoute: ActivatedRoute,
    private benefitService: BenefitService,
    public helpers: HelpersService,
  ) { }

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
    this.benefit = this.data[ 0 ].benefits;
    this.userBenefits = this.data?.map( ( item: BenefitUserElement ) => {
      return {
        'benefit': item,
        'value': new Date( item.benefit_begin_time ).toLocaleDateString( 'es-CO', { year: 'numeric', month: 'long', day: 'numeric' } ) + ': ' + item.benefit_detail.name
      };
    } );
    this.benefitService.showSettings( this.benefit!.id )
      .subscribe( ( data: DefaultPreferences ) => {
        this.benefitSettings = data[ 0 ];
        this.uses_barchart = ( this.benefitSettings as { [ key: string ]: any } )[ 'uses_barchart' ];
        this.uses_doughnutchart = ( this.benefitSettings as { [ key: string ]: any } )[ 'uses_doughnutchart' ];
        this.max_allowed_hours = ( this.benefitSettings as { [ key: string ]: any } )[ 'max_allowed_hours' ];
        if ( this.uses_barchart ) {
          this.prepareBarChart( this.data );
        }
        if ( this.uses_doughnutchart ) {
          this.prepareDoughnutChart( this.data );
        }
      } );
  }

  prepareBarChart ( data: any ): void {
    let barChartDatasets: any[] = [];
    let barChartData: number[] = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
    data?.map( ( item: BenefitUserElement ) => {
      barChartData[ new Date( item.benefit_begin_time ).getMonth() ] += item.benefit_detail.time_hours || 0;
    } );
    barChartDatasets = [ {
      data: barChartData,
      label: 'Horas',
      backgroundColor: "rgba(200, 16, 46, 0.3)",
      borderColor: "rgba(200, 16, 46, 1)",
      borderWidth: 1,
    } ];
    this.barChartData = {
      labels: [ 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', "Dic" ],
      datasets: barChartDatasets,
    }
  }

  prepareDoughnutChart ( data: any ): void {
    let dougnutChartDatasets: any[] = [];
    let hours = 0;
    data?.map( ( item: BenefitUserElement ) => hours += item.benefit_detail.time_hours );
    dougnutChartDatasets = [ {
      data: [ hours, this.max_allowed_hours - hours ],
      backgroundColor: [ "#C8102E", "gray" ],
      hoverBackgroundColor: [ "#D8102E", "darkgray" ]
    } ];
    this.doughnutChartData = {
      labels: [ 'Usadas', 'Disponibles' ],
      datasets: dougnutChartDatasets,
    }
  }
}
