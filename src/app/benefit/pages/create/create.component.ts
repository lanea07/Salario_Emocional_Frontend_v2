import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, switchMap } from 'rxjs';

import { BenefitDetail } from 'src/app/benefit-detail/interfaces/benefit-detail.interface';
import { BenefitDetailService } from 'src/app/benefit-detail/services/benefit-detail.service';
import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';
import { ValidatorService } from 'src/app/shared/services/validator.service';
import { Benefit } from '../../interfaces/benefit.interface';
import { BenefitService } from '../../services/benefit.service';

@Component( {
  selector: 'benefit-create',
  templateUrl: './create.component.html',
  styles: [
  ]
} )
export class CreateComponent {

  benefit?: Benefit;
  benefitDetails?: BenefitDetail[];
  createForm: FormGroup = this.fb.group( {
    name: [ '', [ Validators.required, Validators.minLength( 5 ) ] ],
    filePoliticas: [],
    valid_id: [ '', Validators.required ],
  } );
  disableSubmitBtn: boolean = false;
  filePoliticas: string = "";
  loaded: boolean = false;
  politicsInput: boolean = true;

  get benefitDetailFormGroup (): FormGroup | any {
    return this.createForm.controls[ 'benefitDetailFormGroup' ];
  }

  get benefitNameErrors (): string {
    const errors = this.createForm.get( 'name' )?.errors;
    if ( errors![ 'minlength' ] ) {
      return 'El nombre no cumple con el largo mínimo de 5 caracteres';
    }
    if ( errors![ 'required' ] ) {
      return 'El campo es obligatorio';
    }
    return '';
  }

  constructor (
    private activatedRoute: ActivatedRoute,
    private as: AlertService,
    private benefitDetailService: BenefitDetailService,
    private benefitService: BenefitService,
    private fb: FormBuilder,
    private router: Router,
    private validatorService: ValidatorService
  ) { }

  ngOnInit () {
    this.benefitDetailService.index()
      .pipe(
        switchMap( ( benefitDetails: BenefitDetail[] ) => {
          this.benefitDetails = benefitDetails;
          this.createForm.addControl( "benefitDetailFormGroup", this.buildBenefitDetailFormGroup( this.benefitDetails ) );
          this.loaded = true;
          return this.activatedRoute.params;
        } ),
        switchMap( ( { id } ) => {
          return id ? this.benefitService.show( id ) : EMPTY;
        } ),
      )
      .subscribe( {
        next: benefit => {
          const extractBenefit = Object.values( benefit )[ 0 ];
          this.benefit = extractBenefit;
          this.createForm.get( 'name' )?.setValue( extractBenefit.name );
          if ( this.benefitDetailFormGroup ) {
            Object.keys( this.benefitDetailFormGroup.controls ).forEach( ( key: string ) => {
              Object.values<Benefit>( extractBenefit.benefit_detail ).forEach( benefitDetail => {
                if ( key === benefitDetail.id!.toString() ) {
                  this.benefitDetailFormGroup.get( key ).setValue( true );
                }
              } );
            } );
          }
          if ( this.benefit?.politicas_path ) {
            this.filePoliticas = this.benefit.politicas_path;
            this.politicsInput = false;
          } else {
            this.politicsInput = true;
          }
          this.createForm.get( 'valid_id' )?.setValue( extractBenefit.valid_id );
        },
        error: ( { error } ) => this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.message )
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
    const formData = new FormData();
    formData.append( 'benefitDetailFormGroup', JSON.stringify( this.createForm.get( 'benefitDetailFormGroup' )!.value ) );
    formData.append( 'name', this.createForm.get( 'name' )!.value );
    formData.append( 'filePoliticas', this.createForm.get( 'filePoliticas' )!.value );
    formData.append( 'valid_id', this.createForm.get( 'valid_id' )!.value );
    if ( this.benefit?.id ) {
      formData.append( '_method', 'PUT' );
      this.benefitService.update( this.benefit.id, formData )
        .subscribe(
          {
            next: () => {
              this.router.navigate( [ `../show`, this.benefit?.id ], { relativeTo: this.activatedRoute } )
              this.as.subscriptionAlert( subscriptionMessageTitle.ACTUALIZADO, subscriptionMessageIcon.SUCCESS )
            },
            error: ( { error } ) => {
              this.disableSubmitBtn = false;
              this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.message );
            }
          } );
    } else {
      this.benefitService.create( formData )
        .subscribe(
          {
            next: ( { id } ) => {
              this.router.navigate( [ `../show`, id ], { relativeTo: this.activatedRoute } )
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

  buildBenefitDetailFormGroup ( benefitDetails: any[], selectedbenefitDetailsIds: number[] = [] ): FormGroup {
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

  onFileChange ( event: any ) {
    if ( event.target.files.length > 0 ) {
      const file = event.target.files[ 0 ];
      this.createForm.patchValue( {
        filePoliticas: file
      } );
    }
  }

  showInput () {
    this.politicsInput = true;
  }

}
