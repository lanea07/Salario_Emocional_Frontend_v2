import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { addHours } from 'date-fns';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { Calendar } from 'primeng/calendar';
import { Dropdown } from 'primeng/dropdown';

import { LoadingBarService } from '@ngx-loading-bar/core';

import { ValidatorService } from 'src/app/shared/services/validator.service';
import { UserService } from 'src/app/user/services/user.service';
import { BenefitDetail } from '../../../benefit-detail/interfaces/benefit-detail.interface';
import { Benefit } from '../../../benefit/interfaces/benefit.interface';
import { BenefitService } from '../../../benefit/services/benefit.service';
import { Dependency } from '../../../dependency/interfaces/dependency.interface';
import { Preference } from '../../../shared/interfaces/Preferences.interface';
import { User } from '../../../user/interfaces/user.interface';
import { BenefitUser } from '../../interfaces/benefit-user.interface';
import { BenefitUserService } from '../../services/benefit-user.service';

@Component( {
  selector: 'benefitemployee-create',
  templateUrl: './create.component.html',
  styles: [
  ]
} )
export class CreateComponent implements OnInit {

  @ViewChild( 'benefitBeginTime' ) benefitBeginTime!: Calendar;
  @ViewChild( 'benefitEndTime' ) benefitEndTime!: Calendar;
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
  benefit_settings?: Preference[];
  benefitDetailSpinner: boolean = true;
  createForm: FormGroup = this.fb.group( {
    benefit_begin_time: [ { value: new Date(), disabled: true }, Validators.required ],
    benefit_detail_id: [ { value: '', disabled: true }, Validators.required ],
    benefit_end_time: [ { value: new Date(), disabled: true }, Validators.required ],
    benefit_id: [ { value: '', disabled: true }, Validators.required ],
    user_id: [ '', Validators.required ],
    request_comment: [ '' ],
  }, {
    validators: this.validatorService.maxDateGreaterThanMinDate( 'benefit_begin_time', 'benefit_end_time' )
  } );
  currentUserBenefits?: BenefitUser;
  date!: { year: number, month: number };
  dependencies!: Dependency[];
  disabledDays: number[] = [];
  disableSubmitBtn: boolean = false;
  isFullDay: any
  loader = this.lbs.useRef();
  nodes!: any[];
  numberOfMonths: number = 1;
  selectedBenefitDetail?: BenefitDetail;
  user?: User;
  users?: User[];
  userAndBenefitSpinner: boolean = true;
  usesDateRanges: any;

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

  get benefitBeginTimeErrors (): string {
    const errors = this.createForm.get( 'benefit_begin_time' )?.errors;
    if ( !errors ) return '';
    if ( errors![ 'required' ] ) {
      return 'El campo es obligatorio';
    }
    if ( errors![ 'maxDateGreaterThanMinDate' ] ) {
      return 'La fecha de inicio no puede ser mayor o igual a la fecha de fin';
    }
    return '';
  }

  get benefitEndTimeErrors (): string {
    const errors = this.createForm.get( 'benefit_end_time' )?.errors;
    if ( !errors ) return '';
    if ( errors![ 'required' ] ) {
      return 'El campo es obligatorio';
    }
    return '';
  }

  constructor (
    private activatedRoute: ActivatedRoute,
    private benefitService: BenefitService,
    private benefitUserService: BenefitUserService,
    private fb: FormBuilder,
    private lbs: LoadingBarService,
    private pgConfig: PrimeNGConfig,
    private router: Router,
    private ms: MessageService,
    private userService: UserService,
    private validatorService: ValidatorService,
  ) {
    this.createForm.get( 'user_id' )?.setValue( localStorage.getItem( 'uid' ) );
  }

