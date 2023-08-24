import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { AuthService } from '../../services/auth.service';
import { Title } from '@angular/platform-browser';

@Component( {
  selector: 'auth-login',
  templateUrl: './login.component.html',
  styles: [
  ]
} )
export class LoginComponent {

  miFormulario: FormGroup = this.fb.group( {
    email: [ '', [ Validators.required, Validators.email ] ],
    password: [ '', [ Validators.required, Validators.minLength( 6 ) ] ],
    device_name: [ 'PC' ]
  } );
  showScreen: boolean = false;

  constructor (
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private titleService: Title
  ) {
    this.authService.validarToken()
      .subscribe( {
        next: ( resp ) => resp ? this.router.navigate( [ 'benefit-employee' ] ) : this.showScreen = true
      } );
    this.titleService.setTitle( 'Iniciar Sesión' );
  }

  login () {
    const { email, password, device_name } = this.miFormulario.value;
    this.authService.login( email, password, device_name )
      .subscribe( {
        next: ( resp ) => {
          this.router.navigateByUrl( '/benefit-employee' );
        },
        error: ( err ) => {
          Swal.fire( {
            title: 'Error',
            icon: 'error',
            text: err.error.message,
            showClass: {
              popup: 'animate__animated animate__fadeIn'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            }
          } );
        }
      } );
  }

  logout () {
    this.authService.logout()
      .subscribe();
  }

}
