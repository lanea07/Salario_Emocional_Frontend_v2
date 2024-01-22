import { Component, Input, SimpleChanges } from '@angular/core';

import { BenefitUserElement } from 'src/app/benefit-user/interfaces/benefit-user.interface';

@Component( {
  selector: 'mis-vacaciones',
  templateUrl: './mis-vacaciones.component.html',
  styles: [
  ]
} )
export class MisVacacionesComponent {

  @Input() data?: BenefitUserElement[];
  dataArray?: any[];

  ngOnChanges ( changes: SimpleChanges ): void {
    this.dataArray = this.data?.map( ( item: BenefitUserElement ) => {
      return item;
    } );
  }

}
