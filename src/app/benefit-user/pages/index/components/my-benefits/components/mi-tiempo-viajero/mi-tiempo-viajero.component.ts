import { Component, Input, SimpleChanges } from '@angular/core';

import { BenefitUserElement } from 'src/app/benefit-user/interfaces/benefit-user.interface';

@Component( {
  selector: 'mi-tiempo-viajero',
  templateUrl: './mi-tiempo-viajero.component.html',
  styles: [
  ]
} )
export class MiTiempoViajeroComponent {

  @Input() data?: BenefitUserElement[];
  dataArray?: any[];

  ngOnChanges ( changes: SimpleChanges ): void {
    this.dataArray = this.data?.map( ( item: BenefitUserElement ) => {
      return new Date( item.benefit_begin_time ).toLocaleDateString( 'es-CO', { year: 'numeric', month: 'long', day: 'numeric' } ) + ': ' + item.benefit_detail.name;
    } );
  }

}
