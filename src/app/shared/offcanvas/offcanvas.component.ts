import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/user/interfaces/user.interface';
import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from '../services/alert-service.service';

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
    private as: AlertService,
    private authService: AuthService,
    public router: Router
  ) { }

  ngOnInit (): void {
    this.authService.validarAdmin()
      .subscribe( {
        next: ( isAdmin: any ) => {
          this.isAdmin = isAdmin.admin;
          this.user = JSON.parse( localStorage.getItem( 'user' )! );
        },
        error: ( error ) => this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.error.msg )
      } );
  }

}
