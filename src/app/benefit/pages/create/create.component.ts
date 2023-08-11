import { Component } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, Observable, of } from 'rxjs';
import Swal from 'sweetalert2';
import { Benefit } from '../../interfaces/benefit.interface';
import { BenefitService } from '../../services/benefit.service';
import { BenefitDetailService } from 'src/app/benefit-detail/services/benefit-detail.service';
import { BenefitDetail } from 'src/app/benefit-detail/interfaces/benefit-detail.interface';
import { ValidatorService } from 'src/app/shared/services/validator.service';

@Component( {
  selector: 'benefit-create',
  templateUrl: './create.component.html',
  styles: [
  ]
} )
export class CreateComponent {

  benefit: Benefit = {
    name: '',
    created_at: new Date,
    updated_at: new Date,
    benefit_detail: []
  };
  benefitDetails: BenefitDetail[] = [];
  disableSubmitBtn: boolean = false;
  createForm: FormGroup = this.fb.group( {
    name: [ '', [ Validators.required, Validators.minLength( 5 ) ] ]
  } );
  loaded: boolean = false;

  get benefitDetailFormGroup (): FormGroup | any {
    return this.createForm.controls[ 'benefitDetailFormGroup' ];
  }

  constructor (
    private fb: FormBuilder,
    private benefitService: BenefitService,
    private benefitDetailService: BenefitDetailService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private validatorService: ValidatorService
  ) { }


  ngOnInit () {

    this.benefitDetailService.index().subscribe( {
      next: ( benefitDetails ) => {
        this.benefitDetails = benefitDetails;
        this.loaded = true;
        this.createForm.addControl( "benefitDetailFormGroup", this.buildBenefitDetailFormGroup( benefitDetails ) );
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
        } );
      }
    } );

    if ( !this.router.url.includes( 'edit' ) ) {
      return;
    }

    this.activatedRoute.params
      .pipe(
        switchMap( ( { id } ) => this.benefitService.show( id ) )
      )
      .subscribe( benefit => {
        const extractBenefit = Object.values( benefit )[ 0 ];
        this.benefit = extractBenefit;
        this.createForm.get( 'name' )?.setValue( extractBenefit.name );
        Object.keys( this.benefitDetailFormGroup.controls ).forEach( ( key: string ) => {
          Object.values<Benefit>( extractBenefit.benefit_detail ).forEach( benefitDetail => {
            if ( key === benefitDetail.id!.toString() ) {
              this.benefitDetailFormGroup.get( key ).setValue( true );
            }
          } );

        } );
      } );

  }

  campoEsValido ( campo: string ) {

    try {
      return this.createForm.controls[ campo ].errors
        && this.createForm.controls[ campo ].touched;
    } catch ( error ) {
      Object.keys( this.benefitDetailFormGroup.controls ).forEach( ( key: string ) => {
        return this.benefitDetailFormGroup.get( key ).errors
          && this.benefitDetailFormGroup.get( key ).touched;
      } );
    }
    return;
  }

  save () {
    if ( this.createForm.invalid ) {
      this.createForm.markAllAsTouched();
      return;
    }

    if ( this.benefit.id ) {
      this.benefitService.update( this.benefit.id, this.createForm.value )
        .subscribe(
          {
            next: () => {
              Swal.fire( {
                title: 'Actualizado',
                icon: 'success'
              } )
              this.router.navigateByUrl( `/benefit/show/${ this.benefit.id }` )
            },
            error: err => {
              Swal.fire( {
                title: 'Error',
                text: err.error.message,
                icon: 'error'
              } )
              this.disableSubmitBtn = false;
            }
          } );

    } else {

      this.benefitService.create( this.createForm.value )
        .subscribe(
          {
            next: benefitCreated => {
              this.router.navigateByUrl( `/benefit/show/${ benefitCreated.id }` )
              Swal.fire( {
                title: 'Creado',
                icon: 'success'
              } );
            },
            error: err => {
              Swal.fire( {
                title: 'Error',
                text: err.error.message,
                icon: 'error'
              } )
              this.disableSubmitBtn = false;
            }
          } );
    }
    this.disableSubmitBtn = true;
  }

  buildBenefitDetailFormGroup ( benefitDetails: Benefit[], selectedbenefitDetailsIds: number[] = [] ): FormGroup {
    let group = this.fb.group( {}, {
      validators: [ this.atLeastOneCheckboxCheckedValidator() ]
    } );
    benefitDetails.forEach( benefitDetail => {
      let isSelected = selectedbenefitDetailsIds.some( id => id === benefitDetail.id );
      group.addControl( benefitDetail.id!.toString(), this.fb.control( isSelected, {}, this.validatorService.checkboxRequired() ) );
    } );
    return group;
  }

  atLeastOneCheckboxCheckedValidator ( minRequired = 1 ): ValidationErrors {
    return function validate ( formGroup: FormGroup ) {
      let checked = 0;

      Object.keys( formGroup.controls ).forEach( key => {
        const control = formGroup.controls[ key ];
        if ( control.value ) {
          checked++;
        }
      } );

      if ( checked < minRequired ) {
        return {
          requireCheckboxToBeChecked: true,
        };
      }

      return null;
    };
  }

}
