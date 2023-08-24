import { DatePipe } from '@angular/common';
import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { AuthService } from 'src/app/auth/services/auth.service';
import { TotalBancoHorasPipe } from 'src/app/shared/pipes/TotalBancoHoras.pipe';
import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';
import { User } from 'src/app/user/interfaces/user.interface';
import { UserService } from 'src/app/user/services/user.service';
import { Benefit } from '../../../benefit/interfaces/benefit.interface';
import { BenefitService } from '../../../benefit/services/benefit.service';
import { BenefitUser } from '../../interfaces/benefit-user.interface';
import { BenefitUserService } from '../../services/benefit-user.service';
import { DomSanitizer, Title } from '@angular/platform-browser';

@Component( {
  selector: 'benefitemployee-index',
  templateUrl: './index.component.html',
  styles: [
  ]
} )
export class IndexComponent implements OnInit, AfterViewInit {

  allUsersBenefits?: BenefitUser[];
  bancosHoras: number[] = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
  benefits!: Benefit[];
  calendarData: any;
  currentUserBenefits?: BenefitUser;
  isAdmin: boolean = false;
  totalBancoHoras: number = 0;
  user?: User;
  users?: User[];
  viewBenefitUser: FormGroup = this.fb.group( {
    years: [ new Date().getFullYear().toString(), Validators.required ],
    users: [ '', Validators.required ]
  } );
  years: number[] = [];


  constructor (
    private as: AlertService,
    private authService: AuthService,
    private benefitService: BenefitService,
    private benefitUserService: BenefitUserService,
    private fb: FormBuilder,
    private renderer: Renderer2,
    private router: Router,
    private sanitizer: DomSanitizer,
    private titleService: Title,
    private userService: UserService
  ) {
    const currentYear = new Date().getFullYear();
    for ( let i = currentYear; i > currentYear - 5; i-- ) {
      this.years.push( i );
    };
    this.titleService.setTitle( 'Detalle de Beneficios de los colaboradores' );
  }

  ngOnInit (): void {

    this.viewBenefitUser.get( 'users' )!.disable();

    this.authService.validarAdmin()
      .subscribe( {
        next: ( isAdmin: any ) => {
          this.isAdmin = isAdmin.admin;
          if ( this.isAdmin ) {
            this.userService.index()
              .subscribe( {
                next: ( user ) => {
                  this.users = user;
                  this.viewBenefitUser.get( 'users' )!.enable();
                },
                error: ( error ) => {
                  this.router.navigateByUrl( 'benefit-employee' );
                  Swal.fire( {
                    title: 'Error',
                    icon: 'error',
                    html: error.error.msg,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: ( toast ) => {
                      toast.addEventListener( 'mouseenter', Swal.stopTimer )
                      toast.addEventListener( 'mouseleave', Swal.resumeTimer )
                    }
                  } )
                }
              } );
          } else {
            this.userService.show( Number.parseInt( localStorage.getItem( 'uid' )! ) )
              .subscribe( {
                next: ( user ) => {
                  this.user = Object.values( user )[ 0 ];
                  this.viewBenefitUser.get( 'users' )!.enable();
                },
                error: ( error ) => {
                  this.router.navigateByUrl( 'benefit-employee' );
                  Swal.fire( {
                    title: 'Error',
                    icon: 'error',
                    html: error.error.msg,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: ( toast ) => {
                      toast.addEventListener( 'mouseenter', Swal.stopTimer )
                      toast.addEventListener( 'mouseleave', Swal.resumeTimer )
                    }
                  } )
                }
              } );
          }
        }
      } );

    this.benefitService.index()
      .subscribe( benefits => {
        this.benefits = benefits;
      } );
    this.benefitUserService.index( Number.parseInt( localStorage.getItem( 'uid' )! ), this.viewBenefitUser.get( 'years' )?.value )
      .subscribe( currentUserBenefits => {
        this.allUsersBenefits = currentUserBenefits;
        this.calendarData = this.allUsersBenefits

      } );
  }

  ngAfterViewInit (): void {
    this.renderer.listen( 'document', 'click', ( event ) => {
      if ( event.target.hasAttribute( "benefit_employee_id" ) ) {
        this.router.navigate( [ "/benefit-employee/show/" + event.target.getAttribute( "benefit_employee_id" ) ] );
      }
    } );
  }

