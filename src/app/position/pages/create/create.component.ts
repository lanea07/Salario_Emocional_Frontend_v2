import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

import { MessageService } from 'primeng/api';

import { Position } from '../../interfaces/position.interface';
import { PositionService } from '../../services/position.service';

@Component( {
  selector: 'position-create',
  templateUrl: './create.component.html',
  styles: [
  ]
} )
export class CreateComponent {

  createForm: FormGroup = this.fb.group( {
    name: [ '', [ Validators.required, Validators.minLength( 5 ) ] ]
  } );
  disableSubmitBtn: boolean = false;
  position?: Position;

  get positionNameErrors (): string {
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
    private fb: FormBuilder,
    private positionService: PositionService,
    private router: Router,
    private ms: MessageService,
  ) { }


  ngOnInit () {

    this.positionService.index()
      .subscribe( {
        error: ( { error } ) => this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } )
      } )

    if ( !this.router.url.includes( 'edit' ) ) {
      return;
    }

    this.activatedRoute.params
      .pipe(
        switchMap( ( { id } ) => this.positionService.show( id ) )
      )
      .subscribe( {
        next: ( position ) => {
          const extractPositionDetail = position;
          this.position = extractPositionDetail;
          this.createForm.get( 'name' )?.setValue( extractPositionDetail.name );
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

    if ( this.position?.id ) {
      this.positionService.update( this.position?.id, this.createForm.value )
        .subscribe(
          {
            next: () => {
              this.router.navigate( [ `../show`, this.position?.id ], { relativeTo: this.activatedRoute } );
              this.ms.add( { severity: 'success', summary: 'Actualizado' } )
            },
            error: ( { error } ) => {
              this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } )
              this.disableSubmitBtn = false;
            }
          } );

    } else {

      this.positionService.create( this.createForm.value )
        .subscribe(
          {
            next: ( { id } ) => {
              this.router.navigate( [ `../show`, id ], { relativeTo: this.activatedRoute } );
              this.ms.add( { severity: 'success', summary: 'Creado' } )
            },
            error: ( { error } ) => {
              this.disableSubmitBtn = false;
              this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } )
            }
          } );
    }
    this.disableSubmitBtn = true;
  }

}
