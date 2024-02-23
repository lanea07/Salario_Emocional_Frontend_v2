import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { combineLatest } from 'rxjs';

import { DataTableDirective } from 'angular-datatables';
import { ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { BenefitUserElement } from 'src/app/benefit-user/interfaces/benefit-user.interface';
import { Benefit } from 'src/app/benefit/interfaces/benefit.interface';
import { Dependency } from 'src/app/dependency/interfaces/dependency.interface';
import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';
import { User } from 'src/app/user/interfaces/user.interface';
import { UserService } from 'src/app/user/services/user.service';
import { BenefitService } from '../../benefit/services/benefit.service';
import { DependencyService } from '../../dependency/services/dependency.service';
import es_CO from '../../shared/Datatables-langs/es-CO.json';
import { AdminService } from '../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component( {
  selector: 'app-view-all-benefit-user',
  templateUrl: './view-all-benefit-user.component.html',
  styles: [
  ]
} )
export class ViewAllBenefitUserComponent implements OnInit {

  @ViewChild( BaseChartDirective ) chart!: BaseChartDirective;
  @ViewChild( DataTableDirective, { static: false } ) datatableElement!: DataTableDirective;

  formGroup: FormGroup = this.fb.group( {
    year: [ new Date(), Validators.required ],
    benefit_id: [ '' ],
    user_id: [ '' ],
    dependency_id: [ '' ],
    is_approved: [ '' ],
  } );

  allBenefits: BenefitUserElement[] = [];
  approvedBenefits: BenefitUserElement[] = [];
  benefits: Benefit[] = [];
  dependencies: Dependency[] = [];
  dtOptions: any = {};
  loaded: boolean = false;
  pendingBenefits: BenefitUserElement[] = [];
  rejectedBenefits: BenefitUserElement[] = [];
  status: any[] = [
    { name: 'Aprobado', value: 1 },
    { name: 'Rechazado', value: 2 },
    { name: 'Pendiente', value: 0 },
  ];
  users: User[] = [];

  columns = [
    { title: 'Dependencia', data: 'user.dependency.name' },
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
      title: 'Estado',
      data: function ( data: any, type: any, full: any ) {
        switch ( data.is_approved ) {
          case 0:
            return 'Pendiente de Aprobación';
            break;
          case 1:
            return 'Aprobado';
            break;
          case 2:
            return 'Rechazado';
            break;
          default:
            return 'No definido';
        }
      }
    },
    {
      title: 'Opciones',
      data: function ( data: any, type: any, full: any ) {
        return `
          <span style="cursor: pointer;" benefit_user_id="${ data.id }" class="badge rounded-pill text-bg-warning">
            Detalles
            <i class="fa-solid fa-circle-info fa-fade" style="color: #000000;"></i>
          </span>`;
      }
    }
  ];

  constructor (
    private activatedRoute: ActivatedRoute,
    private adminService: AdminService,
    private as: AlertService,
    private benefitService: BenefitService,
    private dependencyService: DependencyService,
    private fb: FormBuilder,
    private renderer: Renderer2,
    private router: Router,
    private userService: UserService,
  ) { }

  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  ngOnInit (): void {
    this.getBenefits();
    $.fn[ 'dataTable' ].ext.search.push( ( settings: any, data: any, dataIndex: any ) => {
      return true;
    } );
    this.dtOptions = {
      autoWidth: true,
      columns: this.columns,
      columnDefs: [
        {
          className: 'all',
          targets: [ -1 ]
        }
      ],
      responsive: true,
      dom: 'r<"top mb-2 d-flex flex-column flex-xs-column flex-md-column flex-lg-row justify-content-between"<"mx-2"f><"mx-2"l><"mx-2 my-1 d-flex justify-content-center regexSearch"><"d-flex flex-grow-1 justify-content-center justify-content-md-end"p>><t><"bottom d-flex flex-column flex-xs-column flex-md-column flex-lg-column flex-xl-row justify-content-start mt-2"B<"mx-2"l><"mx-2 flex-grow-1"><"d-none d-sm-block"i>>',
      initComplete: function ( settings: any, json: any ) {
        $( '.dt-buttons > button' ).removeClass( 'dt-button' );
      },
      buttons: [
        {
          text: 'Ajustar',
          key: '1',
          className: 'btn btn-sm btn-primary',
          action: function ( e: any, dt: any, node: any, config: any ) {
            dt.columns.adjust().draw();
          }
        }
      ],
      language: es_CO,
    };
  }

  ngAfterViewInit (): void {
    this.renderer.listen( 'document', 'click', ( event ) => {
      if ( event.target.hasAttribute( "benefit_user_id" ) ) {
        this.router.navigate( [ "../benefit-employee/show", event.target.getAttribute( "benefit_user_id" ) ], { relativeTo: this.activatedRoute } );
      }
    } );
  }

  fillBenefits ( data: BenefitUserElement[] ) {
    this.allBenefits = data
    this.approvedBenefits = data.filter( benefit => benefit.is_approved === 1 );
    this.rejectedBenefits = data.filter( benefit => benefit.is_approved === 2 );
    this.pendingBenefits = data.filter( benefit => benefit.is_approved === 0 );
    this.dtOptions = {
      data: this.allBenefits,
      columns: this.columns,
      responsive: true,
      columnDefs: [
        {
          className: 'all',
          targets: [ -1 ]
        }
      ],
    };
  }

  getBenefits () {
    this.loaded = false;
    this.formGroup.value.year = new Date( this.formGroup.value.year ).getFullYear();
    combineLatest( {
      allBenefits: this.adminService.getAllBenefitUser( this.formGroup.value ),
      benefits: this.benefitService.index(),
      dependencies: this.dependencyService.getNonTreeValidDependencies(),
      groupedBenefits: this.adminService.getAllGroupedBenefits( this.formGroup.value ),
      users: this.userService.index(),
    } )
      .subscribe( {
        next: ( { allBenefits, benefits, dependencies, groupedBenefits, users } ) => {
          this.fillBenefits( allBenefits );
          this.benefits = benefits;
          this.dependencies = dependencies;
          this.users = users;

          this.barChartData.labels = Object.keys( groupedBenefits ).map( ( key: any ) => key );
          let values: number[] = this.barChartData.labels.map( ( arr: any ) => Object.values( groupedBenefits[ arr ] ).length );
          let barChartDatasets: any[] = [];
          barChartDatasets = [ {
            data: values,
            backgroundColor: [
              '#FFC3A0',
              '#FFD8A8',
              '#B8D8FF',
              '#C2FFD8',
              '#FFEAB8',
              '#B8FFE8',
              '#FFF9C2',
              '#B8F5FF',
              '#FFB8F5',
              '#FFC2B8',
              '#E4FFC2',
              '#C2B8FF',
              '#FFB8D8',
              '#FFD8B8',
              '#E8B8FF',
              '#FFE8B8',
            ],
          } ];
          this.barChartData = {
            datasets: barChartDatasets,
            labels: this.barChartData.labels,
          };
          this.loaded = true;
          this.datatableElement.dtInstance.then( ( dtInstance: DataTables.Api ) => {
            dtInstance.clear().rows.add( this.allBenefits ).draw();
          } );
        },
        error: ( { error } ) => this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.message )
      } );
  }

  resetForm () {
    this.formGroup.get( 'benefit_id' )?.reset();
    this.formGroup.get( 'user_id' )?.reset();
    this.formGroup.get( 'dependency_id' )?.reset();
    this.formGroup.get( 'is_approved' )?.reset();
    this.getBenefits();
  }

}
