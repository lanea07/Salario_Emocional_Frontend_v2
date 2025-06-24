import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

import { MessageService } from 'primeng/api';

import { Benefit } from 'src/app/benefit/interfaces/benefit.interface';
import { ValidatorService } from 'src/app/shared/services/validator.service';
import { BenefitDetailService } from '../../services/benefit-detail.service';
import { BenefitDetails } from '../../interfaces/benefit-detail.interface';

@Component( {
    selector: 'benefitdetail-create',
    templateUrl: './create.component.html',
    styles: [],
    standalone: false
} )
export class CreateComponent {

  benefitDetail?: Benefit;
  createForm: FormGroup = this.fb.group( {
    name: [ '', [ Validators.required, Validators.minLength( 5 ) ] ],
    time_hours: [ '', [ Validators.required, this.validatorService.minIfFilled( 1 ) ] ]
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
    private benefitDetailService: BenefitDetailService,
    private fb: FormBuilder,
    private router: Router,
    private ms: MessageService,
    private validatorService: ValidatorService
  ) { }


  ngOnInit () {

    this.benefitDetailService.index()
      .subscribe( {
        error: ( { error } ) => this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } )
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
          this.router.navigate( [ 'basic', 'benefit-employee' ] );
          this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } );
        }
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

    if ( this.benefitDetail?.id ) {
      this.benefitDetailService.update( this.benefitDetail.id, this.createForm.value )
        .subscribe(
          {
            next: () => {
              this.router.navigate( [ `../show`, this.benefitDetail?.id ], { relativeTo: this.activatedRoute } );
              this.ms.add( { severity: 'success', summary: 'Actualizado' } );              
            },
            error: ( { error } ) => {
              this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } );
              this.disableSubmitBtn = false;
            }
          }
        );

    } else {

      this.benefitDetailService.create( this.createForm.value )
        .subscribe( {
          next: ( { data }: BenefitDetails ) => {
            this.router.navigate( [ `../show`, data[0].id ], { relativeTo: this.activatedRoute } );
            this.ms.add( { severity: 'success', summary: 'Success' } );
          },
          error: ( { error } ) => {
            this.disableSubmitBtn = false;
            this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } );
          }
        } );
    }
    this.disableSubmitBtn = true;
  }

}
