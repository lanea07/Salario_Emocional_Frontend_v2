import { Component } from '@angular/core';
import { Position } from '../../interfaces/position.interface';
import { PositionService } from '../../services/position.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component( {
  selector: 'position-show',
  templateUrl: './show.component.html',
  styles: [
  ]
} )
export class ShowComponent {

  position?: Position;
  loaded: boolean = false;

  constructor (
    private positionService: PositionService,
    private router: Router,
    private activatedRoute: ActivatedRoute
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
        error: ( error ) => {
          this.router.navigateByUrl( 'benefit-employee' );
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
        this.positionService.destroy( this.position?.id ).subscribe( resp => {
          Swal.fire(
            'Deleted!',
            'success'
          );
          this.router.navigateByUrl( '/positions' );
        } );
      };
    } );
  }

}
