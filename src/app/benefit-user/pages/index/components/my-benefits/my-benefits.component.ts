import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { BenefitUser, BenefitUserElement } from 'src/app/benefit-user/interfaces/benefit-user.interface';
import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';
import { BenefitUserService } from '../../../../services/benefit-user.service';
import { FullCalendarComponent } from '@fullcalendar/angular';

@Component( {
  selector: 'my-benefits',
  templateUrl: './my-benefits.component.html',
  styles: []
} )
export class MyBenefitsComponent implements AfterViewInit, OnChanges {

  @Input() year: number = new Date().getFullYear().valueOf();
  @Output() loadedData: EventEmitter<boolean> = new EventEmitter();

  calendarData: BenefitUserElement[] = [];
  loaded: boolean = false;
  diaDeLaFamilia: BenefitUserElement[] = [];
  miHorarioFlexible: BenefitUserElement[] = [];
  miBancoHoras: BenefitUserElement[] = [];
  miCumpleanos: BenefitUserElement[] = [];
  miViernes: BenefitUserElement[] = [];
  misVacaciones: BenefitUserElement[] = [];
  trabajoHibrido: BenefitUserElement[] = [];

  constructor (
    private as: AlertService,
    private benefitUserService: BenefitUserService,
    private renderer: Renderer2,
    private router: Router,
  ) { }

  ngOnChanges ( changes: SimpleChanges ): void {
    this.loadedData.emit( false );
    this.getBenefitDetail();
  }

  ngAfterViewInit (): void {
    this.renderer.listen( 'document', 'click', ( event ) => {
      if ( event.target.hasAttribute( "benefit_employee_id" ) ) {
        this.router.navigate( [ "/benefit-employee/show/" + event.target.getAttribute( "benefit_employee_id" ) ] );
      }
    } );
    this.getBenefitDetail();
  }

  getBenefitDetail () {
    if ( this.year ) {
      this.benefitUserService.index( Number.parseInt( localStorage.getItem( 'uid' )! ), new Date( this.year ).getFullYear().valueOf() )
        .subscribe( {
          next: ( benefitUser ) => {
            this.fillBenefits( benefitUser );
            this.loaded = true;
            this.loadedData.emit( true );
          },
          error: ( { error } ) => this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.error.message )
        } );
    }
  }

  fillBenefits ( benefitUser: BenefitUser[] ) {
    this.miHorarioFlexible = benefitUser[ 0 ].benefit_user.filter( benefit => benefit.benefits.name === "Mi Horario Flexible" );
    this.miCumpleanos = benefitUser[ 0 ].benefit_user.filter( benefit => benefit.benefits.name === "Mi Cumpleaños" );
    this.miViernes = benefitUser[ 0 ].benefit_user.filter( benefit => benefit.benefits.name === "Mi Viernes" );
    this.diaDeLaFamilia = benefitUser[ 0 ].benefit_user.filter( benefit => benefit.benefits.name === "Día de la Familia" );
    this.miBancoHoras = benefitUser[ 0 ].benefit_user.filter( benefit => benefit.benefits.name === "Mi Banco de Horas" );
    this.trabajoHibrido = benefitUser[ 0 ].benefit_user.filter( benefit => benefit.benefits.name === "Trabajo Híbrido" );
    this.misVacaciones = benefitUser[ 0 ].benefit_user.filter( benefit => benefit.benefits.name === "Mis Vacaciones" );
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
