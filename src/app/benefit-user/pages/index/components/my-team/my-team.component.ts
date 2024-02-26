import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';

import { LoadingBarService } from '@ngx-loading-bar/core';

import { BenefitUserService } from 'src/app/benefit-user/services/benefit-user.service';
import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';
import { BenefitUser, BenefitUserElement } from '../../../../interfaces/benefit-user.interface';
import { MessagingService } from '../../../../services/messaging.service';

@Component( {
  selector: 'my-team',
  templateUrl: './my-team.component.html',
  styles: [
  ]
} )
export class MyTeamComponent implements AfterViewInit, OnChanges, OnInit, OnDestroy {

  @Input() year: number = new Date().getFullYear().valueOf();

  calendarData: BenefitUserElement[] = [];
  miHorarioFlexible: BenefitUserElement[] = [];
  miCumpleanos: BenefitUserElement[] = [];
  miViernes: BenefitUserElement[] = [];
  diaDeLaFamilia: BenefitUserElement[] = [];
  miBancoHoras: BenefitUserElement[] = [];
  trabajoHibrido: BenefitUserElement[] = [];
  misVacaciones: BenefitUserElement[] = [];
  permisoEspecial: BenefitUserElement[] = [];
  loader = this.lbs.useRef();

  constructor (
    private as: AlertService,
    private benefitUserService: BenefitUserService,
    private lbs: LoadingBarService,
    private messagingService: MessagingService,
  ) { }

  ngOnInit (): void {
    this.messagingService.message
      .subscribe( {
        next: ( { mustRefresh } ) => mustRefresh && this.getBenefitDetail()
      } )
  }

  ngOnDestroy (): void {
    this.messagingService.message.unsubscribe();
  }

  ngAfterViewInit (): void {
    this.getBenefitDetail();
  }

  ngOnChanges (): void {
    this.getBenefitDetail();
  }

  getBenefitDetail () {
    this.loader.start();
    this.benefitUserService.indexCollaborators( new Date( this.year ).getFullYear().valueOf() )
      .subscribe( {
        next: ( benefitUser ) => {
          this.fillBenefits( benefitUser );
          this.loader.complete();
        },
        error: ( { error } ) => {
          this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.message )
        }
      } );
  }

  fillBenefits ( benefitUser: BenefitUser[] ) {
    if ( !benefitUser[ 0 ].descendants_and_self ) return;
    this.miViernes = benefitUser[ 0 ].descendants_and_self.flatMap( user => {
      return user.benefit_user.filter( benefit => { return benefit.benefits.name === "Mi Viernes" } );
    } );
    this.miHorarioFlexible = benefitUser[ 0 ].descendants_and_self.flatMap( user => {
      return user.benefit_user.filter( benefit => benefit.benefits.name === "Mi Horario Flexible" );
    } );
    this.miCumpleanos = benefitUser[ 0 ].descendants_and_self.flatMap( user => {
      return user.benefit_user.filter( benefit => benefit.benefits.name === "Mi Cumpleaños" );
    } );
    this.diaDeLaFamilia = benefitUser[ 0 ].descendants_and_self.flatMap( user => {
      return user.benefit_user.filter( benefit => benefit.benefits.name === "Día de la Familia" );
    } );
    this.miBancoHoras = benefitUser[ 0 ].descendants_and_self.flatMap( user => {
      return user.benefit_user.filter( benefit => benefit.benefits.name === "Mi Banco de Horas" );
    } );
    this.trabajoHibrido = benefitUser[ 0 ].descendants_and_self.flatMap( user => {
      return user.benefit_user.filter( benefit => benefit.benefits.name === "Trabajo Híbrido" );
    } );
    this.misVacaciones = benefitUser[ 0 ].descendants_and_self.flatMap( user => {
      return user.benefit_user.filter( benefit => benefit.benefits.name === "Mis Vacaciones" );
    } );
    this.permisoEspecial = benefitUser[ 0 ].descendants_and_self.flatMap( user => {
      return user.benefit_user.filter( benefit => benefit.benefits.name === "Permiso Especial" );
    } );
    this.calendarData = [];
    this.calendarData = [
      ...this.miCumpleanos,
      ...this.diaDeLaFamilia,
      ...this.miViernes,
      ...this.miBancoHoras,
      ...this.misVacaciones,
      ...this.permisoEspecial,
    ]
  }
}
