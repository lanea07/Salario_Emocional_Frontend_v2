import { AfterContentInit, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BenefitUserElement } from 'src/app/benefit-user/interfaces/benefit-user.interface';
import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';
import { BenefitUserService } from '../../../../services/benefit-user.service';
import { MessagingService } from 'src/app/benefit-user/services/messaging.service';
import { LoadingBarService } from '@ngx-loading-bar/core';

@Component( {
  selector: 'my-collaborators-benefits',
  templateUrl: './my-collaborators-benefits.component.html',
  styles: []
} )
export class MyCollaboratorsBenefitsComponent implements OnInit, OnChanges, OnDestroy, AfterContentInit {

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
  permisoEspecial: BenefitUserElement[] = [];
  trabajoHibrido: BenefitUserElement[] = [];
  loader = this.lbs.useRef();

  constructor (
    private as: AlertService,
    private benefitUserService: BenefitUserService,
    private changeDetectorRef: ChangeDetectorRef,
    private lbs: LoadingBarService,
    private messagingService: MessagingService,
    private fb: FormBuilder,
  ) { }

  ngOnInit (): void {
    this.getBenefitDetail();
    this.messagingService.message
      .subscribe( {
        next: ( { mustRefresh } ) => mustRefresh && this.getBenefitDetail()
      } )
  }

  ngOnChanges ( changes: SimpleChanges ): void {
    this.loaded = false;
    this.getBenefitDetail();
  }

  ngOnDestroy (): void {
    this.messagingService.message.unsubscribe();
  }

  ngAfterContentInit (): void {
    this.changeDetectorRef.detectChanges();
  }

  getBenefitDetail () {
    if ( this.year ) {
      this.loader.start();
      this.benefitUserService.indexCollaborators( new Date( this.year ).getFullYear().valueOf() )
        .subscribe( {
          next: ( benefitUser ) => {
            this.loaded = true;
            if ( !benefitUser[ 0 ].descendants_and_self ) return;
            this.collaborators = benefitUser[ 0 ].descendants_and_self.filter( ( user ) => {
              return user.id !== Number.parseInt( localStorage.getItem( 'uid' )! );
            } );
            this.fillBenefits();
            this.loader.complete();
          },
          error: ( { error } ) => this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.message )
        } );
    }
  }

  fillBenefits () {
    let currentUser = this.collaborators.filter( user => user.id === this.formGroup.value.user_id );
    if ( currentUser.length > 0 ) {
      this.miHorarioFlexible = currentUser[ 0 ].benefit_user.filter( ( benefit: any ) => benefit.benefits.name === "Mi Horario Flexible" );
      this.miCumpleanos = currentUser[ 0 ].benefit_user.filter( ( benefit: any ) => benefit.benefits.name === "Mi Cumpleaños" );
      this.miViernes = currentUser[ 0 ].benefit_user.filter( ( benefit: any ) => benefit.benefits.name === "Mi Viernes" );
      this.diaDeLaFamilia = currentUser[ 0 ].benefit_user.filter( ( benefit: any ) => benefit.benefits.name === "Día de la Familia" );
      this.miBancoHoras = currentUser[ 0 ].benefit_user.filter( ( benefit: any ) => benefit.benefits.name === "Mi Banco de Horas" );
      this.trabajoHibrido = currentUser[ 0 ].benefit_user.filter( ( benefit: any ) => benefit.benefits.name === "Trabajo Híbrido" );
      this.misVacaciones = currentUser[ 0 ].benefit_user.filter( ( benefit: any ) => benefit.benefits.name === "Mis Vacaciones" );
      this.permisoEspecial = currentUser[ 0 ].benefit_user.filter( ( benefit: any ) => benefit.benefits.name === "Permiso Especial" );
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
    this.loaded = true;
  }

}