  ngOnInit (): void {
    this.loader.start();
    this.pgConfig.setTranslation( this.es );
    combineLatest( {
      benefits: this.benefitService.indexAvailable(),
      benefitUser: this.router.url.includes( 'edit' ) ? this.activatedRoute.params.pipe(
        switchMap( ( { id } ) => this.benefitUserService.show( id ) )
      ) : of( undefined ),
      user: this.userService.show( this.createForm.get( 'user_id' )?.value )
    } )
      .subscribe( {
        next: ( { benefits, benefitUser, user } ) => {
          this.user = Object.values( user )[ 0 ];
          this.createForm.get( 'selectedNodes' )?.enable();
          this.benefits = benefits;
          this.createForm.get( 'benefit_id' )?.enable();
          this.userAndBenefitSpinner = false;
          if ( benefitUser ) {
            this.currentUserBenefits = Object.values( benefitUser )[ 0 ];
            let simulatedEvent = {
              originalEvent: {
                target: {
                  textContent: this.currentUserBenefits?.benefit_user[ 0 ].benefits.name
                }
              },
              value: this.currentUserBenefits?.benefit_user[ 0 ].benefits.id
            }
            this.fillBenefitDetail( simulatedEvent );
            this.createForm.get( 'benefit_id' )?.setValue( this.currentUserBenefits!.benefit_user[ 0 ].benefits.id );
            this.createForm.get( 'benefit_id' )?.disable();
          }
          this.loader.complete();
        },
        error: ( { error } ) => {
          this.router.navigate( [ 'basic', 'benefit-employee' ] );
          this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } )
          this.loader.complete();
        }
      } );
    this.createForm.get( 'benefit_detail_id' )!.valueChanges
      .subscribe( currentBenefitDetail => {
        this.selectedBenefitDetail = this.benefit_details?.find( benefits => benefits.id === Number.parseInt( currentBenefitDetail || 0 ) );
      } );
  }

  isValidField ( campo: string ) {
    return this.createForm.controls[ campo ].errors
      && this.createForm.controls[ campo ].touched;
  }

  save () {
    if ( this.createForm.invalid ) {
      this.createForm.markAllAsTouched();
      return;
    }
    if ( this.currentUserBenefits?.id ) {
      this.benefitUserService.update( this.currentUserBenefits!.benefit_user[ 0 ].id, this.createForm.getRawValue() )
        .subscribe( {
          next: () => {
            this.disableSubmitBtn = false;
            this.ms.add( { severity: 'success', summary: 'Actualizado' } )
            this.createForm.get( 'user_id' )?.setValue( localStorage.getItem( 'uid' ) );
            this.router.navigate( [ '../../', 'show', this.currentUserBenefits!.benefit_user[ 0 ].id ], { relativeTo: this.activatedRoute } );
          },
          error: ( { error } ) => {
            this.disableSubmitBtn = false;
            this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } )
          }
        } );
    }
    else {
      this.benefitUserService.create( this.createForm.getRawValue() )
        .subscribe( {
          next: () => {
            this.disableSubmitBtn = false;
            this.ms.add( { severity: 'success', summary: 'Creado' } )
            this.createForm.reset();
            this.createForm.get( 'user_id' )?.setValue( localStorage.getItem( 'uid' ) );
          },
          error: ( { error } ) => {
            this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } )
            this.disableSubmitBtn = false;
          }
        } );
    }
    this.disableSubmitBtn = true;
  }

  fillBenefitDetail ( event: any ) {
    this.createForm.get( 'benefit_detail_id' )!.reset();
    this.createForm.get( 'benefit_detail_id' )!.disable();
    this.createForm.get( 'benefit_begin_time' )!.reset();
    this.createForm.get( 'benefit_begin_time' )!.disable();
    this.createForm.get( 'benefit_end_time' )!.reset();
    this.createForm.get( 'benefit_end_time' )!.disable();
    this.benefitDetailSpinner = false;
    combineLatest( {
      benefit_details: this.benefitService.show( event.value || event ),
      benefit_settings: this.benefitService.showSettings( event.value || event )
    } )
      .subscribe(
        {
          next: ( { benefit_details, benefit_settings } ) => {
            let benefitSettings: any = benefit_settings;
            let keys = Object.keys( benefitSettings[ 0 ] );
            this.benefit_settings = keys.map( ( key: any ) => {
              return {
                name: key,
                title: benefitSettings[ 0 ][ key ].title,
                description: benefitSettings[ 0 ][ key ].description,
                values: benefitSettings[ 0 ][ key ]
              }
            } );
            this.isFullDay = this.benefit_settings.find( setting => setting.name === 'is_full_day' )?.values;
            this.usesDateRanges = this.benefit_settings.find( setting => setting.name === 'uses_daterange' )?.values;
            this.benefit_details = Object.values( benefit_details )[ 0 ].benefit_detail;
            if ( this.createForm.get( 'benefit_id' )!.valid ) {
              this.benefitDetailSpinner = true;
            }
            if ( this.router.url.includes( 'edit' ) ) {
              this.createForm.get( 'benefit_detail_id' )?.setValue( this.currentUserBenefits!.benefit_user[ 0 ].benefit_detail.id );
              this.createForm.get( 'request_comment' )?.setValue( this.currentUserBenefits!.benefit_user[ 0 ].request_comment );
              this.createForm.get( 'request_comment' )?.disable();
              this.benefitDetailSpinner = true;
              this.createForm.get( 'benefit_begin_time' )!.enable();
              this.createForm.get( 'benefit_end_time' )!.enable();
            }
            this.createForm.get( 'benefit_detail_id' )!.enable();
            this.initCalendar( event );
          },
          error: ( { error } ) => {
            this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } )
          }
        }
    );
  }

  initCalendar ( event: any ) {
    let initialDate = new Date();
    let finalDate = new Date();
    this.createForm.get( 'benefit_begin_time' )!.reset();
    this.createForm.get( 'benefit_end_time' )!.reset();
    let permissionName = event.originalEvent.target.textContent;
    if ( event.originalEvent && permissionName == "Mi Viernes" ) {
      this.disabledDays = [ 0, 1, 2, 3, 4, 6 ];
      initialDate.setHours( 13, 0, 0, 0 );
      finalDate.setHours( 13, 0, 0, 0 );
    } else {
      this.disabledDays = [];
      initialDate.setHours( 7, 0, 0, 0 );
      finalDate.setHours( 7, 0, 0, 0 );
    }
    this.createForm.get( 'benefit_begin_time' )?.setValue( initialDate );
    this.createForm.get( 'benefit_end_time' )?.setValue( finalDate );
  }

  enableCalendar () {
    this.createForm.get( 'benefit_begin_time' )!.enable();
    this.createForm.get( 'benefit_end_time' )!.enable();
    this.setCalendarDates();
    if ( !this.usesDateRanges ) this.createForm.get( 'benefit_end_time' )!.disable();
  }

  setCalendarDates () {
    let initialDate = new Date( this.createForm.get( 'benefit_begin_time' )?.value );
    let finalDate = new Date( this.createForm.get( 'benefit_end_time' )?.value );
    if ( !this.usesDateRanges && this.selectedBenefitDetail ) {
      finalDate = initialDate;
      finalDate = addHours( finalDate, this.selectedBenefitDetail!.time_hours );
    }
    const regex = new RegExp( '([\\D ]+)(?<startHour>[\\d]+):(?<startMinute>[\\d]+)([\\D ]+)(?<endHour>[\\d]+):(?<endMinute>[\\d]+)([\\D ]*)' );
    if ( this.selectedBenefitDetail && regex.test( this.selectedBenefitDetail.name ) ) {
      const { groups: { startHour, startMinute, endHour, endMinute } }: any = regex.exec( this.selectedBenefitDetail.name );
      initialDate.setHours( startHour, startMinute, 0, 0 );
      finalDate.setHours( endHour, endMinute, 0, 0 );
    }
    if ( this.selectedBenefitDetail && this.selectedBenefitDetail.name === 'Mañana' ) {
      initialDate.setHours( 7, 0, 0, 0 );
      finalDate = initialDate;
      finalDate = addHours( finalDate, this.selectedBenefitDetail!.time_hours );
    } else if ( this.selectedBenefitDetail && this.selectedBenefitDetail.name === 'Tarde' ) {
      initialDate.setHours( 13, 0, 0, 0 );
      finalDate = initialDate;
      finalDate = addHours( finalDate, this.selectedBenefitDetail!.time_hours );
    }
    if ( this.isFullDay ) {
      initialDate.setHours( 0, 0, 0, 0 );
      finalDate.setHours( 0, 0, 0, 0 );
    }
    this.createForm.get( 'benefit_begin_time' )?.setValue( initialDate );
    this.createForm.get( 'benefit_end_time' )?.setValue( finalDate );
  }
}
