import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';
import { AuthService } from '../../services/auth.service';
import { LoadingBarService } from '@ngx-loading-bar/core';

@Component( {
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styles: ``
} )
export class ForgotPasswordComponent {

  forgottenPassForm: FormGroup = this.fb.group( {
    email: [ '', [ Validators.required, Validators.email ] ],
  } );
  loader = this.lbs.useRef();

  get emailErrors (): string {
    const errors = this.forgottenPassForm.get( 'email' )?.errors;
    if ( errors![ 'required' ] ) {
      return 'El campo es obligatorio';
    }
    if ( errors![ 'email' ] ) {
      return 'No reconocemos esto como un correo electrónico válido';
    }
    return '';
  }

  constructor (
    private as: AlertService,
    private authService: AuthService,
    private fb: FormBuilder,
    private lbs: LoadingBarService,
    private router: Router,
  ) { }

  isValidField ( campo: string ) {
    return this.forgottenPassForm.controls[ campo ].errors
      && this.forgottenPassForm.controls[ campo ].touched;
  }

  requestPasswordReset () {
    this.loader.start();
    this.authService.forgotPassword( this.forgottenPassForm.value )
      .subscribe( {
        next: () => {
          this.loader.complete();
          this.router.navigate( [ `/login` ] )
        },
        error: ( { error } ) => {
          this.loader.complete();
          this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.message )
        }
      } );
  }
}
