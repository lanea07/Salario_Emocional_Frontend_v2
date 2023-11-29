import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { BenefitUserElement } from 'src/app/benefit-user/interfaces/benefit-user.interface';

@Component( {
  selector: 'mi-banco-de-horas',
  templateUrl: './mi-banco-de-horas.component.html',
  styles: [],
} )
export class MiBancoDeHorasComponent implements OnChanges {

  @Input() data?: BenefitUserElement[];
  dataArray?: any[];
  barChartData!: number[];
  doughutChartData!: number;

  ngOnChanges ( changes: SimpleChanges ): void {
    let data: number[] = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
    this.data?.map( ( item: BenefitUserElement ) => {
      data[ new Date( item.benefit_begin_time ).getMonth() ] += item.benefit_detail.time_hours || 0;
    } );
    this.barChartData = data;

    let hours = 0;
    this.data?.map( ( item: BenefitUserElement ) => {
      hours += item.benefit_detail.time_hours;
    } );
    this.doughutChartData = hours;

    this.dataArray = this.data?.map( ( item: BenefitUserElement ) => {
      return new Date( item.benefit_begin_time ).toLocaleDateString( 'es-CO', { year: 'numeric', month: 'long', day: 'numeric' } ) + ': ' + item.benefit_detail.name;
    } );
  }

}
