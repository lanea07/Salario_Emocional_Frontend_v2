import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';
import { ValidatorService } from 'src/app/shared/services/validator.service';
import { AuthService } from '../../services/auth.service';

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
    current_password: [ , [ Validators.required, Validators.minLength( 6 ) ] ],
    password: [ , [ Validators.required, Validators.minLength( 6 ) ] ],
    password_confirmation: [ , [ Validators.required, Validators.minLength( 6 ) ] ],
    device_name: [ 'PC' ]
  }, {
    validators: this.validatorService.camposIguales( 'password', 'password_confirmation' )
  } );
  showScreen: boolean = false;

  constructor (
    private as: AlertService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private validatorService: ValidatorService
  ) {
    this.authService.validarRequirePassChange()
      .subscribe( {
        next: ( resp ) => resp ? this.showScreen = true : this.router.navigate( [ '/basic/benefit-employee' ] )
      } );
  }

  campoEsValido ( campo: string ) {
    return this.miFormulario.get( campo )?.invalid
      && this.miFormulario.get( campo )?.touched;
  }

  submitPassChange () {
    this.authService.passwordChange( this.miFormulario.value )
      .subscribe( {
        next: () => {
          this.router.navigate( [ '/basic/benefit-employee' ] );
          this.as.subscriptionAlert( subscriptionMessageTitle.PASSCHANGED, subscriptionMessageIcon.SUCCESS );
        },
        error: ( err ) => {
          this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, err.error.message );
        }
      } )
  }

}
