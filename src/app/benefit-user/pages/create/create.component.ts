import { Component, OnInit, Injectable, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BenefitService } from '../../../benefit/services/benefit.service';
import { Benefit } from '../../../benefit/interfaces/benefit.interface';
import { BenefitDetail } from '../../../benefit-detail/interfaces/benefit-detail.interface';
import { tap, switchMap } from 'rxjs/operators';
import { NgbTimeAdapter, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { addHours } from 'date-fns';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../../../user/services/user.service';
import { User } from '../../../user/interfaces/user.interface';
import { AuthService } from '../../../auth/services/auth.service';
import { BenefitUserService } from '../../services/benefit-user.service';

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

  disableSubmitBtn: boolean = false;
  benefits!: Benefit[];
  benefit_details?: BenefitDetail[];
  createForm: FormGroup = this.fb.group( {
    benefit_id: [ { value: '', disabled: true }, Validators.required ],
    benefit_detail_id: [ { value: '', disabled: true }, Validators.required ],
    time: [ '', Validators.required ],
    model: [ '', Validators.required ],
    benefit_begin_time: [ '' ],
    benefit_end_time: [ '' ],
    user_id: [ { value: '', disabled: true } ]
  } );
  date!: { year: number, month: number };
  time!: { hour: number, minute: number };
  selectedBenefitDetail?: BenefitDetail;
  benefit_begin_time!: string;
  users!: User[];
  meridian: boolean = true;
  userAndBenefitSpinner: boolean = true;
  benefitDetailSpinner: boolean = true;


  constructor (
    private fb: FormBuilder,
    private authService: AuthService,
    private benefitService: BenefitService,
    private benefitUserService: BenefitUserService,
    private userService: UserService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit (): void {

    this.authService.validarAdmin()
      .pipe(
        switchMap( response => {
          return response
            ? this.userService.index()
            : this.userService.show( Number.parseInt( localStorage.getItem( 'uid' )! ) );
        } )
      )
      .subscribe( users => {
        this.users = Object.values( users );
        this.createForm.get( 'user_id' )?.enable();
      } );

    // this.createForm.get( 'user_id' )?.setValue( localStorage.getItem( 'uid' ) );
    this.benefitService.index()
      .subscribe( {
        next: ( benefits ) => {
          this.benefits = benefits;
          this.createForm.get( 'benefit_id' )?.enable();
          this.userAndBenefitSpinner = false;

        },
        error: ( error ) => {
          this.router.navigateByUrl( 'benefit-employee' );
          Swal.fire( {
            title: 'Error',
            icon: 'error',
            html: error.error.msg,
            timer: 3000,
            timerProgressBar: true,
            didOpen: ( toast ) => {
              toast.addEventListener( 'mouseenter', Swal.stopTimer )
              toast.addEventListener( 'mouseleave', Swal.resumeTimer )
            }
          } )
        }
      } );

    this.createForm.get( 'benefit_id' )?.valueChanges
      .pipe(
        tap( ( _ ) => {
          this.createForm.get( 'benefit_detail_id' )?.reset( '' );
          if ( this.createForm.get( 'benefit_id' )?.valid ) this.benefitDetailSpinner = false;
        } ),
        switchMap( benefit => this.benefitService.show( benefit ) )
      )
      .subscribe( benefit_details => {
        this.benefit_details = Object.values( benefit_details )[ 0 ].benefit_detail;
        if ( this.createForm.get( 'benefit_id' )?.valid ) {
          this.benefitDetailSpinner = true;
          this.createForm.get( 'benefit_detail_id' )?.enable();
        }
      } );

    this.createForm.get( 'benefit_detail_id' )?.valueChanges
      .subscribe( currentBenefitDetail => {
        this.selectedBenefitDetail = this.benefit_details?.find( benefits => benefits.id === Number.parseInt( currentBenefitDetail ) );
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
    this.benefitUserService.create( this.createForm.value )
      .subscribe( {
        next: ( resp ) => {
          Swal.fire( {
            title: 'Creado',
            text: JSON.stringify( resp ),
            icon: 'success',
            showClass: {
              popup: 'animate__animated animate__fadeIn'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            }
          } );
          // this.createForm.reset();
        }
      } );
  }

}
