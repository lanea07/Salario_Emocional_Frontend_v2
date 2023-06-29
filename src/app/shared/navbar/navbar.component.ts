import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';

@Component( {
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
} )
export class NavbarComponent implements OnInit {

  isAdmin: boolean = false;

  constructor ( public authService: AuthService,
    public router: Router
  ) { }

  ngOnInit (): void {
    this.authService.validarAdmin()
      .subscribe( {
        next: ( isAdmin: any ) => {
          this.isAdmin = isAdmin.admin;
        },
        error: ( error ) => {
          Swal.fire( {
            title: 'Error',
            icon: 'error',
            html: error.error.msg,
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

  logout () {
    this.authService.logout()
      .subscribe( resp => {
        this.router.navigateByUrl( '/login' );
      } );
  }

}
