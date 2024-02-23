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
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BenefitDecisionComponent } from '../benefit-decision/benefit-decision.component';
import { Dropdown } from 'primeng/dropdown';
import { MessagingService } from 'src/app/benefit-user/services/messaging.service';
import { LoadingBarService } from '@ngx-loading-bar/core';

@Component( {
  selector: 'my-team-request',
  templateUrl: './my-team-request.component.html',
  styles: [],
  providers: [ DialogService ]
} )
export class MyTeamRequestComponent implements AfterViewInit, OnInit, OnDestroy {

  @ViewChild( 'dropdownComponent' ) dropdownComponent!: TemplateRef<DropdownComponent>;
  @ViewChild( DataTableDirective, { static: false } )

  dtElement!: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
  loader = this.lbs.useRef();
  ref: DynamicDialogRef | undefined;

  constructor (
    private activatedRoute: ActivatedRoute,
    private as: AlertService,
    private benefitUserService: BenefitUserService,
    private dialogService: DialogService,
    private lbs: LoadingBarService,
    private messagingService: MessagingService,
    private renderer: Renderer2,
    private router: Router,
  ) { }

  ngOnInit (): void {
    setTimeout( () => {
      const self = this;
      this.dtOptions = {
        ajax: ( dataTablesParameters: any, callback: any ) => {
          this.loader.start();
          this.benefitUserService.indexCollaboratorsNonApproved()
            .subscribe( {
              next: ( benefitUser ) => {
                callback( { data: benefitUser } );
                this.loader.complete();
              },
              error: ( err ) => {
                this.router.navigate( [ 'basic', 'benefit-employee' ] );
                this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, err.error.message )
              }
            } );
        },
        autoWidth: true,
        columns: [
          { title: 'Colaborador', data: 'user.name' },
          { title: 'Beneficio', data: 'benefits.name' },
          { title: 'Detalle', data: 'benefit_detail.name' },
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
        responsive: true,
        columnDefs: [ 
          {
            className: 'all',
            targets: [ -1 ]
          }
        ],
        language: es_CO,
        dom: 'r<"top d-flex flex-column flex-xs-column flex-md-column flex-lg-row justify-content-between"<"mx-2"f><"mx-2"l><"mx-2 my-1 d-flex justify-content-center regexSearch"><"d-flex flex-grow-1 justify-content-center justify-content-md-end"p>><t><"bottom d-flex flex-column flex-xs-column flex-md-column flex-lg-column flex-xl-row justify-content-start"B<"mx-2"l><"mx-2 flex-grow-1"><"d-none d-sm-block"i>>',
        initComplete: function ( settings: any, json: any ) {
          $( '.dt-buttons > button' ).removeClass( 'dt-button' );
        },
        buttons: [
          {
            text: 'Actualizar',
            key: '1',
            className: 'btn btn-sm btn-primary',
            action: function ( e: any, dt: any, node: any, config: any ) {
              dt.ajax.reload();
              dt.columns.adjust().draw();
            }
          }
        ]
      }
    } );
    this.messagingService.message
      .subscribe( {
        next: ( { decisionTaken } ) => {
          if ( decisionTaken ) {
            this.dtElement.dtInstance.then( ( dtInstance: DataTables.Api ) => {
              // Destroy the table first
              dtInstance.destroy();
              // Call the dtTrigger to rerender again
              this.dtTrigger.next( this.dtOptions );
              dtInstance.columns.adjust().draw();
            } );
          }
        },
        error: ( err ) => this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, err.statusText )
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

  ngOnDestroy (): void {
    this.dtTrigger.unsubscribe();
  }

  onCaptureEvent ( event: DropdownComponentEventType ) {
    if ( event.cmd === 'view' ) {
      return this.router.navigate( [ "../show", event.data.id ], { relativeTo: this.activatedRoute } );
    }
    if ( event.cmd === 'decide' ) {
      this.ref = this.dialogService.open( BenefitDecisionComponent, {
        data: event.data,
        header: 'Decidir Beneficio',
        contentStyle: { overflow: 'auto' },
        width: '50vw',
      } );
    }
    return;
  }
}
