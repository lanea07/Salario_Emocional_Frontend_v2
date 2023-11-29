import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { BenefitUserElement } from 'src/app/benefit-user/interfaces/benefit-user.interface';

@Component( {
  selector: 'mi-horario-flexible',
  templateUrl: './mi-horario-flexible.component.html',
  styles: []
} )
export class MiHorarioFlexibleComponent implements OnChanges {

  @Input() data?: BenefitUserElement[];
  dataArray?: any[];

  ngOnChanges ( changes: SimpleChanges ): void {
    this.dataArray = this.data?.map( ( item: BenefitUserElement ) => {
      let month = new Date( item.benefit_begin_time ).getMonth() + 1;
      return month >= 1 && month <= 3
        ? 'Trimestre 1: ' + item.benefit_detail.name
        : month >= 4 && month <= 6
          ? 'Trimestre 2: ' + item.benefit_detail.name
          : month >= 7 && month <= 9
            ? 'Trimestre 3: ' + item.benefit_detail.name
            : 'Trimestre 4: ' + item.benefit_detail.name;
    } );
  }

}
