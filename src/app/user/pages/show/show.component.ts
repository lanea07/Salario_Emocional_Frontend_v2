import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

import Swal from 'sweetalert2';

import { User } from '../../interfaces/user.interface';
import { UserService } from '../../services/user.service';
import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';

@Component( {
  selector: 'user-show',
  templateUrl: './show.component.html',
  styles: [
  ]
} )
export class ShowComponent {

  user?: User;
  roles: string[] = [];
  loaded: boolean = false;

  constructor (
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private as: AlertService,
    private router: Router,
  ) { }

  ngOnInit () {
    this.activatedRoute.params
      .pipe(
        switchMap( ( { id } ) => this.userService.show( id ) )
      )
      .subscribe( {
        next: ( user ) => {
          this.user = Object.values( user )[ 0 ];
          this.loaded = true;
          this.user?.roles?.forEach( role => this.roles.push( role.name ) );
        },
        error: ( { error } ) => {
          this.router.navigateByUrl( 'benefit-employee' );
          this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.message )
        }
      } );
  }

  destroy () {
    Swal.fire( {
      title: 'Está seguro?',
      text: 'Al eliminar el usuario se eliminará todo registro de la base de datos',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar!',
      showClass: {
        popup: 'animate__animated animate__fadeIn'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    } ).then( ( result ) => {
      if ( result.isConfirmed ) {
        this.userService.destroy( this.user?.id )
          .subscribe( {
            next: ( resp ) => {
              this.router.navigateByUrl( 'user/index' );
              this.as.subscriptionAlert( subscriptionMessageTitle.ELIMINADO, subscriptionMessageIcon.SUCCESS )
            },
            error: ( { error } ) => this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.message )
          } );
      };
    } );
  }

}
