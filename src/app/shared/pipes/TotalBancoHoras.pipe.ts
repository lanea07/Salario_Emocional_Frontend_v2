import { Pipe, PipeTransform } from '@angular/core';

import { BenefitUserElement } from 'src/app/benefit-user/interfaces/benefit-user.interface';

@Pipe( {
  name: 'sum'
} )
export class TotalBancoHorasPipe implements PipeTransform {

  transform ( value: BenefitUserElement[] | undefined ): number {
    let valor = value!.reduce( ( a, b ) => a + b.benefit_detail.time_hours!, 0 );
    return ( value ) ? value!.reduce( ( a, b ) => a + b.benefit_detail.time_hours!, 0 ) : 0;
  }

}
