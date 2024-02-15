import { AfterViewInit, Component, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { DataTableDirective } from 'angular-datatables';
import { ADTSettings } from 'angular-datatables/src/models/settings';

import { DropdownComponentEventType } from 'src/app/benefit-user/interfaces/dropdown-component-event-type';
import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';
import es_CO from '../../../../../shared/Datatables-langs/es-CO.json';
import { BenefitUserService } from '../../../../services/benefit-user.service';
import { DropdownComponent } from './components/dropdown/dropdown.component';

@Component( {
  selector: 'my-team-request',
  templateUrl: './my-team-request.component.html',
  styles: []
} )
export class MyTeamRequestComponent implements AfterViewInit, OnInit, OnDestroy {

  @ViewChild( 'dropdownComponent' ) dropdownComponent!: TemplateRef<DropdownComponent>;
  @ViewChild( DataTableDirective, { static: false } )

  dtElement!: DataTableDirective;
  dtOptions: ADTSettings = {};
  dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();

  constructor (
    private activatedRoute: ActivatedRoute,
    private as: AlertService,
    private benefitUserService: BenefitUserService,
    private renderer: Renderer2,
    private router: Router,
  ) { }

  ngOnInit (): void {
    setTimeout( () => {
      const self = this;
      this.dtOptions = {
        ajax: ( dataTablesParameters: any, callback: any ) => {
          this.benefitUserService.indexCollaboratorsNonApproved()
            .subscribe( {
              next: ( benefitUser ) => {
                callback( { data: benefitUser } );
              },
              error: ( err ) => {
                this.router.navigate( [ 'basic', 'benefit-employee' ] );
                this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, err.error.message )
              }
            } );
        },
        columns: [
          { title: 'Colaborador', data: 'user.name' },
          { title: 'Beneficio', data: 'benefits.name' },
          { title: 'Detalle', data: 'benefit_detail.name' },
          {
            title: 'Solicitado',
            data: function ( data: any, type: any, full: any ) {
              return new Date( data.created_at ).toLocaleString( 'es-CO' );
            }
          },
          {
            title: 'Fecha y hora de redención',
            data: function ( data: any, type: any, full: any ) {
              return new Date( data.benefit_begin_time ).toLocaleString( 'es-CO' );
            }
          },
          {
            title: 'Fecha y hora de finalización',
            data: function ( data: any, type: any, full: any ) {
              return new Date( data.benefit_end_time ).toLocaleString( 'es-CO' );
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
              ref: this.dropdownComponent,
              context: {
                captureEvents: self.onCaptureEvent.bind( self )
              }
            }
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
        language: es_CO,
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

  onCaptureEvent ( event: DropdownComponentEventType ) {
    if ( event.cmd === 'view' ) {
      return this.router.navigate( [ "../show", event.data.id ], { relativeTo: this.activatedRoute } );
    }
    this.benefitUserService.decideBenefitUser( event )
      .subscribe( {
        next: ( res ) => {
          this.dtElement.dtInstance.then( ( dtInstance: DataTables.Api ) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.dtTrigger.next( this.dtOptions );
          } );
        },
        error: ( err ) => this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, err.statusText )
      } );
    return;
  }

  ngOnDestroy (): void {
    this.dtTrigger.unsubscribe();
  }

}
