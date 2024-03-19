import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';

import { LoadingBarService } from '@ngx-loading-bar/core';

import { BenefitUserService } from 'src/app/benefit-user/services/benefit-user.service';
import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';
import { BenefitUser, BenefitUserElement } from '../../../../interfaces/benefit-user.interface';
import { MessagingService } from '../../../../services/messaging.service';
import { Benefit } from 'src/app/benefit/interfaces/benefit.interface';
import { combineLatest } from 'rxjs';
import { BenefitService } from 'src/app/benefit/services/benefit.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component( {
  selector: 'my-team',
  templateUrl: './my-team.component.html',
  styles: [
  ]
} )
export class MyTeamComponent implements AfterViewInit, OnChanges, OnDestroy {

  benefits: Benefit[] = [];
  calendarData: BenefitUserElement[] = [];
  loaded: boolean = false;
  loader = this.lbs.useRef();
  year?: number;

  form: FormGroup = this.fb.group( {
    benefit: [],
    filterValue: [],
  } );

  constructor (
    private as: AlertService,
    private benefitService: BenefitService,
    private benefitUserService: BenefitUserService,
    private changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private lbs: LoadingBarService,
    private messagingService: MessagingService,
  ) { }

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
      this.loaded = false;
      this.loader.start();
      this.year = event;
      combineLatest( {
        benefits: this.benefitService.index(),
        benefitUser: this.benefitUserService.indexCollaborators( this.year!, this.form.value.benefit )
      } )
      .subscribe( {
        next: ( { benefits, benefitUser } ) => {
          this.calendarData = [];
          this.calendarData = benefitUser[ 0 ].descendants_and_self.flatMap( user => user.benefit_user );
          this.benefits = benefits;
          this.loaded = true;
          this.loader.complete();
        },
        error: ( { error } ) => {
          this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.message )
        }
      } );
    }
  }
}