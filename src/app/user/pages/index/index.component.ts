import { AfterViewInit, Component, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';
import es_CO from '../../../shared/Datatables-langs/es-CO.json';
import { UserService } from '../../services/user.service';
import { DataTableDirective } from 'angular-datatables';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component( {
  selector: 'user-index',
  templateUrl: './index.component.html',
  styles: [
    `
      a{
        cursor: pointer;
      }
    `
  ]
} )
export class IndexComponent implements OnInit, AfterViewInit {

  @ViewChild( 'dataTableOptions', { static: true } ) dataTableOptions!: TemplateRef<any>;

  isAdmin: any;
  dtElement!: DataTableDirective;
  dtOptions: ADTSettings = {};
  dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();

  constructor (
    public activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private as: AlertService,
    private renderer: Renderer2,
    private router: Router,
    private userService: UserService,
  ) { }

  ngOnInit (): void {
    setTimeout( () => {
      const self = this;
      this.dtOptions = {
        ajax: ( dataTablesParameters: any, callback: any ) => {
          this.userService.index()
            .subscribe(
              {
                next: users => {
                  callback( { data: users } );
                },
                error: err => {
                  this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, err.error.message );
                }
              } );
        },
        columns: [
          { title: 'Nombre', data: 'name' },
          { title: 'Correo', data: 'email' },
          { title: 'Roles', data: 'roles[0].name' },
          { title: 'Cargo', data: 'positions.name' },
          { title: 'Responsable Directo', data: 'parent.name' },
          {
            title: 'Válido',
            data: function ( data: any, type: any, full: any ) {
              return data.valid_id ? 'Válido' : 'No Válido';
            }
          },
          {
            title: 'Opciones',
            data: null,
            defaultContent: '',
            ngTemplateRef: {
              ref: this.dataTableOptions,
            }
          } ],
        language: es_CO,
        createdRow: function ( row: any, data: any, dataIndex: any ) {
          if ( !data.valid_id ) {
            $( row ).addClass( 'invalid-user' );
          }
        },
        columnDefs: [
          {
            render: ( data: any, type: any, row: any ) => '<p class="fw-bold">' + data + '</p>',
            targets: 0
          }
        ],
        responsive: [
          {
            details: [
              {
                type: 'inline',
                target: 'tr',
                renderer: function ( api: any, rowIdx: any, columns: any ) {
                  let data = columns.map( ( col: any, i: any ) => {
                    return col.hidden ?
                      '<tr data-dt-row="' +
                      col.rowIndex +
                      '" data-dt-column="' +
                      col.columnIndex +
                      '">' +
                      '<td>' +
                      col.title +
                      ':' +
                      '</td>' +
                      '<td>' +
                      col.data +
                      '</td>' +
                      '</tr>' :
                      '';
                  } ).join( '' );
                  let table: any = document.createElement( 'table' );
                  table.innerHTML = data;
                  table.classList.add( 'table' );
                  table.classList.add( 'table-hover' );
                  return data ? table : false;
                }
              }
            ]
          }
        ],
      }
    } );
  }

  ngAfterViewInit (): void {
    setTimeout( () => {
      // race condition fails unit tests if dtOptions isn't sent with dtTrigger
      this.dtTrigger.next( this.dtOptions );
    }, 200 );
    this.renderer.listen( 'document', 'click', ( event ) => {
      if ( event.target.hasAttribute( "user_id" ) ) {
        this.router.navigate( [ "../show", event.target.getAttribute( "user_id" ) ], { relativeTo: this.activatedRoute } );
      }
    } );
  }

  loginAs ( id: number ) {
    this.authService.loginAs( id ).subscribe( {
      next: ( resp ) => this.router.navigate( [ 'basic' ] ),
      error: ( { error } ) => {
        this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.message )
      },
    } );
  }

}
