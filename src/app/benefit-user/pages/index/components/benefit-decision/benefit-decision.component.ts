import { Component, ElementRef, Output } from '@angular/core';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { BenefitUserElement } from 'src/app/benefit-user/interfaces/benefit-user.interface';
import { BenefitUserService } from 'src/app/benefit-user/services/benefit-user.service';
import { MessagingService } from 'src/app/benefit-user/services/messaging.service';

@Component( {
  selector: 'app-benefit-decision',
  templateUrl: './benefit-decision.component.html',
  styles: ``
} )
export class BenefitDecisionComponent {

  benefitUser?: BenefitUserElement;

  constructor (
    private benefitUserService: BenefitUserService,
    private messagingService: MessagingService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) {
    this.benefitUser = this.config.data;
  }

  decideBenefit ( decision: string ) {
    this.messagingService.message.next( {
      decisionTaken: true,
    } );
    this.ref.close();
    // this.benefitUserService.decideBenefitUser( event )
    //   .subscribe( {
    //     next: ( res ) => {
    //     },
    //     error: ( err ) => this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, err.statusText )
    //   } );
  }
}
