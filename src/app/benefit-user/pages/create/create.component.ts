import { formatDate } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { addHours } from 'date-fns';
import { Calendar } from 'primeng/calendar';
import { Dropdown } from 'primeng/dropdown';
import Swal from 'sweetalert2';

import { BenefitDetail } from '../../../benefit-detail/interfaces/benefit-detail.interface';
import { Benefit } from '../../../benefit/interfaces/benefit.interface';
import { BenefitService } from '../../../benefit/services/benefit.service';
import { Dependency } from '../../../dependency/interfaces/dependency.interface';
import { DependencyService } from '../../../dependency/services/dependency.service';
import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from '../../../shared/services/alert-service.service';
import { User } from '../../../user/interfaces/user.interface';
import { BenefitUser } from '../../interfaces/benefit-user.interface';
import { BenefitUserService } from '../../services/benefit-user.service';
import { PrimeNGConfig } from 'primeng/api';

@Component( {
  selector: 'benefitemployee-create',
  templateUrl: './create.component.html',
  styles: [
  ]
} )
export class CreateComponent implements OnInit, AfterViewInit {

  @ViewChild( 'calendar' ) calendar!: Calendar;
  @ViewChild( 'benefit' ) benefit!: Dropdown;
  es: any = {
    firstDayOfWeek: 1,
    dayNames: [ "domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado" ],
    dayNamesShort: [ "dom", "lun", "mar", "mié", "jue", "vie", "sáb" ],
    dayNamesMin: [ "D", "L", "M", "X", "J", "V", "S" ],
    monthNames: [ "enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre" ],
    monthNamesShort: [ "ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic" ],
    today: 'Hoy',
    clear: 'Borrar'
  }

  benefits?: Benefit[];
  benefit_details?: BenefitDetail[];
  benefitDetailSpinner: boolean = true;
  createForm: FormGroup = this.fb.group( {
    benefit_begin_time: [ '' ],
    benefit_detail_id: [ { value: '', disabled: true }, Validators.required ],
    benefit_end_time: [ '' ],
    benefit_id: [ { value: '', disabled: true }, Validators.required ],
    user_id: [ '', Validators.required ],
    rangeDates: [ '' ],
  } );
  currentUserBenefits?: BenefitUser;
  date!: { year: number, month: number };
  dependencies!: Dependency[];
  disabledDays: number[] = [];
  disableSubmitBtn: boolean = false;
  nodes!: any[];
  numberOfMonths: number = 1;
  selectedBenefitDetail?: BenefitDetail;
  users?: User[];
  userAndBenefitSpinner: boolean = true;

  get userIdErrors (): string {
    const errors = this.createForm.get( 'user_id' )?.errors;
    if ( errors![ 'required' ] ) {
      return 'El campo es obligatorio';
    }
    return '';
  }

  get benefitIdErrors (): string {
    const errors = this.createForm.get( 'benefit_id' )?.errors;
    if ( errors![ 'required' ] ) {
      return 'El campo es obligatorio';
    }
    return '';
  }

  get benefitDetailIdErrors (): string {
    const errors = this.createForm.get( 'benefit_detail_id' )?.errors;
    if ( errors![ 'required' ] ) {
      return 'El campo es obligatorio';
    }
    return '';
  }

  constructor (
    private activatedRoute: ActivatedRoute,
    private as: AlertService,
    private benefitService: BenefitService,
    private benefitUserService: BenefitUserService,
    private changeDetectorRef: ChangeDetectorRef,
    private dependencyService: DependencyService,
    private fb: FormBuilder,
    private pgConfig: PrimeNGConfig,
    private router: Router,
  ) {
    this.createForm.get( 'user_id' )?.setValue( localStorage.getItem( 'uid' ) );
  }

