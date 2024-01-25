import { Component, Input, SimpleChanges } from '@angular/core';

import { BenefitUserElement } from 'src/app/benefit-user/interfaces/benefit-user.interface';

@Component( {
  selector: 'trabajo-hibrido',
  templateUrl: './trabajo-hibrido.component.html',
  styles: [
  ]
} )
export class TrabajoHibridoComponent {

  @Input() data: BenefitUserElement[] = [];
  dataArray: any[] = [];

  ngOnChanges ( changes: SimpleChanges ): void {
    this.dataArray = this.data?.map( ( item: BenefitUserElement ) => {
      return item.benefit_detail.name;
    } );
  }

}
