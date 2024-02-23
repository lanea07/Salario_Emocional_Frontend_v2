import { Component, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { DataTableDirective } from 'angular-datatables';
import { ADTSettings } from 'angular-datatables/src/models/settings';

import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';
import es_CO from '../../../../../shared/Datatables-langs/es-CO.json';
import { BenefitUserService } from '../../../../services/benefit-user.service';
import { LoadingBarService } from '@ngx-loading-bar/core';

@Component( {
  selector: 'my-pending-benefits',
  templateUrl: './my-pending-benefits.component.html',
  styles: [
  ]
} )
export class MyPendingBenefitsComponent implements OnInit {

  @ViewChild( DataTableDirective, { static: false } ) datatableElement!: DataTableDirective;
  @ViewChild( 'dataTableOptions', { static: true } ) dataTableOptions!: TemplateRef<any>;

  dtOptions: any = {};
  dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
  loader = this.lbs.useRef();


  constructor (
    public activatedRoute: ActivatedRoute,
    private BenefitUserService: BenefitUserService,
    private as: AlertService,
    private lbs: LoadingBarService,
    private renderer: Renderer2,
    private router: Router,
  ) { }

  ngOnInit (): void {
    setTimeout( () => {
      const self = this;
      this.dtOptions = {
        ajax: ( dataTablesParameters: any, callback: any ) => {
          this.loader.start();
          this.BenefitUserService.indexNonApproved( Number.parseInt( localStorage.getItem( 'uid' )! ) )
            .subscribe( {
              next: ( benefitUser ) => {
                callback( { data: benefitUser[ 0 ].benefit_user } );
                this.loader.complete();
              },
              error: ( err ) => {
                this.router.navigate( [ 'basic', 'benefit-employee' ] );
                this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, err.error.message )
              }
            } );
        },
        autoWidth: true,
        columns: [
          { title: 'Beneficio', data: 'benefits.name' },
          { title: 'Detalle', data: 'benefit_detail.name' },
          {
            title: 'Solicitado',
            data: function ( data: any, type: any, full: any ) {
              return new Date( data.created_at ).toLocaleString( 'es-CO', { timeZone: 'UTC' } );
            }
          },
          {
            title: 'Fecha y hora de redención',
            data: function ( data: any, type: any, full: any ) {
              return new Date( data.benefit_begin_time ).toLocaleString( 'es-CO', { timeZone: 'UTC' } );
            }
          },
          {
            title: 'Estado',
            data: function ( data: any, type: any, full: any ) {
              return 'Pendiente de Aprobación';
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
        columnDefs: [
          {
            className: 'all',
            targets: [ -1 ]
          }
        ],
        responsive: true,
        language: es_CO,
        dom: 'r<"top mb-2 d-flex flex-column flex-xs-column flex-md-column flex-lg-row justify-content-between"<"mx-2"f><"mx-2"l><"mx-2 my-1 d-flex justify-content-center regexSearch"><"d-flex flex-grow-1 justify-content-center justify-content-md-end"p>><t><"bottom d-flex flex-column flex-xs-column flex-md-column flex-lg-column flex-xl-row justify-content-start mt-2"B<"mx-2"l><"mx-2 flex-grow-1"><"d-none d-sm-block"i>>',
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
      if ( event.target.hasAttribute( "benefit_user_id" ) ) {
        this.router.navigate( [ "../show", event.target.getAttribute( "benefit_user_id" ) ], { relativeTo: this.activatedRoute } );
      }
    } );
  }
}
