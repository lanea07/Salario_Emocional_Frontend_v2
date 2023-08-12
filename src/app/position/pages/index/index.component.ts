import { Component } from '@angular/core';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { Position } from '../../interfaces/position.interface';
import { PositionService } from '../../services/position.service';

@Component( {
  selector: 'position-index',
  templateUrl: './index.component.html',
  styles: [
  ]
} )
export class IndexComponent {

  positions: Position[] = [];

  constructor (
    private positionService: PositionService,
    private router: Router
  ) { }

  ngOnInit () {
    this.positionService.index().subscribe( {
      next: ( positions ) => {
        this.positions = positions
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

}
