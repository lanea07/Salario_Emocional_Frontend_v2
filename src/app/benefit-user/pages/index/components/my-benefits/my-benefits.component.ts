import { AfterViewInit, Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { BenefitUser, BenefitUserElement } from 'src/app/benefit-user/interfaces/benefit-user.interface';
import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';
import { BenefitUserService } from '../../../../services/benefit-user.service';

@Component( {
  selector: 'my-benefits',
  templateUrl: './my-benefits.component.html',
  styles: []
} )
export class MyBenefitsComponent implements AfterViewInit {

  calendarData?: BenefitUserElement[];
  loaded: boolean = false;
  miHorarioFlexible?: BenefitUserElement[];
  miAlternancia?: BenefitUserElement[];
  miBancoHoras?: BenefitUserElement[];
  miCumpleanos?: BenefitUserElement[];
  miViernes?: BenefitUserElement[];
  miTiempoViajero?: BenefitUserElement[];
  misVacaciones?: BenefitUserElement[];

  viewBenefitUser: FormGroup = this.fb.group( {
    years: [ new Date().getFullYear().toString(), Validators.required ],
  } );

  constructor (
    private as: AlertService,
    private benefitUserService: BenefitUserService,
    private fb: FormBuilder,
    private renderer: Renderer2,
    private router: Router,
  ) { }

  ngAfterViewInit (): void {
    this.renderer.listen( 'document', 'click', ( event ) => {
      if ( event.target.hasAttribute( "benefit_employee_id" ) ) {
        this.router.navigate( [ "/benefit-employee/show/" + event.target.getAttribute( "benefit_employee_id" ) ] );
      }
    } );
    this.benefitUserService.index( Number.parseInt( localStorage.getItem( 'uid' )! ), this.viewBenefitUser.get( 'years' )?.value )
      .subscribe( {
        next: ( benefitUser ) => {
          this.fillBenefits( benefitUser );
          this.loaded = true;
        },
        error: ( error ) => {
          this.router.navigateByUrl( 'benefit-employee' );
          Swal.fire( {
            title: 'Error',
            icon: 'error',
            html: error.error.message,
            timer: 3000,
            timerProgressBar: true,
            didOpen: ( toast ) => {
              toast.addEventListener( 'mouseenter', Swal.stopTimer )
              toast.addEventListener( 'mouseleave', Swal.resumeTimer )
            }
          } );
        }
      } );
  }

  fillBenefits ( benefitUser: BenefitUser[] ) {
    this.miHorarioFlexible = benefitUser[ 0 ].benefit_user.filter( benefit => benefit.benefits.name === "Mi Horario Flexible" );
    this.miCumpleanos = benefitUser[ 0 ].benefit_user.filter( benefit => benefit.benefits.name === "Mi Cumpleaños" );
    this.miViernes = benefitUser[ 0 ].benefit_user.filter( benefit => benefit.benefits.name === "Mi Viernes" );
    this.miTiempoViajero = benefitUser[ 0 ].benefit_user.filter( benefit => benefit.benefits.name === "Tiempo para el Viajero" );
    this.miBancoHoras = benefitUser[ 0 ].benefit_user.filter( benefit => benefit.benefits.name === "Mi Banco de Horas" );
    this.miAlternancia = benefitUser[ 0 ].benefit_user.filter( benefit => benefit.benefits.name === "Mi Alternancia" );
    this.misVacaciones = benefitUser[ 0 ].benefit_user.filter( benefit => benefit.benefits.name === "Mis Vacaciones" );
    this.calendarData = [
      ...this.miCumpleanos,
      ...this.miViernes,
      ...this.miBancoHoras,
      ...this.misVacaciones,
    ]
  }

  getBenefitDetail ( event: any ) {
    if ( this.viewBenefitUser.get( 'years' )?.value ) {
      let year = new Date( this.viewBenefitUser.get( 'years' )?.value ).getFullYear();
      this.benefitUserService.index( Number.parseInt( localStorage.getItem( 'uid' )! ), year )
        .subscribe( currentUserBenefits => {
          this.fillBenefits( currentUserBenefits );
        } );
    }
  }

  downloadReport () {
    this.benefitUserService.downloadReport( this.viewBenefitUser.value )
      .subscribe(
        {
          next: resp => this.as.subscriptionAlert( subscriptionMessageTitle.CREADO, subscriptionMessageIcon.INFO, 'El reporte fue programado y será enviado a tu correo. Revisa tu bandeja de correo no deseado si es necesario.' ),
          error: err => err
        }
      )
  }

}
