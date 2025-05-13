import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

import { ConfirmationService, MessageService } from 'primeng/api';

import { Position } from '../../interfaces/position.interface';
import { PositionService } from '../../services/position.service';

@Component( {
    selector: 'position-show',
    templateUrl: './show.component.html',
    styles: [],
    standalone: false
} )
export class ShowComponent {

  loaded: boolean = false;
  position?: Position;

  constructor (
    public activatedRoute: ActivatedRoute,
    private cs: ConfirmationService,
    private positionService: PositionService,
    private router: Router,
    private ms: MessageService,
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
          this.router.navigate( [ 'basic', 'benefit-employee' ] );
          this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } )
        }
      } );
  }

  destroy () {
    this.cs.confirm( {
      message: 'Estás Seguro? Esta acción no se puede deshacer.',
      header: 'Confirmar...',
      icon: 'fa-solid fa-triangle-exclamation',
      acceptIcon: "none",
      rejectIcon: "none",
      acceptButtonStyleClass: "btn btn-danger",
      rejectButtonStyleClass: "btn btn-link",
      accept: () => {
        this.positionService.destroy( this.position?.id )
          .subscribe(
            {
              next: () => {
                this.router.navigate( [ 'positions' ] );
                this.ms.add( { severity: 'success', summary: 'Eliminado' } )
              },
              error: ( { error } ) => {
                this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } )
              }
            } );
      },
      reject: () => {
        this.ms.add( { severity: 'info', summary: 'Operación Cancelada' } );
      }
    } );
  }
}
