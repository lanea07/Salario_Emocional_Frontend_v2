import { Component } from '@angular/core';
import { Position } from '../../interfaces/position.interface';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { PositionService } from '../../services/position.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ValidatorService } from '../../../shared/services/validator.service';
import { switchMap } from 'rxjs';
import Swal from 'sweetalert2';

@Component( {
  selector: 'position-create',
  templateUrl: './create.component.html',
  styles: [
  ]
} )
export class CreateComponent {

  position: Position = {
    name: '',
    created_at: new Date,
    updated_at: new Date
  };
  disableSubmitBtn: boolean = false;
  createForm: FormGroup = this.fb.group( {
    name: [ '', [ Validators.required, Validators.minLength( 5 ) ] ]
  } );

  constructor (
    private fb: FormBuilder,
    private positionService: PositionService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }


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
        .subscribe( resp => {
          Swal.fire( {
            title: 'Actualizado',
            icon: 'success',
            showClass: {
              popup: 'animate__animated animate__fadeIn'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            }
          } )
          this.router.navigateByUrl( `/position/show/${ this.position.id }` )
        } );

    } else {

      this.positionService.create( this.createForm.value )
        .subscribe( positionCreated => {
          this.router.navigateByUrl( `/position/show/${ positionCreated.id }` )
        } );
    }
    this.disableSubmitBtn = true;
  }

}
