import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { LoadingBarService } from '@ngx-loading-bar/core';
import { DataTableDirective } from 'angular-datatables';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { MessageService } from 'primeng/api';

import es_CO from '../../../../../shared/Datatables-langs/es-CO.json';
import { BenefitUserService } from '../../../../services/benefit-user.service';
import { DataTablesResponse } from '../../../../../shared/interfaces/DataTablesResponse.interface';
import { BenefitUser } from '../../../../interfaces/benefit-user.interface';

@Component( {
    selector: 'my-pending-benefits',
    templateUrl: './my-pending-benefits.component.html',
    styles: [],
    standalone: false
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
    private lbs: LoadingBarService,
    private router: Router,
    private ms: MessageService,
  ) { }

  ngOnInit (): void {
    setTimeout( () => {
      const self = this;
      this.dtOptions = {
        ajax: ( dataTablesParameters: any, callback: any ) => {
          this.loader.start();
          this.BenefitUserService.indexNonApproved( Number.parseInt( localStorage.getItem( 'uid' )! ) )
            .subscribe( {
              next: ( response: DataTablesResponse<BenefitUser[]> ) => {
                callback( { 
                  data: response.data.data ,
                  recordsTotal: response.data.recordsTotal,
                  recordsFiltered: response.data.recordsFiltered,
                } );
                this.loader.complete();
              },
              error: ( err ) => {
                this.router.navigate( [ 'basic', 'benefit-employee' ] );
                this.ms.add( { severity: 'error', summary: 'Error', detail: err.error.message } )
              }
            } );
        },
        autoWidth: true,
        columns: [
          { title: 'Beneficio', data: 'benefit_user[0].benefits.name' },
          { title: 'Detalle', data: 'benefit_user[0].benefit_detail.name' },
          {
            title: 'Solicitado',
            data: function ( data: any, type: any, full: any ) {
              return new Date( data.created_at ).toLocaleString( 'es-CO' );
            }
          },
          {
            title: 'Fecha y hora de redención',
            data: function ( data: any, type: any, full: any ) {
              return new Date( data.benefit_user[0].benefit_begin_time ).toLocaleString( 'es-CO' );
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
      this.dtTrigger.next( this.dtOptions );
    }, 200 );
  }
}
