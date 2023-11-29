import { Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import Swal from 'sweetalert2';

import { BenefitUser, BenefitUserElement } from 'src/app/benefit-user/interfaces/benefit-user.interface';
import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';
import { UserService } from 'src/app/user/services/user.service';
import { BenefitService } from '../../../../../benefit/services/benefit.service';
import { BenefitUserService } from '../../../../services/benefit-user.service';

@Component( {
  selector: 'my-benefits',
  templateUrl: './my-benefits.component.html',
  styles: [
    `
      .loader-cloud {
        width: 175px;
        height: 80px;
        display: block;
        margin:auto;
        background-image: radial-gradient(circle 25px at 25px 25px, #FFF 100%, transparent 0), radial-gradient(circle 50px at 50px 50px, #FFF 100%, transparent 0), radial-gradient(circle 25px at 25px 25px, #FFF 100%, transparent 0), linear-gradient(#FFF 50px, transparent 0);
        background-size: 50px 50px, 100px 76px, 50px 50px, 120px 40px;
        background-position: 0px 30px, 37px 0px, 122px 30px, 25px 40px;
        background-repeat: no-repeat;
        position: relative;
        box-sizing: border-box;
      }
      .loader-cloud::before {
        content: '';  
        left: 60px;
        bottom: 18px;
        position: absolute;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background-color: #C8102E;
        background-image: radial-gradient(circle 8px at 18px 18px, #FFF 100%, transparent 0), radial-gradient(circle 4px at 18px 0px, #FFF 100%, transparent 0), radial-gradient(circle 4px at 0px 18px, #FFF 100%, transparent 0), radial-gradient(circle 4px at 36px 18px, #FFF 100%, transparent 0), radial-gradient(circle 4px at 18px 36px, #FFF 100%, transparent 0), radial-gradient(circle 4px at 30px 5px, #FFF 100%, transparent 0), radial-gradient(circle 4px at 30px 5px, #FFF 100%, transparent 0), radial-gradient(circle 4px at 30px 30px, #FFF 100%, transparent 0), radial-gradient(circle 4px at 5px 30px, #FFF 100%, transparent 0), radial-gradient(circle 4px at 5px 5px, #FFF 100%, transparent 0);
        background-repeat: no-repeat;
        box-sizing: border-box;
        animation: rotationBack 3s linear infinite;
      }
      .loader-cloud::after {
        content: '';  
        left: 94px;
        bottom: 15px;
        position: absolute;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: #C8102E;
        background-image: radial-gradient(circle 5px at 12px 12px, #FFF 100%, transparent 0), radial-gradient(circle 2.5px at 12px 0px, #FFF 100%, transparent 0), radial-gradient(circle 2.5px at 0px 12px, #FFF 100%, transparent 0), radial-gradient(circle 2.5px at 24px 12px, #FFF 100%, transparent 0), radial-gradient(circle 2.5px at 12px 24px, #FFF 100%, transparent 0), radial-gradient(circle 2.5px at 20px 3px, #FFF 100%, transparent 0), radial-gradient(circle 2.5px at 20px 3px, #FFF 100%, transparent 0), radial-gradient(circle 2.5px at 20px 20px, #FFF 100%, transparent 0), radial-gradient(circle 2.5px at 3px 20px, #FFF 100%, transparent 0), radial-gradient(circle 2.5px at 3px 3px, #FFF 100%, transparent 0);
        background-repeat: no-repeat;
        box-sizing: border-box;
        animation: rotationBack 4s linear infinite reverse;
      }

      @keyframes rotationBack {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(-360deg);
        }
      }
    `
  ]
} )
export class MyBenefitsComponent {

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
    private benefitService: BenefitService,
    private benefitUserService: BenefitUserService,
    private fb: FormBuilder,
    private renderer: Renderer2,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit (): void {

    forkJoin( {
      user: this.userService.show( Number.parseInt( localStorage.getItem( 'uid' )! ) ),
      benefits: this.benefitService.index(),
      benefitUser: this.benefitUserService.index( Number.parseInt( localStorage.getItem( 'uid' )! ), this.viewBenefitUser.get( 'years' )?.value )
    } )
      .subscribe( {
        next: ( { user, benefits, benefitUser } ) => {
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

  ngAfterViewInit (): void {
    this.renderer.listen( 'document', 'click', ( event ) => {
      if ( event.target.hasAttribute( "benefit_employee_id" ) ) {
        this.router.navigate( [ "/benefit-employee/show/" + event.target.getAttribute( "benefit_employee_id" ) ] );
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
