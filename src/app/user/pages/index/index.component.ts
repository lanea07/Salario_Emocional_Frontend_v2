import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';
import es_CO from '../../../shared/Datatables-langs/es-CO.json';
import { UserService } from '../../services/user.service';

@Component( {
  selector: 'user-index',
  templateUrl: './index.component.html',
  styles: []
} )
export class IndexComponent implements OnInit, AfterViewInit {

  isAdmin: any;
  columns = [
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
      data: function ( data: any, type: any, full: any ) {
        return `
          <span style="cursor: pointer;" user_id="${ data.id }" class="badge rounded-pill text-bg-warning">
            Detalles
            <i class="fa-solid fa-circle-info fa-fade"  user_id="${ data.id }" style="color: #000000;"></i>
          </span>`;
      }
    } ];
  dtOptions: any;

  constructor (
    private activatedRoute: ActivatedRoute,
    private as: AlertService,
    private renderer: Renderer2,
    private router: Router,
    private userService: UserService,
  ) { }

  ngOnInit (): void {
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
      columns: this.columns,
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
  }

  ngAfterViewInit (): void {
    this.renderer.listen( 'document', 'click', ( event ) => {
      if ( event.target.hasAttribute( "user_id" ) ) {
        this.router.navigate( [ "../show", event.target.getAttribute( "user_id" ) ], { relativeTo: this.activatedRoute } );
      }
    } );
  }

}
