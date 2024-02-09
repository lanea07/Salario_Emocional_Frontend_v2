import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';
import es_CO from '../../../shared/Datatables-langs/es-CO.json';
import { RoleService } from '../../services/role.service';

@Component( {
  selector: 'role-index',
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
          <span style="cursor: pointer;" role_id="${ data.id }" class="badge rounded-pill text-bg-warning">
            Detalles
            <i class="fa-solid fa-circle-info fa-fade" style="color: #000000;"></i>
          </span>`;
      }
    } ];
  dtOptions: any;

  constructor (
    private activatedRoute: ActivatedRoute,
    private as: AlertService,
    private renderer: Renderer2,
    private roleService: RoleService,
    private router: Router,
  ) { }

  ngOnInit (): void {
    this.dtOptions = {
      ajax: ( dataTablesParameters: any, callback: any ) => {
        this.roleService.index()
          .subscribe( {
            next: ( roles ) => {
              callback( { data: roles } );
            },
            error: ( err ) => {
              this.router.navigateByUrl( 'benefit-employee' );
              this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, err.error.message );
            }
          } );
      },
      columns: this.columns,
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
      language: es_CO
    }
  }

  ngAfterViewInit (): void {
    this.renderer.listen( 'document', 'click', ( event ) => {
      if ( event.target.hasAttribute( "role_id" ) ) {
        this.router.navigate( [ "../show/", event.target.getAttribute( "role_id" ) ], { relativeTo: this.activatedRoute } );
      }
    } );
  }

}
