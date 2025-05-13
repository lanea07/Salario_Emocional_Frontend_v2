import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/user/interfaces/user.interface';

@Component( {
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    standalone: false
} )
export class NavbarComponent implements OnInit {

  isAdmin: boolean = false;
  isSimulated: boolean = false;
  user?: User;

  constructor (
    public authService: AuthService,
    public router: Router
  ) {
    this.user = JSON.parse( localStorage.getItem( 'user' )! );
  }

  ngOnInit (): void {
    this.isSimulated = JSON.parse( localStorage.getItem( 'simulated' )! );
    this.isAdmin = JSON.parse( localStorage.getItem( 'admin' )! );
    this.user = JSON.parse( localStorage.getItem( 'user' )! );
  }

  logout () {
    this.authService.logout()
      .subscribe( {
        next: () => this.router.navigate( [ 'login' ] )
      } );
  }

}
