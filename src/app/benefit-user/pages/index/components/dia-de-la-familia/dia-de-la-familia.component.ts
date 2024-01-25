import { Component, Input, SimpleChanges } from '@angular/core';

import { BenefitUserElement } from 'src/app/benefit-user/interfaces/benefit-user.interface';

@Component( {
  selector: 'dia-de-la-familia',
  templateUrl: './dia-de-la-familia.component.html',
  styles: [
  ]
} )
export class DiaDeLaFamiliaComponent {

  @Input() data: BenefitUserElement[] = [];
  dataArray: any[] = [];

  ngOnChanges ( changes: SimpleChanges ): void {
    this.dataArray = this.data.map( ( item: BenefitUserElement ) => {
      return new Date( item.benefit_begin_time ).toLocaleDateString( 'es-CO', { year: 'numeric', month: 'long', day: 'numeric' } );
    } );
  }

}
