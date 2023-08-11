import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BenefitDetailService } from '../../services/benefit-detail.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidatorService } from 'src/app/shared/services/validator.service';
import { switchMap } from 'rxjs';
import { Benefit } from 'src/app/benefit/interfaces/benefit.interface';
import Swal from 'sweetalert2';

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
  disableSubmitBtn: boolean = false;
  createForm: FormGroup = this.fb.group( {
    name: [ '', [ Validators.required, Validators.minLength( 5 ) ] ],
    time_hours: [ '', [ this.validatorService.minIfFilled( 0 ) ] ]
  } );


  get benefitFormGroup (): FormGroup | any {
    return this.createForm.controls[ 'benefitFormGroup' ];
  }

  constructor (
    private fb: FormBuilder,
    private benefitDetailService: BenefitDetailService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private validatorService: ValidatorService
  ) { }


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
              Swal.fire( {
                title: 'Actualizado',
                icon: 'success',
              } );
              this.router.navigateByUrl( `/benefit-detail/show/${ this.benefitDetail.id }` )
            },
            error: err => {
              Swal.fire( {
                title: 'Error',
                text: err.error.message,
                icon: 'error'
              } );
              this.disableSubmitBtn = false;
            }
          }
        );

    } else {

      this.benefitDetailService.create( this.createForm.value )
        .subscribe( {
          next: benefitDetailCreated => {
            this.router.navigateByUrl( `/benefit-detail/show/${ benefitDetailCreated.id }` );
            Swal.fire( {
              title: 'Creado',
              icon: 'success'
            } );
          },
          error: err => {
            this.disableSubmitBtn = false;
            Swal.fire( {
              title: 'Error',
              text: err.error.message,
              icon: 'error'
            } );
            this.disableSubmitBtn = false;
          }
        } );
    }
    this.disableSubmitBtn = true;
  }

}
