import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';
import es_CO from '../../../shared/Datatables-langs/es-CO.json';
import { PositionService } from '../../services/position.service';

@Component( {
  selector: 'position-index',
  templateUrl: './index.component.html',
  styles: [
  ]
} )
export class IndexComponent implements OnInit, AfterViewInit {

  columns = [
    { title: 'Nombre', data: 'name' },
    {
      title: 'Opciones',
      data: function ( data: any, type: any, full: any ) {
        return `
          <span style="cursor: pointer;" position_id="${ data.id }" class="badge rounded-pill text-bg-warning">
            Detalles
            <i class="fa-solid fa-circle-info fa-fade" style="color: #000000;"></i>
          </span>`;
      }
    } ];
  dtOptions: any;

  constructor (
    private activatedRoute: ActivatedRoute,
    private as: AlertService,
    private positionService: PositionService,
    private renderer: Renderer2,
    private router: Router,
  ) { }

  ngOnInit (): void {
    this.dtOptions = {
      ajax: ( dataTablesParameters: any, callback: any ) => {
        this.positionService.index().subscribe( {
          next: ( positions ) => {
            callback( { data: positions } );
          },
          error: ( err ) => {
            this.router.navigate( [ 'basic', 'benefit-employee' ] );
            this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, err.error.message )
          }
        } );
      },
      autowidth: true,
      columns: this.columns,
      responsive: true,
      language: es_CO,
      dom: 'r<"top d-flex flex-column flex-xs-column flex-md-column flex-lg-row justify-content-between"<"mx-2"f><"mx-2"l><"mx-2 my-1 d-flex justify-content-center regexSearch"><"d-flex flex-grow-1 justify-content-center justify-content-md-end"p>><t><"bottom d-flex flex-column flex-xs-column flex-md-column flex-lg-column flex-xl-row justify-content-start"B<"mx-2"l><"mx-2 flex-grow-1"><"d-none d-sm-block"i>>',
      initComplete: function ( settings: any, json: any ) {
        $( '.dt-buttons > button' ).removeClass( 'dt-button' );
      },
      buttons: [
        {
          text: 'Actualizar',
          key: '1',
          className: 'btn btn-sm btn-primary',
          action: function ( e: any, dt: any, node: any, config: any ) {
            dt.columns.adjust().draw();
            dt.ajax.reload();
          }
        }
      ]
    }
  }

  ngAfterViewInit (): void {
    this.renderer.listen( 'document', 'click', ( event ) => {
      if ( event.target.hasAttribute( "position_id" ) ) {
        this.router.navigate( [ "../show", event.target.getAttribute( "position_id" ) ], { relativeTo: this.activatedRoute } );
      }
    } );
  }

}
