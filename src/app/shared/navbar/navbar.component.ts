import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/user/interfaces/user.interface';
import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from '../services/alert-service.service';

@Component( {
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
} )
export class NavbarComponent implements OnInit {

  isAdmin: boolean = false;
  user?: User;

  constructor (
    public as: AlertService,
    public authService: AuthService,
    public router: Router
  ) {
    this.user = JSON.parse( localStorage.getItem( 'user' )! );
  }

  ngOnInit (): void {
    this.authService.validarAdmin()
      .subscribe( {
        next: ( isAdmin: any ) => {
          this.isAdmin = isAdmin.admin;
          this.user = JSON.parse( localStorage.getItem( 'user' )! );
        },
        error: ( { error } ) => this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.message )
      } );
  }

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
