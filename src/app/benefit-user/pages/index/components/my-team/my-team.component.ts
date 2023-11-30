import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BenefitUserService } from 'src/app/benefit-user/services/benefit-user.service';
import { BenefitUser, BenefitUserElement } from '../../../../interfaces/benefit-user.interface';

@Component( {
  selector: 'my-team',
  templateUrl: './my-team.component.html',
  styles: [
  ]
} )
export class MyTeamComponent implements AfterViewInit {

  miHorarioFlexible?: BenefitUserElement[];
  miCumpleanos?: BenefitUserElement[];
  miViernes?: BenefitUserElement[];
  miTiempoViajero?: BenefitUserElement[];
  miBancoHoras?: BenefitUserElement[];
  miAlternancia?: BenefitUserElement[];
  misVacaciones?: BenefitUserElement[];
  calendarData?: BenefitUserElement[];

  constructor (
    private benefitUserService: BenefitUserService,
  ) { }

  ngAfterViewInit (): void {
    this.benefitUserService.indexCollaborators()
      .subscribe( ( benefitUser ) => {
        this.fillBenefits( benefitUser );
      } );
  }

  fillBenefits ( benefitUser: BenefitUserElement[] ) {
    // this.miHorarioFlexible = benefitUser[ 0 ].benefit_user.filter( benefit => benefit.benefits.name === "Mi Horario Flexible" );
    this.miCumpleanos = benefitUser.filter( benefit => benefit.benefits.name === "Mi Cumpleaños" );
    this.miViernes = benefitUser.filter( benefit => benefit.benefits.name === "Mi Viernes" );
    // this.miTiempoViajero = benefitUser[ 0 ].benefit_user.filter( benefit => benefit.benefits.name === "Tiempo para el Viajero" );
    this.miBancoHoras = benefitUser.filter( benefit => benefit.benefits.name === "Mi Banco de Horas" );
    // this.miAlternancia = benefitUser[ 0 ].benefit_user.filter( benefit => benefit.benefits.name === "Mi Alternancia" );
    this.misVacaciones = benefitUser.filter( benefit => benefit.benefits.name === "Mis Vacaciones" );
    this.calendarData = [
      ...this.miCumpleanos,
      ...this.miViernes,
      ...this.miBancoHoras,
      ...this.misVacaciones,
    ]
  }
}
