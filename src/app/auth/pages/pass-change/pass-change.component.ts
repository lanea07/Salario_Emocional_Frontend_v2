import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { ValidatorService } from 'src/app/shared/services/validator.service';
import { AuthService } from '../../services/auth.service';
import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';

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
    private as: AlertService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private titleService: Title,
    private validatorService: ValidatorService
  ) {
    this.authService.validarRequirePassChange()
      .subscribe( {
        next: ( resp ) => resp ? this.showScreen = true : this.router.navigate( [ 'benefit-employee' ] )
      } );
    this.titleService.setTitle( 'Cambiar Contraseña' );
  }

  campoEsValido ( campo: string ) {
    return this.miFormulario.get( campo )?.invalid
      && this.miFormulario.get( campo )?.touched;
  }

  submitPassChange () {
    this.authService.passwordChange( this.miFormulario.value )
      .subscribe( {
        next: () => {
          this.router.navigate( [ 'benefit-employee' ] );
          this.as.subscriptionAlert( subscriptionMessageTitle.PASSCHANGED, subscriptionMessageIcon.SUCCESS );
        },
        error: ( err ) => {
          this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, err.error.message );
        }
      } )
  }

}
