import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';
import es_CO from '../../../shared/Datatables-langs/es-CO.json';
import { BenefitService } from '../../services/benefit.service';
import { DataTableDirective } from 'angular-datatables';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { Subject, map } from 'rxjs';

@Component( {
  selector: 'benefit-index',
  templateUrl: './index.component.html',
  styles: [
  ]
} )
export class IndexComponent implements AfterViewInit, OnInit, OnDestroy {

  @ViewChild( 'dataTableOptions' ) dataTableOptions!: TemplateRef<any>;
  @ViewChild( DataTableDirective, { static: false } )

  dtElement!: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();

  constructor (
    public activatedRoute: ActivatedRoute,
    private as: AlertService,
    private benefitService: BenefitService,
    private renderer: Renderer2,
    private router: Router,
  ) { }

  ngOnInit () {
    setTimeout( () => {
      const self = this;
      this.dtOptions = {
        ajax: ( dataTablesParameters: any, callback: any ) => {
          this.benefitService.index().subscribe( {
            next: ( benefits ) => {
              callback( { data: benefits } );
            },
            error: ( err ) => {
              this.router.navigate( [ 'basic', 'benefit-employee' ] );
              this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, err.error.message )
            }
          } );
        },
        autoWidth: true,
        columns: [
          { title: 'Nombre', data: 'name' },
          {
            title: 'Configuraciones',
            data: function ( data: any, type: any, full: any ) {
              return data.benefit_detail.map( ( detail: any ) => detail.name ).join( '<br>' );
            }
          },
          {
            title: 'Opciones',
            data: null,
            defaultContent: '',
            ngTemplateRef: {
              ref: this.dataTableOptions,
            }
          }
        ],
        responsive: true,
        columnDefs: [
          {
            className: 'all',
            targets: [ -1 ]
          }
        ],
        language: es_CO,
        createdRow: function ( row: any, data: any, dataIndex: any, cells: any ) {
          if ( !data.valid_id ) {
            $( row ).addClass( 'invalid-user' );
          };
        },
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
    } );
  }

  ngAfterViewInit (): void {
    setTimeout( () => {
      // race condition fails unit tests if dtOptions isn't sent with dtTrigger
      this.dtTrigger.next( this.dtOptions );
    }, 200 );
    this.renderer.listen( 'document', 'click', ( event ) => {
      if ( event.target.hasAttribute( "benefit_id" ) ) {
        this.router.navigate( [ "../show", event.target.getAttribute( "benefit_id" ) ], { relativeTo: this.activatedRoute } );
      }
    } );
  }

  ngOnDestroy (): void {
    this.dtTrigger.unsubscribe();
  }

}
