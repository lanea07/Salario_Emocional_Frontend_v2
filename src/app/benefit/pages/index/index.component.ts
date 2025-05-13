import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { LoadingBarService } from '@ngx-loading-bar/core';
import { DataTableDirective } from 'angular-datatables';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { MessageService } from 'primeng/api';

import es_CO from '../../../shared/Datatables-langs/es-CO.json';
import { BenefitService } from '../../services/benefit.service';

@Component( {
    selector: 'benefit-index',
    templateUrl: './index.component.html',
    styles: [],
    standalone: false
} )
export class IndexComponent implements AfterViewInit, OnInit, OnDestroy {

  @ViewChild( 'dataTableOptions' ) dataTableOptions!: TemplateRef<any>;
  @ViewChild( DataTableDirective, { static: false } )

  dtElement!: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
  loader = this.lbs.useRef();

  constructor (
    public activatedRoute: ActivatedRoute,
    private lbs: LoadingBarService,
    private benefitService: BenefitService,
    private router: Router,
    private ms: MessageService
  ) { }

  ngOnInit () {
    this.loader.start();
    setTimeout( () => {
      const self = this;
      this.dtOptions = {
        serverSide: true,
        processing: true,
        ajax: ( dataTablesParameters: any, callback: any ) => {
          this.benefitService.datatable( dataTablesParameters )
            .subscribe( {
              next: ( benefits: any ) => {
                callback( {
                  data: benefits.original.data,
                  recordsTotal: benefits.original.recordsTotal,
                  recordsFiltered: benefits.original.recordsFiltered,
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
          { title: 'Nombre', data: 'name' },
          {
            title: 'Configuraciones',
            data: 'benefit_detail',
            name: 'benefit_detail.name',
            render: function ( data: any, type: any, full: any ) {
              return data.map( ( detail: any ) => detail.name ).join( '<br>' );
            }
          },
          {
            title: 'Opciones',
            data: null,
            defaultContent: '',
            searchable: false,
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
            $( row ).children( 'td' ).addClass( 'invalid-user' );
          };
        },
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

  ngOnDestroy (): void {
    this.dtTrigger.unsubscribe();
  }

}
