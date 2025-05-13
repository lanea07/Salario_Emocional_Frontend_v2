import { AfterViewInit, ChangeDetectorRef, Component, OnChanges, SimpleChanges } from '@angular/core';

import { LoadingBarService } from '@ngx-loading-bar/core';

import { BenefitUser, BenefitUserElement } from 'src/app/benefit-user/interfaces/benefit-user.interface';
import { BenefitUserService } from '../../../../services/benefit-user.service';
import { MessageService } from 'primeng/api';

@Component( {
    selector: 'my-benefits',
    templateUrl: './my-benefits.component.html',
    styles: [],
    standalone: false
} )
export class MyBenefitsComponent implements AfterViewInit, OnChanges {

  benefitUser?: BenefitUser;
  calendarData: BenefitUserElement[] = [];
  loaded: boolean = false;
  loader = this.lbs.useRef();
  year?: number;

  constructor (
    private benefitUserService: BenefitUserService,
    private changeDetectorRef: ChangeDetectorRef,
    private lbs: LoadingBarService,
    private ms: MessageService,
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
      this.loaded = false;
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
          error: ( { error } ) => this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } )
        } );
    }
  }
}
