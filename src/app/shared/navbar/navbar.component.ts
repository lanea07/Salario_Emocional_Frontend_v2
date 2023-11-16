import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/user/interfaces/user.interface';

@Component( {
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
} )
export class NavbarComponent {

  user?: User;

  constructor (
    public authService: AuthService,
    public router: Router
  ) { }

  logout () {
    this.authService.logout()
      .subscribe( resp => {
        this.router.navigateByUrl( '/login' );
      } );
  }

  // addClass ( event: any ): void {
  //   event.target.className = event.target.className.replace( ' btn-outline-light', '' );
  //   event.target.className += ' btn-outline-danger';
  // }

  // removeClass ( event: any ): void {
  //   event.target.className = event.target.className.replace( ' btn-outline-danger', '' );
  //   event.target.className += ' btn-outline-light';
  // }

}
