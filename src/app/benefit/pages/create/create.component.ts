import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { switchMap } from 'rxjs';
import Swal from 'sweetalert2';

import { BenefitDetail } from 'src/app/benefit-detail/interfaces/benefit-detail.interface';
import { BenefitDetailService } from 'src/app/benefit-detail/services/benefit-detail.service';
import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';
import { ValidatorService } from 'src/app/shared/services/validator.service';
import { Benefit } from '../../interfaces/benefit.interface';
import { BenefitService } from '../../services/benefit.service';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

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
  createForm: FormGroup = this.fb.group( {
    name: [ '', [ Validators.required, Validators.minLength( 5 ) ] ],
    filePoliticas: [],
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
    private titleService: Title,
    private validatorService: ValidatorService
  ) {
    this.titleService.setTitle( 'Nuevo Beneficio' );
  }


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
      .subscribe(
        {
          next: benefit => {
            console.log( benefit );
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
            if ( this.benefit.politicas_path ) {
              this.filePoliticas = `${ environment.baseUrl }/${ this.benefit.politicas_path }`;
              this.politicsInput = false;
            } else {
              this.politicsInput = true;
            }
          },
          error: ( { error } ) => {
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

    if ( this.benefit.id ) {
      formData.append( '_method', 'PUT' );
      this.benefitService.update( this.benefit.id, formData )
        .subscribe(
          {
            next: () => {
              this.router.navigateByUrl( `/benefit/show/${ this.benefit.id }` )
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
              this.router.navigateByUrl( `/benefit/show/${ id }` )
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
