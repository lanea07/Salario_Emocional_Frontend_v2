import { AfterViewInit, Component } from '@angular/core';
import { BenefitUserService } from 'src/app/benefit-user/services/benefit-user.service';
import { BenefitUserElement } from '../../../../interfaces/benefit-user.interface';

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
    this.miHorarioFlexible = benefitUser.filter( benefit => benefit.benefits.name === "Mi Horario Flexible" );
    this.miCumpleanos = benefitUser.filter( benefit => benefit.benefits.name === "Mi Cumpleaños" );
    this.miViernes = benefitUser.filter( benefit => benefit.benefits.name === "Mi Viernes" );
    this.miTiempoViajero = benefitUser.filter( benefit => benefit.benefits.name === "Tiempo para el Viajero" );
    this.miBancoHoras = benefitUser.filter( benefit => benefit.benefits.name === "Mi Banco de Horas" );
    this.miAlternancia = benefitUser.filter( benefit => benefit.benefits.name === "Mi Alternancia" );
    this.misVacaciones = benefitUser.filter( benefit => benefit.benefits.name === "Mis Vacaciones" );
    this.calendarData = [
      ...this.miCumpleanos,
      ...this.miViernes,
      ...this.miBancoHoras,
      ...this.misVacaciones,
    ]
  }
}
