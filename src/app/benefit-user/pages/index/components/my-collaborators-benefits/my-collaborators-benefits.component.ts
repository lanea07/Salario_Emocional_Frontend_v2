import { AfterContentInit, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BenefitUser, BenefitUserElement } from 'src/app/benefit-user/interfaces/benefit-user.interface';
import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';
import { BenefitUserService } from '../../../../services/benefit-user.service';
import { MessagingService } from 'src/app/benefit-user/services/messaging.service';
import { LoadingBarService } from '@ngx-loading-bar/core';

@Component( {
  selector: 'my-collaborators-benefits',
  templateUrl: './my-collaborators-benefits.component.html',
  styles: []
} )
export class MyCollaboratorsBenefitsComponent implements OnInit, OnChanges, OnDestroy, AfterContentInit {

  calendarData: BenefitUserElement[] = [];
  collaborators: BenefitUser[] = [];
  currentUser?: any = null;
  formGroup: FormGroup = this.fb.group( {
    user_id: [ '', Validators.required ],
  } );
  loaded: boolean = true;
  loader = this.lbs.useRef();
  year?: number;

  constructor (
    private as: AlertService,
    private benefitUserService: BenefitUserService,
    private changeDetectorRef: ChangeDetectorRef,
    private lbs: LoadingBarService,
    private messagingService: MessagingService,
    private fb: FormBuilder,
  ) { }

  ngOnInit (): void {
    this.getBenefitDetail( this.year );
    this.messagingService.message
      .subscribe( {
        next: ( { mustRefresh } ) => mustRefresh && this.getBenefitDetail( this.year )
      } )
  }

  ngOnChanges ( changes: SimpleChanges ): void {
    this.loaded = false;
    this.getBenefitDetail( this.year );
  }

  ngOnDestroy (): void {
    this.messagingService.message.unsubscribe();
  }

  ngAfterContentInit (): void {
    this.changeDetectorRef.detectChanges();
  }

  getBenefitDetail ( event?: any ) {
    if ( event ) {
      this.year = event;
      this.loader.start();
      this.benefitUserService.indexCollaborators( this.year! )
        .subscribe( {
          next: ( benefitUser ) => {
            this.loaded = true;
            if ( !benefitUser[ 0 ].descendants_and_self ) return;
            this.collaborators = benefitUser[ 0 ].descendants_and_self.filter( ( user ) => {
              return user.id !== Number.parseInt( localStorage.getItem( 'uid' )! );
            } );
            this.collaborators.sort( ( a, b ) => a.name.localeCompare( b.name ) );
            this.fillBenefits();
            this.loader.complete();
          },
          error: ( { error } ) => this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.message )
        } );
    }
  }

  fillBenefits () {
    this.currentUser = this.collaborators.find( user => user.id === this.formGroup.value.user_id );
    if ( this.currentUser ) {
      this.calendarData = [];
      this.calendarData = this.currentUser.benefit_user;
    }
    this.loaded = true;
  }

}
