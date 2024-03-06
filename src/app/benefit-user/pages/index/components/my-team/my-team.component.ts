import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';

import { LoadingBarService } from '@ngx-loading-bar/core';

import { BenefitUserService } from 'src/app/benefit-user/services/benefit-user.service';
import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';
import { BenefitUser, BenefitUserElement } from '../../../../interfaces/benefit-user.interface';
import { MessagingService } from '../../../../services/messaging.service';

@Component( {
  selector: 'my-team',
  templateUrl: './my-team.component.html',
  styles: [
  ]
} )
export class MyTeamComponent implements AfterViewInit, OnChanges, OnInit, OnDestroy {

  calendarData: BenefitUserElement[] = [];
  loader = this.lbs.useRef();
  year?: number;

  constructor (
    private as: AlertService,
    private benefitUserService: BenefitUserService,
    private changeDetectorRef: ChangeDetectorRef,
    private lbs: LoadingBarService,
    private messagingService: MessagingService,
  ) { }

  ngOnInit (): void {
    this.messagingService.message
      .subscribe( {
        next: ( { mustRefresh } ) => mustRefresh && this.getBenefitDetail( this.year )
      } )
  }

  ngOnDestroy (): void {
    this.messagingService.message.unsubscribe();
  }

  ngAfterViewInit (): void {
    this.changeDetectorRef.detectChanges();
    this.getBenefitDetail( this.year );
  }

  ngOnChanges (): void {
    this.getBenefitDetail( this.year );
  }

  getBenefitDetail ( event?: any ) {
    if ( event ) {
    this.loader.start();
      this.year = event;
      this.benefitUserService.indexCollaborators( this.year! )
      .subscribe( {
        next: ( benefitUser ) => {
          this.calendarData = [];
          this.calendarData = benefitUser[ 0 ].descendants_and_self.flatMap( user => user.benefit_user );
          this.loader.complete();
        },
        error: ( { error } ) => {
          this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.message )
        }
      } );
    }
  }
}