  ngOnInit (): void {
    this.pgConfig.setTranslation( this.es );
    forkJoin( {
      loadBenefits: this.benefitService.indexAvailable()
        .pipe(
          tap( ( benefits ) => {
            this.benefits = benefits;
            this.createForm.get( 'benefit_id' )?.enable();
            this.userAndBenefitSpinner = false;
          } )
      ),
    } )
      .subscribe( {
        next: () => {
          this.createForm.get( 'selectedNodes' )?.enable();

          if ( this.router.url.includes( 'edit' ) ) {
            this.activatedRoute.params
              .pipe(
                switchMap( ( { id } ) => this.benefitUserService.show( id ) )
              )
              .subscribe(
                {
                  next: user => {
                    this.currentUserBenefits = Object.values( user )[ 0 ];
                    this.createForm.get( 'benefit_id' )?.setValue( this.currentUserBenefits!.benefit_user[ 0 ].benefits.id );
                    this.createForm.get( 'rangeDates' )?.setValue( new Date( this.currentUserBenefits!.benefit_user[ 0 ].benefit_begin_time ) );
                    this.createForm.get( 'benefit_id' )?.disable();
                    this.fillBenefitDetail( this.currentUserBenefits!.benefit_user[ 0 ].benefits.id );
                  },
                  error: err => {
                    this.router.navigateByUrl( 'benefit-employee' );
                    this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, err.statusText );
                  }
                }
              );
          }

        },
        error: ( error ) => {
          this.router.navigateByUrl( 'benefit-employee' );
          this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.message )
        }
      } );

    this.createForm.get( 'benefit_detail_id' )!.valueChanges
      .subscribe( currentBenefitDetail => {
        this.selectedBenefitDetail = this.benefit_details?.find( benefits => benefits.id === Number.parseInt( currentBenefitDetail || 0 ) );
      } );

  }

  ngAfterViewInit (): void {
    this.calendar.currentHour = new Date().getHours();
    this.calendar.currentMinute = 0;
  }

  ngAfterViewChecked (): void {
    this.changeDetectorRef.detectChanges();
  }

  campoEsValido ( campo: string ) {
    return this.createForm.controls[ campo ].errors
      && this.createForm.controls[ campo ].touched;
  }

  save () {
    if ( this.createForm.invalid ) {
      this.createForm.markAllAsTouched();
      return;
    }

    let date = this.createForm.get( 'rangeDates' )?.value;
    if ( this.benefit.containerViewChild?.nativeElement.innerText === 'Mis Vacaciones' ) {
      let initialDate = new Date( date[ 0 ] );
      let finalDate = new Date( date[ 1 ] );
      finalDate.setDate( finalDate.getDate() + 1 );
      initialDate.setHours( 0, 0, 0, 0 );
      finalDate.setHours( 0, 0, 0, 0 );
      this.createForm.get( 'benefit_begin_time' )?.setValue( formatDate( initialDate, 'yyyy-MM-dd HH:mm:ss', 'en-US' ) );
      this.createForm.get( 'benefit_end_time' )?.setValue( formatDate( finalDate, 'yyyy-MM-dd HH:mm:ss', 'en-US' ) );
    } else {
      this.createForm.get( 'benefit_begin_time' )?.setValue( formatDate( new Date( date ), 'yyyy-MM-dd HH:mm:ss', 'en-US' ) );
      this.createForm.get( 'benefit_end_time' )?.setValue( formatDate( addHours( new Date( date ), this.selectedBenefitDetail!.time_hours ).toString(), 'yyyy-MM-dd HH:mm:ss', 'en-US' ) );
    }


    if ( this.currentUserBenefits?.id ) {
      this.benefitUserService.update( this.currentUserBenefits!.benefit_user[ 0 ].id, this.createForm.getRawValue() )
        .subscribe(
          {
            next: () => {
              this.disableSubmitBtn = false;
              this.as.subscriptionAlert( subscriptionMessageTitle.ACTUALIZADO, subscriptionMessageIcon.SUCCESS );
              this.createForm.get( 'user_id' )?.setValue( localStorage.getItem( 'uid' ) );
            },
            error: ( { error } ) => {
              this.disableSubmitBtn = false;
              this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.message );
            }
          } );
    } else {
      this.benefitUserService.create( this.createForm.value ) 
        .subscribe( {
          next: () => {
            this.disableSubmitBtn = false;
            this.as.subscriptionAlert( subscriptionMessageTitle.CREADO, subscriptionMessageIcon.SUCCESS );
            this.createForm.reset();
            this.createForm.get( 'user_id' )?.setValue( localStorage.getItem( 'uid' ) );
          },
          error: ( { error } ) => {
            this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.message );
            this.disableSubmitBtn = false;
          }
        } );
    }
    this.disableSubmitBtn = true;
  }

  fillColaboradores ( event: any ) {
    let dependencies = this.dependencyService.flattenDependency( { ...this.dependencies[ 0 ] } )
    let dependency = dependencies.find( ( dependency: Dependency ) => {
      return dependency.name === event.node.label;
    } );
    this.createForm.get( 'user_id' )?.reset( '' );
    this.users = dependency!.users;
    this.users.length > 0 ? this.createForm.get( 'user_id' )?.enable() : this.createForm.get( 'user_id' )?.disable();
  }

  emptyColaboradores () {
    this.users = [];
    this.createForm.get( 'user_id' )?.disable();
  }

  fillBenefitDetail ( event: any ) {
    this.createForm.get( 'benefit_detail_id' )!.reset( '' );
    this.createForm.get( 'benefit_detail_id' )!.disable();
    this.benefitDetailSpinner = false;
    this.benefitService.show( event.value || event )
      .subscribe(
        {
          next: ( benefit_details ) => {
            this.benefit_details = Object.values( benefit_details )[ 0 ].benefit_detail;
            if ( this.createForm.get( 'benefit_id' )!.valid ) {
              this.benefitDetailSpinner = true;
            }
            if ( this.router.url.includes( 'edit' ) ) {
              this.createForm.get( 'benefit_detail_id' )?.setValue( this.currentUserBenefits!.benefit_user[ 0 ].benefit_detail.id );
              this.benefitDetailSpinner = true;
            }
            this.createForm.get( 'benefit_detail_id' )!.enable();
          },
          error: ( { error } ) => {
            this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.message );
          }
        }
      );
    if ( event.originalEvent && event.originalEvent.target.textContent == "Mi Viernes" ) {
      this.disabledDays = [ 0, 1, 2, 3, 4, 6 ];
      this.calendar.currentHour = 13;
      this.calendar.currentMinute = 0;
    } else {
      this.disabledDays = [];
    }
    if ( event.originalEvent && event.originalEvent.target.textContent == "Mis Vacaciones" ) {
      this.calendar.selectionMode = 'range'
      this.numberOfMonths = 2;
    }
    else {
      this.calendar.selectionMode = 'single'
      this.numberOfMonths = 1;
    }
    this.calendar.updateUI();
    this.createForm.get( 'rangeDates' )?.reset( '' );
    this.calendar.clear();
  }

  validateBenefitDetail ( event: any ) {
    if ( event.originalEvent && event.originalEvent.target.textContent == "Mañana" ) {
      this.calendar.currentHour = 7;
    } else if ( event.originalEvent && event.originalEvent.target.textContent == "Tarde" ) {
      this.calendar.currentHour = 13;
    }
    this.calendar.currentMinute = 0;
    this.calendar.updateTime();
  }

}
