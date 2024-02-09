import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';
import es_CO from '../../../shared/Datatables-langs/es-CO.json';
import { BenefitService } from '../../services/benefit.service';

@Component( {
  selector: 'benefit-index',
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
          <span style="cursor: pointer;" benefit_id="${ data.id }" class="badge rounded-pill text-bg-warning">
            Detalles
            <i class="fa-solid fa-circle-info fa-fade" style="color: #000000;"></i>
          </span>`;
      }
    }
  ];
  dtOptions: any;

  constructor (
    private activatedRoute: ActivatedRoute,
    private as: AlertService,
    private benefitService: BenefitService,
    private renderer: Renderer2,
    private router: Router,
  ) { }

  ngOnInit () {
    this.dtOptions = {
      ajax: ( dataTablesParameters: any, callback: any ) => {
        this.benefitService.index().subscribe( {
          next: ( benefits ) => {
            callback( { data: benefits } );
          },
          error: ( err ) => {
            this.router.navigateByUrl( 'benefit-employee' );
            this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, err.error.message )
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
      createdRow: function ( row: any, data: any, dataIndex: any, cells: any ) {
        if ( !data.valid_id ) {
          $( row ).addClass( 'invalid-user' );
        };
      }
    }
  }

  ngAfterViewInit (): void {
    this.renderer.listen( 'document', 'click', ( event ) => {
      if ( event.target.hasAttribute( "benefit_id" ) ) {
        this.router.navigate( [ "../show", event.target.getAttribute( "benefit_id" ) ], { relativeTo: this.activatedRoute } );
      }
    } );
  }

}
