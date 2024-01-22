import { Component, Input, SimpleChanges } from '@angular/core';

import { BenefitUserElement } from 'src/app/benefit-user/interfaces/benefit-user.interface';

@Component( {
  selector: 'mi-horario-alternancia',
  templateUrl: './mi-horario-alternancia.component.html',
  styles: [
  ]
} )
export class MiHorarioAlternanciaComponent {

  @Input() data?: BenefitUserElement[];
  dataArray?: any[];

  ngOnChanges ( changes: SimpleChanges ): void {
    this.dataArray = this.data?.map( ( item: BenefitUserElement ) => {
      return item.benefit_detail.name;
    } );
  }

}
