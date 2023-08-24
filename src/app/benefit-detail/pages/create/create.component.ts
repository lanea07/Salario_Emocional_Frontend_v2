import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { switchMap } from 'rxjs';
import Swal from 'sweetalert2';

import { Benefit } from 'src/app/benefit/interfaces/benefit.interface';
import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';
import { ValidatorService } from 'src/app/shared/services/validator.service';
import { BenefitDetailService } from '../../services/benefit-detail.service';
import { Title } from '@angular/platform-browser';

@Component( {
  selector: 'benefitdetail-create',
  templateUrl: './create.component.html',
  styles: [
  ]
} )
export class CreateComponent {

  benefitDetail: Benefit = {
    name: '',
    created_at: new Date,
    updated_at: new Date,
    benefit_detail: []
  };
  createForm: FormGroup = this.fb.group( {
    name: [ '', [ Validators.required, Validators.minLength( 5 ) ] ],
    time_hours: [ '', [ this.validatorService.minIfFilled( 0 ) ] ]
  } );
  disableSubmitBtn: boolean = false;


  get benefitFormGroup (): FormGroup | any {
    return this.createForm.controls[ 'benefitFormGroup' ];
  }

  get benefitDetailNameErrors (): string {
    const errors = this.createForm.get( 'name' )?.errors;
    if ( errors![ 'minlength' ] ) {
      return 'El nombre no cumple con el largo mínimo de 5 caracteres';
    }
    return '';
  }

  get timeHoursErrors (): string {
    const errors = this.createForm.get( 'time_hours' )?.errors;
    if ( errors![ 'minIfFilled' ] ) {
      return errors![ 'minIfFilled' ];
    }
    return '';
  }

  constructor (
    private activatedRoute: ActivatedRoute,
    private as: AlertService,
    private benefitDetailService: BenefitDetailService,
    private fb: FormBuilder,
    private router: Router,
    private titleService: Title,
    private validatorService: ValidatorService
  ) {
    this.titleService.setTitle( 'Nuevo detalle de Beneficio' );
  }


  ngOnInit () {

    this.benefitDetailService.index()
      .subscribe( {
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
      } )

    if ( !this.router.url.includes( 'edit' ) ) {
      return;
    }

    this.activatedRoute.params
      .pipe(
        switchMap( ( { id } ) => this.benefitDetailService.show( id ) )
      )
      .subscribe( {
        next: ( benefitDetail ) => {
          const extractBenefitDetail = Object.values( benefitDetail )[ 0 ];
          this.benefitDetail = extractBenefitDetail;
          this.createForm.get( 'name' )?.setValue( extractBenefitDetail.name );
          this.createForm.get( 'time_hours' )?.setValue( extractBenefitDetail.time_hours );
        },
        error: ( { error } ) => {
          this.router.navigateByUrl( 'benefit-employee' );
          Swal.fire( {
            title: 'Error',
            icon: 'error',
            html: error.msg,
            timer: 3000,
            timerProgressBar: true,
            didOpen: ( toast ) => {
              toast.addEventListener( 'mouseenter', Swal.stopTimer )
              toast.addEventListener( 'mouseleave', Swal.resumeTimer )
            }
          } );
        }
      } );

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

    if ( this.benefitDetail.id ) {
      this.benefitDetailService.update( this.benefitDetail.id, this.createForm.value )
        .subscribe(
          {
            next: () => {
              this.router.navigateByUrl( `/benefit-detail/show/${ this.benefitDetail.id }` )
              this.as.subscriptionAlert( subscriptionMessageTitle.ACTUALIZADO, subscriptionMessageIcon.SUCCESS );
            },
            error: ( { error } ) => {
              this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.message );
              this.disableSubmitBtn = false;
            }
          }
        );

    } else {

      this.benefitDetailService.create( this.createForm.value )
        .subscribe( {
          next: ( { id } ) => {
            this.router.navigateByUrl( `/benefit-detail/show/${ id }` );
            this.as.subscriptionAlert( subscriptionMessageTitle.CREADO, subscriptionMessageIcon.SUCCESS );
          },
          error: ( { error } ) => {
            this.disableSubmitBtn = false;
            this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.message );
          }
        } );
    }
    this.disableSubmitBtn = true;
  }

}
