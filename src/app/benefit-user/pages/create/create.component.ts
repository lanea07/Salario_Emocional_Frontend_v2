import { formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

import { NgbCalendar, NgbDate, NgbDatepicker, NgbTimeAdapter, NgbTimeStruct, NgbTimepicker } from '@ng-bootstrap/ng-bootstrap';
import { addHours } from 'date-fns';
import Swal from 'sweetalert2';

import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';
import { AuthService } from '../../../auth/services/auth.service';
import { BenefitDetail } from '../../../benefit-detail/interfaces/benefit-detail.interface';
import { Benefit } from '../../../benefit/interfaces/benefit.interface';
import { BenefitService } from '../../../benefit/services/benefit.service';
import { User } from '../../../user/interfaces/user.interface';
import { UserService } from '../../../user/services/user.service';
import { BenefitUser } from '../../interfaces/benefit-user.interface';
import { BenefitUserService } from '../../services/benefit-user.service';
import { Title } from '@angular/platform-browser';

const pad = ( i: number ): string => ( i < 10 ? `0${ i }` : `${ i }` );


@Injectable()
export class NgbTimeStringAdapter extends NgbTimeAdapter<string> {
  fromModel ( value: string | null ): NgbTimeStruct | null {
    if ( !value ) {
      return null;
    }
    const split = value.split( ':' );
    return {
      hour: parseInt( split[ 0 ], 10 ),
      minute: parseInt( split[ 1 ], 10 ),
      second: parseInt( split[ 2 ], 10 ),
    };
  }

  toModel ( time: NgbTimeStruct | null ): string | null {
    return time != null ? `${ pad( time.hour ) }:${ pad( time.minute ) }:${ pad( time.second ) }` : null;
  }
}
@Component( {
  selector: 'benefitemployee-create',
  templateUrl: './create.component.html',
  styles: [
  ]
} )
export class CreateComponent implements OnInit {

  @ViewChild( NgbDatepicker ) dp?: NgbDatepicker;
  @ViewChild( NgbTimepicker ) tp?: NgbTimepicker;

  benefit_begin_time!: string;
  benefits!: Benefit[];
  benefit_details?: BenefitDetail[];
  benefitDetailSpinner: boolean = true;
  createForm: FormGroup = this.fb.group( {
    benefit_begin_time: [ '' ],
    benefit_detail_id: [ { value: '', disabled: true }, Validators.required ],
    benefit_end_time: [ '' ],
    benefit_id: [ { value: '', disabled: true }, Validators.required ],
    model: [ '', Validators.required ],
    time: [ '', Validators.required ],
    user_id: [ { value: '', disabled: true }, Validators.required ]
  } );
  currentUserBenefits?: BenefitUser;
  date!: { year: number, month: number };
  disableSubmitBtn: boolean = false;
  meridian: boolean = true;
  time!: { hour: number, minute: number };
  selectedBenefitDetail?: BenefitDetail;
  users!: User[];
  userAndBenefitSpinner: boolean = true;

  public isDayDisabled = ( date: NgbDate ) =>
    this.ngbCalendar.getWeekday( date ) === 6 || this.ngbCalendar.getWeekday( date ) === 7;

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

  get datePickerErrors (): string {
    const errors = this.createForm.get( 'model' )?.errors;
    if ( errors![ 'required' ] ) {
      return 'El campo es obligatorio';
    }
    return '';
  }

  get timePickerErrors (): string {
    const errors = this.createForm.get( 'time' )?.errors;
    if ( errors![ 'required' ] ) {
      return 'El campo es obligatorio';
    }
    return '';
  }


  constructor (
    private activatedRoute: ActivatedRoute,
    private as: AlertService,
    private authService: AuthService,
    private benefitService: BenefitService,
    private benefitUserService: BenefitUserService,
    private changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private ngbCalendar: NgbCalendar,
    private userService: UserService,
    private router: Router,
    private titleService: Title
  ) {
    this.titleService.setTitle( 'Nuevo beneficio para el colaborador' );
  }

  ngOnInit (): void {

    forkJoin( {
      validarAdmin: this.authService.validarAdmin()
        .pipe(
          switchMap( response => {
            return response
              ? this.userService.index()
              : this.userService.show( Number.parseInt( localStorage.getItem( 'uid' )! ) );
          } )
        ),
      loadBenefits: this.benefitService.index()
        .pipe(
          tap( ( benefits ) => {
            this.benefits = benefits;
            this.createForm.get( 'benefit_id' )?.enable();
            this.userAndBenefitSpinner = false;
          } )
        )
    } )
      .subscribe( {
        next: ( { validarAdmin, loadBenefits } ) => {
          this.users = Object.values( validarAdmin ).filter( each => each.valid_id );
          this.createForm.get( 'user_id' )?.enable();

          if ( this.router.url.includes( 'edit' ) ) {
            this.activatedRoute.params
              .pipe(
                switchMap( ( { id } ) => this.benefitUserService.show( id ) )
              )
              .subscribe(
                {
                  next: user => {
                    this.currentUserBenefits = Object.values( user )[ 0 ];
                    this.createForm.get( 'user_id' )?.disable();
                    this.createForm.get( 'benefit_id' )?.setValue( this.currentUserBenefits!.benefit_user[ 0 ].benefits.id );
                    this.dp?.navigateTo( {
                      year: new Date( this.currentUserBenefits!.benefit_user[ 0 ].benefit_begin_time ).getFullYear(),
                      month: new Date( this.currentUserBenefits!.benefit_user[ 0 ].benefit_begin_time ).getMonth() + 1
                    } )
                    this.createForm.get( 'model' )?.setValue( {
                      'year': new Date( this.currentUserBenefits!.benefit_user[ 0 ].benefit_begin_time ).getFullYear(),
                      'month': new Date( this.currentUserBenefits!.benefit_user[ 0 ].benefit_begin_time ).getMonth() + 1,
                      'day': new Date( this.currentUserBenefits!.benefit_user[ 0 ].benefit_begin_time ).getDate()
                    } );
                    this.tp?.updateHour( new Date( this.currentUserBenefits!.benefit_user[ 0 ].benefit_begin_time ).getHours().toString() );
                    this.tp?.updateMinute( new Date( this.currentUserBenefits!.benefit_user[ 0 ].benefit_begin_time ).getMinutes().toString() );
                    this.createForm.get( 'user_id' )?.setValue( this.currentUserBenefits!.id );
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
          Swal.fire( {
            title: 'Error',
            icon: 'error',
            html: error.error.message,
            timer: 3000,
            timerProgressBar: true,
            didOpen: ( toast ) => {
              toast.addEventListener( 'mouseenter', Swal.stopTimer )
              toast.addEventListener( 'mouseleave', Swal.resumeTimer )
            }
          } )
        }
      } );

    this.createForm.get( 'benefit_detail_id' )!.valueChanges
      .subscribe( currentBenefitDetail => {
        this.selectedBenefitDetail = this.benefit_details?.find( benefits => benefits.id === Number.parseInt( currentBenefitDetail || 0 ) );
      } );

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
    let date = `${ this.createForm.get( 'model' )?.value[ 'year' ] }-${ this.createForm.get( 'model' )?.value[ 'month' ] }-${ this.createForm.get( 'model' )?.value[ 'day' ] } ${ this.createForm.get( 'time' )?.value }`;
    this.createForm.get( 'benefit_begin_time' )?.setValue( formatDate( new Date( date ), 'yyyy-MM-dd HH:mm:ss', 'en-US' ) );
    this.createForm.get( 'benefit_end_time' )?.setValue( formatDate( addHours( new Date( date ), this.selectedBenefitDetail!.time_hours ).toString(), 'yyyy-MM-dd HH:mm:ss', 'en-US' ) );

    if ( this.currentUserBenefits?.id ) {
      this.benefitUserService.update( this.currentUserBenefits!.benefit_user[ 0 ].id, this.createForm.getRawValue() )
        .subscribe(
          {
            next: () => {
              this.disableSubmitBtn = false;
              this.as.subscriptionAlert( subscriptionMessageTitle.ACTUALIZADO, subscriptionMessageIcon.SUCCESS );
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
          },
          error: ( { error } ) => {
            this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.message );
            this.disableSubmitBtn = false;
          }
        } );
    }
    this.disableSubmitBtn = true;
  }

  fillBenefitDetail ( event: any ) {
    this.createForm.get( 'benefit_detail_id' )!.reset( '' );
    this.benefitDetailSpinner = false;
    this.benefitService.show( event.target?.value || event )
      .subscribe( benefit_details => {
        this.benefit_details = Object.values( benefit_details )[ 0 ].benefit_detail;
        if ( this.createForm.get( 'benefit_id' )!.valid ) {
          this.benefitDetailSpinner = true;
          this.createForm.get( 'benefit_detail_id' )!.enable();
        }
        if ( this.router.url.includes( 'edit' ) ) {
          this.createForm.get( 'benefit_detail_id' )?.setValue( this.currentUserBenefits!.benefit_user[ 0 ].benefit_detail.id );
        }
      } );
    if ( event.target && event.target.options[ event.target.options.selectedIndex ].text == "Mi Viernes" ) {
      this.isDayDisabled = ( date: NgbDate ) =>
        this.ngbCalendar.getWeekday( date ) !== 5;
    } else {
      this.isDayDisabled = ( date: NgbDate ) =>
        this.ngbCalendar.getWeekday( date ) === 6 || this.ngbCalendar.getWeekday( date ) === 7;
    }

  }
}
