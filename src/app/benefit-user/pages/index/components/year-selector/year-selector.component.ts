import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MessageService } from 'primeng/api';

import { BenefitUserService } from '../../../../services/benefit-user.service';

@Component( {
    selector: 'year-selector',
    templateUrl: './year-selector.component.html',
    styles: ``,
    standalone: false
} )
export class YearSelectorComponent implements AfterViewInit {

  @Output() yearChanged: EventEmitter<any> = new EventEmitter<any>();

  viewBenefitUser: FormGroup = this.fb.group( {
    years: [ new Date(), Validators.required ],
  } );

  constructor (
    private benefitUserService: BenefitUserService,
    private fb: FormBuilder,
    private ms: MessageService,
  ) { }

  ngAfterViewInit (): void {
    this.emit();
  }

  downloadReport () {
    this.benefitUserService.downloadReport( this.viewBenefitUser.value )
      .subscribe(
        {
          next: () => this.ms.add( { severity: 'info', summary: 'Creado', detail: 'El reporte fue programado y sera enviado a tu correo. Revisa tu bandeja de Correo No Deseado si es necesario' } ),
          error: ( { error } ) => this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } )
        }
      )
  }

  emit () {
    this.yearChanged.emit( this.viewBenefitUser.value.years.getFullYear().valueOf() );
  }
}
