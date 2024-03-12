import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BenefitDetailService } from '../../services/benefit-detail.service';
import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';
import es_CO from '../../../shared/Datatables-langs/es-CO.json';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Subject } from 'rxjs';
import { ADTSettings } from 'angular-datatables/src/models/settings';

@Component( {
  selector: 'benefitdetail-index',
  templateUrl: './index.component.html',
  styles: []
} )
export class IndexComponent implements OnInit, AfterViewInit {

  @ViewChild( 'dataTableOptions' ) dataTableOptions!: TemplateRef<any>;

  dtOptions: any;
  dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
  loader = this.lbs.useRef();

  constructor (
    public activatedRoute: ActivatedRoute,
    private as: AlertService,
    private benefitDetailService: BenefitDetailService,
    private lbs: LoadingBarService,
    private router: Router,
  ) { }

  ngOnInit (): void {
    this.loader.start();
    setTimeout( () => {
    this.dtOptions = {
      serverSide: true,
      processing: true,
      ajax: ( dataTablesParameters: any, callback: any ) => {
        this.benefitDetailService.datatable( dataTablesParameters )
          .subscribe( {
            next: ( benefitDetails: any ) => {
              callback( {
                data: benefitDetails.original.data,
                recordsTotal: benefitDetails.original.recordsTotal,
                recordsFiltered: benefitDetails.original.recordsFiltered,
              } );
              this.loader.complete();
            },
            error: ( err ) => {
              this.router.navigate( [ 'basic', 'benefit-employee' ] );
              this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, err.error.message );
            }
          } );
      },
      autowidth: true,
      columns: [
        { title: 'Nombre', data: 'name' },
        {
          title: 'Beneficio Asociado',
          data: 'benefit',
          render: function ( data: any, type: any, full: any ) {
            return data.map( ( benefit: any ) => {
              return `<a style="cursor: pointer;" class="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover px-1"
            benefit_detail_id="${ benefit.id }">${ benefit.name }</a>`
            } ).join( ' | ' );
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
