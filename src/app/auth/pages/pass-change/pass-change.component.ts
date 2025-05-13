import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { LoadingBarService } from '@ngx-loading-bar/core';
import { MessageService } from 'primeng/api';

import { ValidatorService } from 'src/app/shared/services/validator.service';
import { AuthService } from '../../services/auth.service';

@Component( {
    selector: 'app-pass-change',
    templateUrl: './pass-change.component.html',
    styles: [],
    standalone: false
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

  loader = this.lbs.useRef();
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
    private authService: AuthService,
    private fb: FormBuilder,
    private lbs: LoadingBarService,
    private router: Router,
    private ms: MessageService,
    private validatorService: ValidatorService
  ) {
    this.authService.validarRequirePassChange()
      .subscribe( {
        next: ( resp ) => resp ? this.showScreen = true : this.router.navigate( [ 'basic', 'benefit-employee' ] )
      } );
  }

  isValidField ( campo: string ) {
    return this.miFormulario.get( campo )?.invalid
      && this.miFormulario.get( campo )?.touched;
  }

  submitPassChange () {
    this.loader.start();
    this.authService.passwordChange( this.miFormulario.value )
      .subscribe( {
        next: () => {
          this.loader.complete();
          this.router.navigate( [ 'basic', 'benefit-employee' ] );
          this.ms.add( { severity: 'success', summary: 'Contraseña Cambiada' } )
        },
        error: ( err ) => {
          this.loader.complete();
          this.ms.add( { severity: 'error', summary: 'Error', detail: err.error.message } )
        }
      } )
  }

}
