import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { BenefitUser, UserBenefit } from 'src/app/benefit-user/interfaces/benefit-user.interface';

@Component( {
  selector: 'benefit-detail-container ',
  templateUrl: './benefit-detail-container.component.html',
  styles: ``
} )
export class BenefitDetailContainerComponent implements OnChanges {

  @Input() data?: BenefitUser;

  userBenefits?: UserBenefit[];

  ngOnChanges ( changes: SimpleChanges ): void {
    if ( this.data ) {
      const group: UserBenefit[] = this.data!.benefit_user.reduce( ( group: any, benefitUserElement: any ) => {
        const { benefits } = benefitUserElement;
        group[ benefits.name ] = group[ benefits.name ] || [];
        group[ benefits.name ].push( benefitUserElement );
        return group;
      }, {} );
      this.userBenefits = group;
    }
  }
}
