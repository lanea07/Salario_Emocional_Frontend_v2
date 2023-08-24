import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

import Swal from 'sweetalert2';

import { Position } from '../../interfaces/position.interface';
import { PositionService } from '../../services/position.service';
import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';
import { Title } from '@angular/platform-browser';

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
  position: Position = {
    name: '',
    created_at: new Date,
    updated_at: new Date
  };

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
    private as: AlertService,
    private fb: FormBuilder,
    private positionService: PositionService,
    private router: Router,
    private titleService: Title
  ) {
    this.titleService.setTitle( 'Nuevo Cargo' );
  }


  ngOnInit () {

    this.positionService.index()
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
        switchMap( ( { id } ) => this.positionService.show( id ) )
      )
      .subscribe( {
        next: ( position ) => {
          const extractPositionDetail = position;
          this.position = extractPositionDetail;
          this.createForm.get( 'name' )?.setValue( extractPositionDetail.name );
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

    if ( this.position.id ) {
      this.positionService.update( this.position.id, this.createForm.value )
        .subscribe(
          {
            next: () => {
              this.router.navigateByUrl( `/position/show/${ this.position.id }` );
              this.as.subscriptionAlert( subscriptionMessageTitle.ACTUALIZADO, subscriptionMessageIcon.SUCCESS );
            },
            error: ( { error } ) => {
              this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.message );
              this.disableSubmitBtn = false;
            }
          } );

    } else {

      this.positionService.create( this.createForm.value )
        .subscribe(
          {
            next: ( { id } ) => {
              this.router.navigateByUrl( `/position/show/${ id }` )
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
