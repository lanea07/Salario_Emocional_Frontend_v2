import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { LoadingBarService } from '@ngx-loading-bar/core';
import { MessageService } from 'primeng/api';

import { AuthService } from '../../services/auth.service';
import { ApiV1Response } from '../../../shared/interfaces/ApiV1Response.interface';

@Component( {
  selector: 'auth-login',
  templateUrl: './login.component.html',
  styles: [ `` ],
  standalone: false
} )

export class LoginComponent {

  disableLoginBtn: boolean = false;
  loginForm: FormGroup = this.fb.group( {
    email: [ '', [ Validators.required, Validators.email ] ],
    password: [ '', [ Validators.required ] ],
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
    private authService: AuthService,
    private fb: FormBuilder,
    private lbs: LoadingBarService,
    private ms: MessageService,
    private router: Router,
  ) {
    this.authService.validarToken()
      .subscribe( {
        next: ( resp: ApiV1Response<boolean> ) => resp.data ? this.router.navigate( [ 'basic' ] ) : this.showScreen = true,
      } );
  }

  login () {
    this.disableLoginBtn = true;
    this.loader.start();
    if ( this.loginForm.invalid ) {
      this.loginForm.markAllAsTouched();
      this.loader.complete();
      this.disableLoginBtn = false;
      return;
    }
    const { email, password, device_name } = this.loginForm.value;
    this.authService.login( email, password, device_name )
      .subscribe( {
        next: ( data ) => {
          this.loader.complete();
          this.authService.setUser( data.data )
          this.router.navigate( [ 'basic' ] );
        },
        error: ( { error } ) => {
          this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } )
          this.loader.complete();
          this.disableLoginBtn = false;
        },
      } );
  }

  logout () {
    this.authService.logout().subscribe();
  }

  isValidField ( campo: string ) {
    return this.loginForm.controls[ campo ].errors
      && this.loginForm.controls[ campo ].touched;
  }
}
