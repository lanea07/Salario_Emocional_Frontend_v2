import { AfterContentInit, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BenefitUser, BenefitUserElement } from 'src/app/benefit-user/interfaces/benefit-user.interface';
import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';
import { BenefitUserService } from '../../../../services/benefit-user.service';
import { MessagingService } from 'src/app/benefit-user/services/messaging.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { be } from 'date-fns/locale';
import { UserService } from 'src/app/user/services/user.service';
import { User } from 'src/app/user/interfaces/user.interface';

@Component( {
  selector: 'my-collaborators-benefits',
  templateUrl: './my-collaborators-benefits.component.html',
  styles: []
} )
export class MyCollaboratorsBenefitsComponent implements OnInit, OnChanges, OnDestroy, AfterContentInit {

  calendarData: BenefitUserElement[] = [];
  collaborators: User[] = [];
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
    private fb: FormBuilder,
    private lbs: LoadingBarService,
    private messagingService: MessagingService,
    private userService: UserService,
  ) { }

  ngOnInit (): void {
    this.getBenefitDetail( this.year );
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
      this.userService.userDescendants()
        .subscribe( {
          next: ( currentUser ) => {
            this.loaded = true;
            if ( !currentUser ) {
              this.loader.complete();
              return;
            };
            this.collaborators = currentUser[ 0 ].descendants.filter( ( user ) => {
              return user.id !== Number.parseInt( localStorage.getItem( 'uid' )! );
            } );
            this.collaborators.sort( ( a, b ) => a.name.localeCompare( b.name ) );
            this.loader.complete();
          },
          error: ( { error } ) => this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.message )
        } );
    }
  }

  fillBenefits () {
    this.loader.start();
    this.benefitUserService.showByUserID( this.formGroup.value.user_id, this.year! )
      .subscribe( {
        next: ( benefitUser ) => {
          this.currentUser = benefitUser[ 0 ]
          if ( this.currentUser ) {
            this.calendarData = [];
            this.calendarData = this.currentUser.benefit_user;
          }
          this.loader.complete();
          this.loaded = true;
        },
        error: ( { error } ) => this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.message )
      } );
  }

}
