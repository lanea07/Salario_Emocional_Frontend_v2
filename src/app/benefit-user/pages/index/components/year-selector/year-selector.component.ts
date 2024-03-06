import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';
import { BenefitUserService } from '../../../../services/benefit-user.service';

@Component( {
  selector: 'year-selector',
  templateUrl: './year-selector.component.html',
  styles: ``
} )
export class YearSelectorComponent implements AfterViewInit {

  @Output() yearChanged: EventEmitter<any> = new EventEmitter<any>();

  viewBenefitUser: FormGroup = this.fb.group( {
    years: [ new Date(), Validators.required ],
  } );

  constructor (
    private as: AlertService,
    private benefitUserService: BenefitUserService,
    private fb: FormBuilder
  ) { }

  ngAfterViewInit (): void {
    this.emit();
  }

  downloadReport () {
    this.benefitUserService.downloadReport( this.viewBenefitUser.value )
      .subscribe(
        {
          next: () => this.as.subscriptionAlert( subscriptionMessageTitle.CREADO, subscriptionMessageIcon.INFO, 'El reporte fue programado y será enviado a tu correo. Revisa tu bandeja de correo no deseado si es necesario.' ),
          error: ( { error } ) => this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.message )
        }
      )
  }

  emit () {
    this.yearChanged.emit( this.viewBenefitUser.value.years.getFullYear().valueOf() );
  }
}
