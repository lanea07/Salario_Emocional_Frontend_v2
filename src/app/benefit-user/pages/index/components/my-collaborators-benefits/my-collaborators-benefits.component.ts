import { AfterContentInit, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BenefitUserElement } from 'src/app/benefit-user/interfaces/benefit-user.interface';
import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';
import { BenefitUserService } from '../../../../services/benefit-user.service';

@Component( {
  selector: 'my-collaborators-benefits',
  templateUrl: './my-collaborators-benefits.component.html',
  styles: []
} )
export class MyCollaboratorsBenefitsComponent implements OnInit, OnChanges, AfterContentInit {

  @Input() year: number = new Date().getFullYear().valueOf();

  formGroup: FormGroup = this.fb.group( {
    user_id: [ '', Validators.required ],
  } );

  loaded: boolean = true;
  collaborators: any[] = [];
  calendarData: BenefitUserElement[] = [];
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
    private changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
  ) { }

  ngOnInit (): void {
    this.getBenefitDetail();
  }

  ngOnChanges ( changes: SimpleChanges ): void {
    this.loaded = false;
    this.getBenefitDetail();
  }

  ngAfterContentInit (): void {
    this.changeDetectorRef.detectChanges();
  }

  getBenefitDetail () {
    if ( this.year ) {
      this.benefitUserService.indexCollaborators( new Date( this.year ).getFullYear().valueOf() )
        .subscribe( {
          next: ( benefitUser ) => {
            this.collaborators = benefitUser.filter( ( user ) => {
              return user.id !== Number.parseInt( localStorage.getItem( 'uid' )! );
            } );
            this.fillBenefits();
          },
          error: ( error ) => this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.error.message )
        } );
    }
  }

  fillBenefits () {
    this.loaded = false;
    let currentUser = this.collaborators.filter( user => user.id === this.formGroup.value.user_id );
    if ( currentUser.length > 0 ) {
      this.miHorarioFlexible = currentUser[ 0 ].benefit_user.filter( ( benefit: any ) => benefit.benefits.name === "Mi Horario Flexible" );
      this.miCumpleanos = currentUser[ 0 ].benefit_user.filter( ( benefit: any ) => benefit.benefits.name === "Mi Cumpleaños" );
      this.miViernes = currentUser[ 0 ].benefit_user.filter( ( benefit: any ) => benefit.benefits.name === "Mi Viernes" );
      this.diaDeLaFamilia = currentUser[ 0 ].benefit_user.filter( ( benefit: any ) => benefit.benefits.name === "Día de la Familia" );
      this.miBancoHoras = currentUser[ 0 ].benefit_user.filter( ( benefit: any ) => benefit.benefits.name === "Mi Banco de Horas" );
      this.trabajoHibrido = currentUser[ 0 ].benefit_user.filter( ( benefit: any ) => benefit.benefits.name === "Trabajo Híbrido" );
      this.misVacaciones = currentUser[ 0 ].benefit_user.filter( ( benefit: any ) => benefit.benefits.name === "Mis Vacaciones" );
      this.calendarData = [];
      this.calendarData = [
        ...this.miCumpleanos,
        ...this.diaDeLaFamilia,
        ...this.miViernes,
        ...this.miBancoHoras,
        ...this.misVacaciones,
      ]
    }
    this.loaded = true;
  }

}
