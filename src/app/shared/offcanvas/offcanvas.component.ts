import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/user/interfaces/user.interface';

@Component( {
  selector: 'offcanvas',
  templateUrl: './offcanvas.component.html',
  styles: [
  ]
} )
export class OffcanvasComponent implements OnInit {

  isAdmin: boolean = false;
  user?: User;

  constructor (
    public authService: AuthService,
    public router: Router
  ) { }

  ngOnInit (): void {
    this.authService.validarAdmin()
      .subscribe( {
        next: ( isAdmin: any ) => {
          this.isAdmin = isAdmin.admin;
          this.user = JSON.parse( localStorage.getItem( 'user' )! );
        },
        error: ( error ) => {
          Swal.fire( {
            title: 'Error',
            icon: 'error',
            html: error.error.message,
            timer: 3000,
            timerProgressBar: true,
            didOpen: ( toast ) => {
              toast.addEventListener( 'mouseenter', Swal.stopTimer )
              toast.addEventListener( 'mouseleave', Swal.resumeTimer )
            }
          } )
        }
      } );
  }

}
