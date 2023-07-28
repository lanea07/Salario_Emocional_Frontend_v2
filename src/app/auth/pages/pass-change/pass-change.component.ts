import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorService } from 'src/app/shared/services/validator.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

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
    retypePassword: [ , [ Validators.required, Validators.minLength( 6 ) ] ]
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
        next: ( resp ) => this.showScreen = true
      } )
  }

  campoEsValido ( campo: string ) {
    return this.miFormulario.get( campo )?.invalid
      && this.miFormulario.get( campo )?.touched;
  }

  submitPassChange () {
    this.authService.passwordChange( this.miFormulario.value )
      .subscribe()
  }

}
