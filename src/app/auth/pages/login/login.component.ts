import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { AuthService } from '../../services/auth.service';
import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';

@Component( {
  selector: 'auth-login',
  templateUrl: './login.component.html',
  styles: [
    `
      .loginAnimation {
        height: 100%;
        width: 100%;
        z-index: 9999;
        position: absolute;
        background-color: rgba(0,0,0,0.6);
      }

      .loader-lock {
        width: 64px;
        height: 44px;
        position: relative;
        border: 5px solid #fff;
        border-radius: 8px;
      }

      .loader-lock::before {
        content: '';
        position: absolute;
        border: 5px solid #fff;
        width: 32px;
        height: 28px;
        border-radius: 50% 50% 0 0;
        left: 50%;
        top: 0;
        transform: translate(-50% , -100%)

      }
      .loader-lock::after {
        content: '';
        position: absolute;
        transform: translate(-50% , -50%);
        left: 50%;
        top: 50%;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #fff;
        box-shadow: 16px 0 #fff, -16px 0 #fff;
        animation: flash 0.5s ease-out infinite alternate;
      }

      @keyframes flash {
        0% {
          background-color: rgba(255, 255, 255, 0.25);
          box-shadow: 16px 0 rgba(255, 255, 255, 0.25), -16px 0 #C8102E;
        }
        50% {
          background-color: #C8102E;
          box-shadow: 16px 0 rgba(255, 255, 255, 0.25), -16px 0 rgba(255, 255, 255, 0.25);
        }
        100% {
          background-color: rgba(255, 255, 255, 0.25);
          box-shadow: 16px 0 #C8102E, -16px 0 rgba(255, 255, 255, 0.25);
        }
      }
    `
  ],
  animations: [
    trigger( 'fadeInOut', [
      transition( ':enter', [
        style( { opacity: 0 } ),
        animate( 150, style( { opacity: 1 } ) )
      ] ),
      transition( ':leave', [
        animate( 100, style( { opacity: 0 } ) )
      ] )
    ] )

  ]
} )

export class LoginComponent {

  loginForm: FormGroup = this.fb.group( {
    email: [ '', [ Validators.required, Validators.email ] ],
    password: [ '', [ Validators.required, Validators.minLength( 4 ) ] ],
    device_name: [ 'PC' ]
  } );
  showScreen: boolean = false;
  loging: boolean = false;

  get userIdErrors (): string {
    const errors = this.loginForm.get( 'email' )?.errors;
    if ( errors![ 'required' ] ) {
      return 'El campo es obligatorio';
    }
    return '';
  }

  get benefitIdErrors (): string {
    const errors = this.loginForm.get( 'password' )?.errors;
    if ( errors![ 'required' ] ) {
      return 'El campo es obligatorio';
    }
    return '';
  }

  constructor (
    private as: AlertService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.authService.validarToken()
      .subscribe( {
        next: ( resp ) => resp ? this.router.navigate( [ 'benefit-employee' ] ) : this.showScreen = true
      } );
  }

  login () {
    if ( this.loginForm.invalid ) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const { email, password, device_name } = this.loginForm.value;
    this.loging = true;
    this.authService.login( email, password, device_name )
      .subscribe( {
        next: ( resp ) => this.router.navigateByUrl( '/benefit-employee' ),
        error: ( { error } ) => this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.error.msg ),
      } );
  }

  logout () {
    this.authService.logout()
      .subscribe();
  }

  campoEsValido ( campo: string ) {
    return this.loginForm.controls[ campo ].errors
      && this.loginForm.controls[ campo ].touched;
  }

}
