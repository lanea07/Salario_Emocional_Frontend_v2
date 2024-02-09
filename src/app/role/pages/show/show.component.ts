import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';


import { Role } from 'src/app/role/interfaces/role.interface';
import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';
import { RoleService } from '../../services/role.service';

@Component( {
  selector: 'role-show',
  templateUrl: './show.component.html',
  styles: [
  ]
} )
export class ShowComponent {

  role?: Role;
  loaded: boolean = false;

  constructor (
    public activatedRoute: ActivatedRoute,
    private as: AlertService,
    private roleService: RoleService,
    private router: Router,
  ) { }

  ngOnInit () {
    this.activatedRoute.params
      .pipe(
        switchMap( ( { id } ) => this.roleService.show( id ) )
      )
      .subscribe( {
        next: ( role ) => {
          this.role = role;
          this.loaded = true;
        },
        error: ( { error } ) => this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.message )
      } );
  }

}
