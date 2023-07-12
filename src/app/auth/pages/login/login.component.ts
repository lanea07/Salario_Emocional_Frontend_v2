import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { tap } from 'rxjs';

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
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router ) {

    // TODO: poner un flag que oculte el formulario de login hasta que se valide el token, si es falso mostrar formulario, si es verdadero dejar la redirección
    this.authService.validarToken()
      .subscribe( {
        next: ( resp ) => resp ? this.router.navigate( [ 'benefit-employee' ] ) : this.showScreen = true
      } )
  }

  login () {
    const { email, password, device_name } = this.miFormulario.value;
    this.authService.login( email, password, device_name )
      .subscribe( resp => {
        if ( resp.token ) {
          this.router.navigateByUrl( '/benefit-employee' );
        }
        else {
          Swal.fire( {
            title: 'Error',
            icon: 'error',
            text: resp,
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
