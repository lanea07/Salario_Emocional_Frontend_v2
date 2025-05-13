import { AfterViewInit, ChangeDetectorRef, Component, OnChanges, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { combineLatest } from 'rxjs';

import { LoadingBarService } from '@ngx-loading-bar/core';
import { MessageService } from 'primeng/api';

import { BenefitUserService } from 'src/app/benefit-user/services/benefit-user.service';
import { Benefit } from 'src/app/benefit/interfaces/benefit.interface';
import { BenefitService } from 'src/app/benefit/services/benefit.service';
import { BenefitUserElement } from '../../../../interfaces/benefit-user.interface';
import { MessagingService } from '../../../../services/messaging.service';

@Component( {
    selector: 'my-team',
    templateUrl: './my-team.component.html',
    styles: [],
    standalone: false
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
    private benefitService: BenefitService,
    private benefitUserService: BenefitUserService,
    private changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private lbs: LoadingBarService,
    private messagingService: MessagingService,
    private ms: MessageService,
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
        error: ( { error } ) => this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } )
      } );
    }
  }
}