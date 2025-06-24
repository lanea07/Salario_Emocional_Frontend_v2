import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { LoadingBarService } from '@ngx-loading-bar/core';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { MessageService } from 'primeng/api';

import es_CO from '../../../shared/Datatables-langs/es-CO.json';
import { DataTablesResponse } from '../../../shared/interfaces/DataTablesResponse.interface';
import { Dependency } from '../../interfaces/dependency.interface';
import { DependencyService } from '../../services/dependency.service';

@Component( {
    selector: 'user-index',
    templateUrl: './index.component.html',
    styles: [],
    standalone: false
} )
export class IndexComponent implements OnInit, AfterViewInit {

  @ViewChild( 'dataTableOptions' ) dataTableOptions!: TemplateRef<any>;

  dtOptions: any;
  dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
  loader = this.lbs.useRef();

  constructor (
    public activatedRoute: ActivatedRoute,
    private lbs: LoadingBarService,
    private dependencyService: DependencyService,
    private router: Router,
    private ms: MessageService,
  ) { }

  ngOnInit (): void {
    this.loader.start();
    setTimeout( () => {

      this.dtOptions = {
        serverSide: true,
        processing: true,
        ajax: ( dataTablesParameters: any, callback: any ) => {
          this.dependencyService.datatable( dataTablesParameters )
            .subscribe(
              {
                next: ( dependency: DataTablesResponse<Dependency[]> ) => {
                  callback( {
                    draw: dependency.data.draw,
                    recordsTotal: dependency.data.recordsTotal,
                    recordsFiltered: dependency.data.recordsFiltered,
                    data: dependency.data.data
                  } );
                  this.loader.complete();
                },
                error: ( { error } ) => this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } )
              } );
        },
        autowidth: true,
        columns: [
          { title: 'Nombre', data: 'name' },
          {
            title: 'Opciones',
            data: null,
            defaultContent: '',
            searchable: false,
            ngTemplateRef: {
              ref: this.dataTableOptions,
            }
          } ],
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
