import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';
import es_CO from '../../../shared/Datatables-langs/es-CO.json';
import { DependencyService } from '../../services/dependency.service';

@Component( {
  selector: 'user-index',
  templateUrl: './index.component.html',
  styles: []
} )
export class IndexComponent implements OnInit, AfterViewInit {

  columns = [
    { title: 'Nombre', data: 'name' },
    {
      title: 'Opciones',
      data: function ( data: any, type: any, full: any ) {
        return `
          <span style="cursor: pointer;" dependency_id="${ data.id }" class="badge rounded-pill text-bg-warning">
            Detalles
            <i class="fa-solid fa-circle-info fa-fade"  dependency_id="${ data.id }" style="color: #000000;"></i>
          </span>`;
      }
    } ];
  dtOptions: any;
  nodes: any[] = [];

  constructor (
    private activatedRoute: ActivatedRoute,
    private as: AlertService,
    private dependencyService: DependencyService,
    private renderer: Renderer2,
    private router: Router,
  ) { }

  ngOnInit (): void {
    this.dtOptions = {
      ajax: ( dataTablesParameters: any, callback: any ) => {
        this.dependencyService.index()
          .subscribe(
            {
              next: dependency => {
                callback( { data: this.dependencyService.flattenDependency( dependency[ 0 ] ) } );
                this.nodes = [ this.dependencyService.buildDependencyTreeNode( dependency[ 0 ] ) ];
              },
              error: err => {
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
      language: es_CO,
    }
  }

  ngAfterViewInit (): void {
    this.renderer.listen( 'document', 'click', ( event ) => {
      if ( event.target.hasAttribute( "dependency_id" ) ) {
        this.router.navigate( [ "../show/", event.target.getAttribute( "dependency_id" ) ], { relativeTo: this.activatedRoute } );
      }
    } );
  }

}
