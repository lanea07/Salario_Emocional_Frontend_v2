import { AfterViewInit, Component, Input, OnChanges, ViewChild } from '@angular/core';

import { BenefitUserService } from 'src/app/benefit-user/services/benefit-user.service';
import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';
import { BenefitUser, BenefitUserElement } from '../../../../interfaces/benefit-user.interface';
import { FullCalendarComponent } from '@fullcalendar/angular';

@Component( {
  selector: 'my-team',
  templateUrl: './my-team.component.html',
  styles: [
  ]
} )
export class MyTeamComponent implements AfterViewInit, OnChanges {

  @Input() year: number = new Date().getFullYear().valueOf();

  calendarData: BenefitUserElement[] = [];
  miHorarioFlexible: BenefitUserElement[] = [];
  miCumpleanos: BenefitUserElement[] = [];
  miViernes: BenefitUserElement[] = [];
  diaDeLaFamilia: BenefitUserElement[] = [];
  miBancoHoras: BenefitUserElement[] = [];
  trabajoHibrido: BenefitUserElement[] = [];
  misVacaciones: BenefitUserElement[] = [];

  constructor (
    private as: AlertService,
    private benefitUserService: BenefitUserService,
  ) { }

  ngAfterViewInit (): void {
    this.getBenefitDetail();
  }

  ngOnChanges (): void {
    this.getBenefitDetail();
  }

  getBenefitDetail () {
    this.benefitUserService.indexCollaborators( new Date( this.year ).getFullYear().valueOf() )
      .subscribe( {
        next: ( benefitUser ) => {
          this.fillBenefits( benefitUser );
        },
        error: ( { error } ) => {
          this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.error.message )
        }
      } );
  }

  fillBenefits ( benefitUser: BenefitUser[] ) {
    this.miViernes = benefitUser.flatMap( user => {
      return user.benefit_user.filter( benefit => benefit.benefits.name === "Mi Viernes" );
    } );
    this.miHorarioFlexible = benefitUser.flatMap( user => {
      return user.benefit_user.filter( benefit => benefit.benefits.name === "Mi Horario Flexible" );
    } );
    this.miCumpleanos = benefitUser.flatMap( user => {
      return user.benefit_user.filter( benefit => benefit.benefits.name === "Mi Cumpleaños" );
    } );
    this.diaDeLaFamilia = benefitUser.flatMap( user => {
      return user.benefit_user.filter( benefit => benefit.benefits.name === "Día de la Familia" );
    } );
    this.miBancoHoras = benefitUser.flatMap( user => {
      return user.benefit_user.filter( benefit => benefit.benefits.name === "Mi Banco de Horas" );
    } );
    this.trabajoHibrido = benefitUser.flatMap( user => {
      return user.benefit_user.filter( benefit => benefit.benefits.name === "Trabajo Híbrido" );
    } );
    this.misVacaciones = benefitUser.flatMap( user => {
      return user.benefit_user.filter( benefit => benefit.benefits.name === "Mis Vacaciones" );
    } );
    this.calendarData = [];
    this.calendarData = [
      ...this.miCumpleanos,
      ...this.diaDeLaFamilia,
      ...this.miViernes,
      ...this.miBancoHoras,
      ...this.misVacaciones,
    ]
  }
}
