import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorService } from 'src/app/shared/services/validator.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component( {
  selector: 'app-pass-change',
  templateUrl: './pass-change.component.html',
  styles: [
  ]
} )
export class PassChangeComponent {

  get passErrorMsg (): string {
    const errors = this.miFormulario.get( 'password' )?.errors;
    if ( errors![ 'required' ] ) {
      return 'Obligatorio';
    }
    if ( errors![ 'minlength' ] ) {
      return 'La contraseña no cumple con el largo mínimo de 6 caracteres';
    }
    return '';
  }

  miFormulario: FormGroup = this.fb.group( {
    currentPassword: [ , [ Validators.required ] ],
    password: [ , [ Validators.required, Validators.minLength( 6 ) ] ],
    retypePassword: [ , [ Validators.required, Validators.minLength( 6 ) ] ],
    device_name: [ 'PC' ]
  }, {
    validators: this.validatorService.camposIguales( 'password', 'retypePassword' )
  } );
  showScreen: boolean = false;

  constructor (
    private fb: FormBuilder,
    private validatorService: ValidatorService,
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.validarRequirePassChange()
      .subscribe( {
        next: ( resp ) => resp ? this.showScreen = true : this.router.navigate( [ 'benefit-employee' ] )
      } )
  }

  campoEsValido ( campo: string ) {
    return this.miFormulario.get( campo )?.invalid
      && this.miFormulario.get( campo )?.touched;
  }

  submitPassChange () {
    this.authService.passwordChange( this.miFormulario.value )
      .subscribe( {
        next: ( resp ) => {
          Swal.fire( {
            title: 'Actualizado',
            icon: 'success',
            text: 'Contraseña actualizada',
            showClass: {
              popup: 'animate__animated animate__fadeIn'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            }
          } );
          this.router.navigate( [ 'benefit-employee' ] );
        },
        error: ( err ) => {
          Swal.fire( {
            title: 'Error',
            icon: 'error',
            text: JSON.stringify( err.error.message ),
            showClass: {
              popup: 'animate__animated animate__fadeIn'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            }
          } );
        }
      } )
  }

}
