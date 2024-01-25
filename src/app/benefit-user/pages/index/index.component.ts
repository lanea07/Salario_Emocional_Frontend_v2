import { AfterContentInit, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FullCalendarComponent } from '@fullcalendar/angular';

import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';
import { BenefitUserService } from '../../services/benefit-user.service';

@Component( {
  selector: 'benefitemployee-index',
  templateUrl: './index.component.html',
  styles: [
  ]
} )
export class IndexComponent implements AfterContentInit {

  calendarApis: FullCalendarComponent[] = [];
  loaded?: boolean;
  viewBenefitUser: FormGroup = this.fb.group( {
    years: [ new Date(), Validators.required ],
  } );

  constructor (
    private as: AlertService,
    private benefitUserService: BenefitUserService,
    private changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
  ) { }

  ngAfterContentInit (): void {
    this.changeDetectorRef.detectChanges();
  }

  printObject ( event: any ) {
    this.calendarApis.push( event.detail );
  }

  renderCalendars () {
    this.calendarApis?.forEach( ( calendarApi: any ) => {
      setTimeout( () => {
        calendarApi.getApi().render();
      }, 300 );
    } );
  }

  downloadReport () {
    this.benefitUserService.downloadReport( this.viewBenefitUser.value )
      .subscribe(
        {
          next: resp => this.as.subscriptionAlert( subscriptionMessageTitle.CREADO, subscriptionMessageIcon.INFO, 'El reporte fue programado y será enviado a tu correo. Revisa tu bandeja de correo no deseado si es necesario.' ),
          error: err => this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, err.error.message )
        }
      )
  }

  loadedData ( event: any ) {
    this.loaded = event;
  }

}
