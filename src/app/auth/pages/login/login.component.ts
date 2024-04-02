import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { LoadingBarService } from '@ngx-loading-bar/core';

import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';
import { AuthService } from '../../services/auth.service';

@Component( {
  selector: 'auth-login',
  templateUrl: './login.component.html',
  styles: [ `` ],
} )

export class LoginComponent {

  loginForm: FormGroup = this.fb.group( {
    email: [ '', [ Validators.required, Validators.email ] ],
    password: [ '', [ Validators.required, Validators.minLength( 4 ) ] ],
    device_name: [ 'PC' ]
  } );
  loader = this.lbs.useRef();
  showScreen: boolean = false;

  get userIdErrors (): string {
    const errors = this.loginForm.get( 'email' )?.errors;
    if ( errors![ 'required' ] ) {
      return 'El campo es obligatorio';
    }
    return '';
  }

  get passwordErrors (): string {
    const errors = this.loginForm.get( 'password' )?.errors;
    if ( errors![ 'required' ] ) {
      return 'El campo es obligatorio';
    }
    return '';
  }

  constructor (
    protected activatedRoute: ActivatedRoute,
    private as: AlertService,
    private authService: AuthService,
    private fb: FormBuilder,
    private lbs: LoadingBarService,
    private router: Router,
  ) {
    this.authService.validarToken()
      .subscribe( {
        next: ( resp ) => resp ? this.router.navigate( [ 'basic' ] ) : this.showScreen = true,
      } );
  }

  login () {
    this.loader.start();
    if ( this.loginForm.invalid ) {
      this.loginForm.markAllAsTouched();
      this.loader.complete();
      return;
    }
    const { email, password, device_name } = this.loginForm.value;
    this.authService.login( email, password, device_name )
      .subscribe( {
        next: () => {
          this.loader.complete();
          this.router.navigate( [ 'basic' ] )
        },
        error: ( { error } ) => {
          this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.message )
          this.loader.complete();
        },
      } );
  }

  logout () {
    this.authService.logout()
      .subscribe();
  }

  isValidField ( campo: string ) {
    return this.loginForm.controls[ campo ].errors
      && this.loginForm.controls[ campo ].touched;
  }

}
