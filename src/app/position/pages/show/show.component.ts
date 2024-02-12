import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

import Swal from 'sweetalert2';

import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';
import { Position } from '../../interfaces/position.interface';
import { PositionService } from '../../services/position.service';

@Component( {
  selector: 'position-show',
  templateUrl: './show.component.html',
  styles: [
  ]
} )
export class ShowComponent {

  loaded: boolean = false;
  position?: Position;

  constructor (
    public activatedRoute: ActivatedRoute,
    private as: AlertService,
    private positionService: PositionService,
    private router: Router,
  ) { }

  ngOnInit () {
    this.activatedRoute.params
      .pipe(
        switchMap( ( { id } ) => this.positionService.show( id ) )
      )
      .subscribe( {
        next: ( position ) => {
          this.position = position;
          this.loaded = true;
        },
        error: ( { error } ) => {
          this.router.navigateByUrl( '/basic/benefit-employee' );
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
        this.positionService.destroy( this.position?.id )
          .subscribe(
            {
              next: () => {
                this.router.navigateByUrl( '/positions' );
                this.as.subscriptionAlert( subscriptionMessageTitle.ELIMINADO, subscriptionMessageIcon.SUCCESS );
              },
              error: ( { error } ) => {
                this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.message );
              }
            } );
      };
    } );
  }

}
