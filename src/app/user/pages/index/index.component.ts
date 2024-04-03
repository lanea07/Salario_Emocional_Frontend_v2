import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { LoadingBarService } from '@ngx-loading-bar/core';
import { DataTableDirective } from 'angular-datatables';
import { ADTSettings } from 'angular-datatables/src/models/settings';

import { AuthService } from 'src/app/auth/services/auth.service';
import es_CO from '../../../shared/Datatables-langs/es-CO.json';
import { UserService } from '../../services/user.service';
import { MessageService } from 'primeng/api';

@Component( {
  selector: 'user-index',
  templateUrl: './index.component.html',
  styles: [
    `
      a {
        cursor: pointer;
      }
    `
  ]
} )
export class IndexComponent implements OnInit, AfterViewInit {

  @ViewChild( 'dataTableOptions', { static: true } ) dataTableOptions!: TemplateRef<any>;

  isAdmin: any;
  dtElement!: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
  loader = this.lbs.useRef();

  constructor (
    public activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private lbs: LoadingBarService,
    private router: Router,
    private ms: MessageService,
    private userService: UserService,
  ) { }

  ngOnInit (): void {
    this.loader.start();
    setTimeout( () => {
      const self = this;
      this.dtOptions = {
        serverSide: true,
        processing: true,
        ajax: ( dataTablesParameters: any, callback: any ) => {
          this.userService.datatable( dataTablesParameters )
            .subscribe(
              {
                next: ( users: any ) => {
                  callback( {
                    data: users.original.data,
                    recordsTotal: users.original.recordsTotal,
                    recordsFiltered: users.original.recordsFiltered,
                  } );
                  this.loader.complete();
                },
                error: err => {
                  this.ms.add( { severity: 'error', summary: 'Error', detail: err.error.message } );
                }
              } );
        },
        autowidth: true,
        columns: [
          { title: 'Nombre', data: 'name' },
          { title: 'Correo', data: 'email' },
          {
            title: 'Roles',
            data: 'roles',
            name: 'roles.name',
            render: function ( data: any, type: any, full: any ) {
              return data.map( ( detail: any ) => detail.name ).join( '<br>' );
            },
          },
          { title: 'Cargo', data: 'positions.name' },
          { title: 'Responsable Directo', data: 'parent.name' },
          {
            title: 'Válido',
            data: 'valid_id',
            render: function ( data: any, type: any, full: any ) {
              return data ? 'Válido' : 'No Válido';
            }
          },
          {
            title: 'Opciones',
            searchable: false,
            data: null,
            defaultContent: '',
            ngTemplateRef: {
              ref: this.dataTableOptions,
            }
          } ],
        language: es_CO,
        createdRow: function ( row: any, data: any, dataIndex: any ) {
          if ( !data.valid_id ) {
            $( row ).children( 'td' ).addClass( 'invalid-user' );
          }
        },
        columnDefs: [
          {
            render: ( data: any, type: any, row: any ) => '<p class="fw-bold">' + data + '</p>',
            targets: 0
          },
          {
            className: 'all',
            targets: [ 0, -1 ]
          }
        ],
        responsive: true,
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
  }

  loginAs ( id: number ) {
    this.authService.loginAs( id ).subscribe( {
      next: () => this.router.navigate( [ 'basic' ] ),
      error: ( { error } ) => this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } ),
    } );
  }

}
