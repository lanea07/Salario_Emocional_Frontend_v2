import { AfterViewInit, ChangeDetectorRef, Component, OnChanges, SimpleChanges } from '@angular/core';

import { LoadingBarService } from '@ngx-loading-bar/core';

import { BenefitUser, BenefitUserElement } from 'src/app/benefit-user/interfaces/benefit-user.interface';
import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';
import { BenefitUserService } from '../../../../services/benefit-user.service';
import { UserBenefit } from '../../../../interfaces/benefit-user.interface';

@Component( {
  selector: 'my-benefits',
  templateUrl: './my-benefits.component.html',
  styles: []
} )
export class MyBenefitsComponent implements AfterViewInit, OnChanges {

  benefitUser?: BenefitUser;
  calendarData: BenefitUserElement[] = [];
  loaded: boolean = false;
  loader = this.lbs.useRef();
  year?: number;

  constructor (
    private as: AlertService,
    private benefitUserService: BenefitUserService,
    private changeDetectorRef: ChangeDetectorRef,
    private lbs: LoadingBarService,
  ) { }

  ngOnChanges ( changes: SimpleChanges ): void {
    this.getBenefitDetail( this.year );
  }

  ngAfterViewInit (): void {
    this.changeDetectorRef.detectChanges();
    this.getBenefitDetail( this.year );
  }

  getBenefitDetail ( event?: any ) {
    if ( event ) {
      this.year = event;
      this.loader.start();
      this.benefitUserService.index( Number.parseInt( localStorage.getItem( 'uid' )! ), this.year! )
        .subscribe( {
          next: ( benefitUser ) => {
            this.calendarData = [];
            this.calendarData = benefitUser[ 0 ].benefit_user;
            this.benefitUser = benefitUser[ 0 ];
            this.loaded = true;
            this.loader.complete();
          },
          error: ( { error } ) => this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.message )
        } );
    }
  }
}
