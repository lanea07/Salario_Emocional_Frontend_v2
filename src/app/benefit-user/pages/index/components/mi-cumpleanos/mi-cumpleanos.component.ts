import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { BenefitUserElement } from 'src/app/benefit-user/interfaces/benefit-user.interface';

@Component( {
  selector: 'mi-cumpleanos',
  templateUrl: './mi-cumpleanos.component.html',
  styles: [
  ]
} )
export class MiCumpleanosComponent implements OnChanges {

  @Input() data: BenefitUserElement[] = [];
  dataArray: any[] = [];

  ngOnChanges ( changes: SimpleChanges ): void {
    this.dataArray = this.data?.map( ( item: BenefitUserElement ) => {
      return new Date( item.benefit_begin_time ).toLocaleDateString( 'es-CO', { year: 'numeric', month: 'long', day: 'numeric' } );
    } );
  }

}
