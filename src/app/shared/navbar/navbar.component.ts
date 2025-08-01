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

  isAdmin: boolean | undefined = false;
  isSimulated: boolean = false;
  user?: User;

  constructor (
    public authService: AuthService,
    public router: Router
  ) {
  }

  ngOnInit (): void {
    this.isSimulated = this.authService.getuser()?.simulated!;
    this.isAdmin = this.authService.getuser()?.actions.includes(1);
    this.user = this.authService.getuser()?.user;
  }

  logout () {
    this.authService.logout()
      .subscribe( {
        next: () => this.router.navigate( [ 'login' ] )
      } );
  }

}
