import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { BenefitUserElement } from 'src/app/benefit-user/interfaces/benefit-user.interface';
import { BenefitUserService } from 'src/app/benefit-user/services/benefit-user.service';
import { MessagingService } from 'src/app/benefit-user/services/messaging.service';
import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';

@Component( {
  selector: 'app-benefit-decision',
  templateUrl: './benefit-decision.component.html',
  styles: ``
} )
export class BenefitDecisionComponent {

  benefitUser?: BenefitUserElement;
  decisionForm: FormGroup = this.fb.group( {
    cmd: [ '', Validators.required ],
    decision_comment: [ '' ],
  } );

  constructor (
    private as: AlertService,
    private benefitUserService: BenefitUserService,
    private fb: FormBuilder,
    private messagingService: MessagingService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) {
    this.benefitUser = this.config.data;
  }

  isValidField ( campo: string ) {
    return this.decisionForm.controls[ campo ].errors
      && this.decisionForm.controls[ campo ].touched;
  }

  decideBenefit () {
    if ( this.decisionForm.invalid ) {
      this.decisionForm.markAllAsTouched();
      return;
    }
    let payload = {
      cmd: this.decisionForm.get( 'cmd' )?.value,
      decision_comment: this.decisionForm.get( 'decision_comment' )?.value,
      data: this.benefitUser
    }
    this.benefitUserService.decideBenefitUser( payload )
      .subscribe( {
        next: () => {
          this.messagingService.message.next( {
            decisionTaken: true,
          } );
          // TODO: This is not closing modal
        this.ref.close();
        },
        error: ( { error } ) => this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.message )
      } );
  }
}