  getBenefitDetail ( event: any ) {
    if ( this.viewBenefitUser.get( 'years' )?.value && this.viewBenefitUser.get( 'users' )?.value ) {

      this.benefitUserService.index( Number.parseInt( localStorage.getItem( 'uid' )! ), this.viewBenefitUser.get( 'years' )?.value )
        .subscribe( currentUserBenefits => {
          this.allUsersBenefits = currentUserBenefits;
          this.currentUserBenefits = this.allUsersBenefits!.find( benefitUser => benefitUser.id === Number.parseInt( this.viewBenefitUser.controls[ 'users' ].value ) );
          this.calendarData = this.allUsersBenefits

          this.bancosHoras = this.bancosHoras.map( mes => 0 );
          let filteredBenefit = this.currentUserBenefits!.benefit_user.filter( benefitUser => benefitUser.benefits.name === "Mi Banco de Horas" );
          filteredBenefit.map( benefit => {
            this.bancosHoras[ new Date( benefit.benefit_begin_time ).getMonth() ] += benefit.benefit_detail.time_hours || 0;
          } )

        } );
    }
  }

  selectBenefit ( benefitId: number ) {

    let filteredBenefit = this.currentUserBenefits?.benefit_user.filter( benefit => benefit.benefit_id === benefitId );
    if ( filteredBenefit?.length ) {
      let html: string = '';
      let response = '';
      switch ( filteredBenefit[ 0 ].benefits.name ) {
        case 'Mi Cumpleaños':
          response = filteredBenefit
            ? `<li class="list-group-item">
              Fecha de redención: ${ new DatePipe( 'en-US' ).transform( filteredBenefit[ 0 ].benefit_begin_time, 'dd/MM/yyyy, hh:mm a' ) }
              <small><span style="cursor: pointer;" class="text-link link-primary" benefit_employee_id="${filteredBenefit[ 0 ].id}">Ampliar</span></small>
            </li>`
            : '<li class="list-group-item">No se encontraron beneficios registrados</li>';
          return this.sanitizer.bypassSecurityTrustHtml( response );

        case 'Mi Banco de Horas':
          this.totalBancoHoras = new TotalBancoHorasPipe().transform( filteredBenefit );
          filteredBenefit.forEach( benefit_detail => {
            html += `<li class="list-group-item">
              ${ new DatePipe( 'en-US' ).transform( benefit_detail.benefit_begin_time, 'dd/MM/yyyy, hh:mm a' ) }: ${ benefit_detail.benefit_detail.time_hours } horas
              <small><span style="cursor: pointer;" class="text-link link-primary" benefit_employee_id="${benefit_detail.id}">Ampliar</span></small>
            </li>`
          } )
          return filteredBenefit ? this.sanitizer.bypassSecurityTrustHtml( html ) : '<li class="list-group-item">No se encontraron beneficios registrados</li>';

        case 'Mi Horario Flexible':
          filteredBenefit.forEach( benefit_detail => {
            html += `<li class="list-group-item">
              ${ new DatePipe( 'en-US' ).transform( benefit_detail.benefit_begin_time, 'dd/MM/yyyy, hh:mm a' ) }
              <small><span style="cursor: pointer;" class="text-link link-primary" benefit_employee_id="${ benefit_detail.id }">Ampliar</span></small>
            </li>`
          } );
          return filteredBenefit ? this.sanitizer.bypassSecurityTrustHtml( html ) : '<li class="list-group-item">No se encontraron beneficios registrados</li>';

        case 'Mi Viernes':
          filteredBenefit.forEach( benefit_detail => {
            html += `<li class="list-group-item">
              ${ new DatePipe( 'en-US' ).transform( benefit_detail.benefit_begin_time, 'dd/MM/yyyy, hh:mm a' ) }: ${ benefit_detail.benefit_detail.time_hours } horas
              <small><span style="cursor: pointer;" class="text-link link-primary" benefit_employee_id="${benefit_detail.id}">Ampliar</span></small>
            </li>`
          } )
          return filteredBenefit ? this.sanitizer.bypassSecurityTrustHtml( html ) : '<li class="list-group-item">No se encontraron beneficios registrados</li>';

        case 'Tiempo para el Viajero':
          response = filteredBenefit
            ? `<li class="list-group-item">
                ${ filteredBenefit![ 0 ].benefit_detail.name }
                <small><span style="cursor: pointer;" class="text-link link-primary" benefit_employee_id="${filteredBenefit[ 0 ].id}">Ampliar</span></small>
              </li>`
            : '<li class="list-group-item">No se encontraron beneficios registrados</li>';
          return this.sanitizer.bypassSecurityTrustHtml( response );
      }

    }
    this.totalBancoHoras = 0;
    return '<li class="list-group-item">No se encontraron beneficios registrados</li>';
  }

  closePanel () {
    this.viewBenefitUser.controls[ 'users' ].setValue( "" );
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
