import { Component, OnInit } from '@angular/core';
import { BenefitUserService } from '../../services/benefit-user.service';
import { BenefitUser, BenefitUserElement } from '../../interfaces/benefit-user.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Benefit } from '../../../benefit/interfaces/benefit.interface';
import { BenefitService } from '../../../benefit/services/benefit.service';
import { UserService } from 'src/app/user/services/user.service';
import { User } from 'src/app/user/interfaces/user.interface';
import { DatePipe } from '@angular/common';
import { TotalBancoHorasPipe } from 'src/app/shared/pipes/TotalBancoHoras.pipe';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component( {
  selector: 'benefitemployee-index',
  templateUrl: './index.component.html',
  styles: [
  ]
} )
export class IndexComponent implements OnInit {

  onClickString: string = '';

  years: number[] = [];
  user?: User;
  benefits!: Benefit[];
  allUsersBenefits?: BenefitUser[];
  currentUserBenefits?: BenefitUser;
  totalBancoHoras: number = 0;
  calendarData: any;

  viewBenefitUser: FormGroup = this.fb.group( {
    years: [ new Date().getFullYear().toString(), Validators.required ],
    users: [ '', Validators.required ]
  } );

  constructor (
    private fb: FormBuilder,
    private benefitUserService: BenefitUserService,
    private benefitService: BenefitService,
    private userService: UserService,
    private router: Router
  ) {
    const currentYear = new Date().getFullYear();
    for ( let i = currentYear; i > currentYear - 5; i-- ) {
      this.years.push( i );
    };
  }

  ngOnInit () {
    this.userService.show( Number.parseInt( localStorage.getItem( 'uid' )! ) )
      .subscribe( {
        next: ( user ) => {
          this.user = Object.values( user )[ 0 ];
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
    this.benefitService.index()
      .subscribe( benefits => this.benefits = benefits );
    this.benefitUserService.index( Number.parseInt( localStorage.getItem( 'uid' )! ), this.viewBenefitUser.get( 'years' )?.value )
      .subscribe( currentUserBenefits => {
        this.allUsersBenefits = currentUserBenefits;
        this.calendarData = this.allUsersBenefits
      } );
  }

  getBenefitDetail ( event: any ) {
    if ( this.viewBenefitUser.get( 'years' )?.value && this.viewBenefitUser.get( 'users' )?.value ) {

      this.benefitUserService.index( Number.parseInt( localStorage.getItem( 'uid' )! ), this.viewBenefitUser.get( 'years' )?.value )
        .subscribe( currentUserBenefits => {
          this.currentUserBenefits = this.allUsersBenefits!.find( benefitUser => benefitUser.id === Number.parseInt( this.viewBenefitUser.controls[ 'users' ].value ) );
          this.allUsersBenefits = currentUserBenefits;
          this.calendarData = this.allUsersBenefits
        } );
    }
  }

  emitir () {
    // this.onClickString = 'Emitted'
    this.totalBancoHoras = Math.round( Math.random() * 100 );
  }

  selectBenefit ( benefitId: number ) {

    let filteredBenefit = this.currentUserBenefits?.benefit_user.filter( benefit => benefit.benefit_id === benefitId );
    if ( filteredBenefit?.length ) {
      let html: string = '';
      switch ( filteredBenefit[ 0 ].benefits.name ) {
        case 'Mi Cumpleaños':
          return filteredBenefit
            ? `<li class="list-group-item">
              Fecha de redención: ${ new DatePipe( 'en-US' ).transform( filteredBenefit[ 0 ].benefit_begin_time, 'dd/MM/yyyy, hh:mm a' ) }
            </li>`
            : '<li class="list-group-item">No se encontraron beneficios registrados</li>';

        case 'Mi Banco de Horas':
          this.totalBancoHoras = new TotalBancoHorasPipe().transform( filteredBenefit );
          filteredBenefit.forEach( benefit_detail => {
            html += `<li class="list-group-item">
              ${ new DatePipe( 'en-US' ).transform( benefit_detail.benefit_begin_time, 'dd/MM/yyyy, hh:mm a' ) }: ${ benefit_detail.benefit_detail.time_hours } horas
            </li>`
          } )
          return filteredBenefit ? html : '<li class="list-group-item">No se encontraron beneficios registrados</li>';

        case 'Mi Horario Flexible':
          return filteredBenefit
            ? `<li class="list-group-item">
                ${ filteredBenefit![ 0 ].benefit_detail.name }
              </li>`
            : '<li class="list-group-item">No se encontraron beneficios registrados</li>';

        case 'Mi Viernes':
          filteredBenefit.forEach( benefit_detail => {
            html += `<li class="list-group-item">
              ${ new DatePipe( 'en-US' ).transform( benefit_detail.benefit_begin_time, 'dd/MM/yyyy, hh:mm a' ) }: ${ benefit_detail.benefit_detail.time_hours } horas
            </li>`
          } )
          return filteredBenefit ? html : '<li class="list-group-item">No se encontraron beneficios registrados</li>';

        case 'Tiempo para el Viajero':
          return filteredBenefit
            ? `<li class="list-group-item">
                ${ filteredBenefit![ 0 ].benefit_detail.name }
              </li>`
            : '<li class="list-group-item">No se encontraron beneficios registrados</li>';
      }

    }
    this.totalBancoHoras = 0;
    return '<li class="list-group-item">No se encontraron beneficios registrados</li>';
  }

}
