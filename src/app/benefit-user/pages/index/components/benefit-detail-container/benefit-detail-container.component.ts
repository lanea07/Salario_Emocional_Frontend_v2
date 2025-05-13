import { ChangeDetectorRef, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

import { BenefitUser, UserBenefit } from 'src/app/benefit-user/interfaces/benefit-user.interface';

@Component( {
    selector: 'benefit-detail-container ',
    templateUrl: './benefit-detail-container.component.html',
    styles: [],
    standalone: false
} )
export class BenefitDetailContainerComponent implements OnChanges {

  @Input() data?: BenefitUser;
  @ViewChild( 'avatar' ) avatar!: ElementRef<any>;

  userBenefits?: UserBenefit[];

  constructor (
    private changeDetector: ChangeDetectorRef,
  ) { }

  ngOnChanges ( changes: SimpleChanges ): void {
    if ( this.data ) {
      const group = this.data!.benefit_user.reduce( ( group: any, benefitUserElement: any ) => {
        const { benefits } = benefitUserElement;
        group[ benefits.name ] = group[ benefits.name ] || [];
        group[ benefits.name ].push( benefitUserElement );
        return group;
      }, {} );
      this.userBenefits = group;
    }
    this.changeDetector.detectChanges();
  }

}
