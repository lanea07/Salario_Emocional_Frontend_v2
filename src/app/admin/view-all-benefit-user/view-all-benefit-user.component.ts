import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, combineLatest } from 'rxjs';

import { LoadingBarService } from '@ngx-loading-bar/core';
import { DataTableDirective } from 'angular-datatables';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { ChartData } from 'chart.js';
import { MessageService } from 'primeng/api';

import { BenefitUserElement } from 'src/app/benefit-user/interfaces/benefit-user.interface';
import { Benefit } from 'src/app/benefit/interfaces/benefit.interface';
import { Dependency } from 'src/app/dependency/interfaces/dependency.interface';
import { User } from 'src/app/user/interfaces/user.interface';
import { UserService } from 'src/app/user/services/user.service';
import { BenefitService } from '../../benefit/services/benefit.service';
import { DependencyService } from '../../dependency/services/dependency.service';
import es_CO from '../../shared/Datatables-langs/es-CO.json';
import { AdminService } from '../services/admin.service';

@Component( {
    selector: 'app-view-all-benefit-user',
    templateUrl: './view-all-benefit-user.component.html',
    styles: [],
    standalone: false
} )
export class ViewAllBenefitUserComponent implements OnInit, AfterViewInit {

  @ViewChild( 'dataTableOptions' ) dataTableOptions!: TemplateRef<any>;
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
  barChartOptions: any;
  benefits: Benefit[] = [];
  dependencies: Dependency[] = [];
  dtOptions: any = {};
  dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
  loaded: boolean = false;
  loader = this.lbs.useRef();
  pendingBenefits: BenefitUserElement[] = [];
  rejectedBenefits: BenefitUserElement[] = [];
  status: any[] = [
    { name: 'Aprobado', value: 1 },
    { name: 'Rechazado', value: 2 },
    { name: 'Pendiente', value: 0 },
  ];
  users: User[] = [];

  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  constructor (
    public activatedRoute: ActivatedRoute,
    private adminService: AdminService,
    private benefitService: BenefitService,
    private dependencyService: DependencyService,
    private fb: FormBuilder,
    private lbs: LoadingBarService,
    private ms: MessageService,
    private userService: UserService,
  ) { }


  ngOnInit (): void {
    this.setBarChartOptions();
    this.getBenefits();
    $.fn[ 'dataTable' ].ext.search.push( ( settings: any, data: any, dataIndex: any ) => {
      return true;
    } );
    setTimeout( () => {
      this.dtOptions = {
        autoWidth: true,
        processing: true,
        columns: [
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
            data: null,
            defaultContent: '',
            searchable: false,
            ngTemplateRef: {
              ref: this.dataTableOptions,
            }
          }
        ],
        responsive: true,
        columnDefs: [
          {
            className: 'all',
            targets: [ 1, -1 ]
          }
        ],
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
    } );
  }

  ngAfterViewInit (): void {
    setTimeout( () => {
      this.dtTrigger.next( this.dtOptions );
    }, 200 );
  }

  fillBenefits ( data: BenefitUserElement[] ) {
    this.allBenefits = data
    this.approvedBenefits = data.filter( benefit => benefit.is_approved === 1 );
    this.rejectedBenefits = data.filter( benefit => benefit.is_approved === 2 );
    this.pendingBenefits = data.filter( benefit => benefit.is_approved === 0 );
  }

  getBenefits () {
    this.loaded = false;
    this.loader.start();
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
          this.fillBenefits( allBenefits.data );
          this.benefits = benefits.data;
          this.dependencies = dependencies.data;
          this.users = users.data;

          this.barChartData.labels = Object.keys( groupedBenefits.data ).map( ( key: any ) => key );
          let pending: number[] = this.barChartData.labels.map( ( arr: any ) => {
            return Object.values( groupedBenefits.data[ arr ] ).filter( ( benefit: any ) => benefit.is_approved === 0 ).length
          } );
          let approved: number[] = this.barChartData.labels.map( ( arr: any ) => {
            return Object.values( groupedBenefits.data[ arr ] ).filter( ( benefit: any ) => benefit.is_approved === 1 ).length
          } );
          let rejected: number[] = this.barChartData.labels.map( ( arr: any ) => {
            return Object.values( groupedBenefits.data[ arr ] ).filter( ( benefit: any ) => benefit.is_approved === 2 ).length
          } );
          let barChartDatasets: any[] = [];
          barChartDatasets = [
            {
              label: "Rechazados",
              backgroundColor: "rgba(220,53,69,0.3)",
              borderColor: "rgba(220,53,69,1)",
              data: rejected,
              borderWidth: 1,
            },
            {
              label: "En Aprobación",
              backgroundColor: "rgb(255, 193, 7,0.3)",
              borderColor: "rgb(255, 193, 7,1)",
              data: pending,
              borderWidth: 1,
            },
            {
              label: "Aprobados",
              backgroundColor: "rgb(25, 135, 84,0.3)",
              borderColor: "rgb(25, 135, 84,1)",
              data: approved,
              borderWidth: 1,
            },
          ];
          this.barChartData = {
            datasets: barChartDatasets,
            labels: this.barChartData.labels,
          };
          this.loaded = true;
          this.datatableElement.dtInstance.then( ( dtInstance ) => {
            dtInstance.clear().rows.add( this.allBenefits ).draw();
          } );
          this.loader.complete();
        },
        error: ( { error } ) => this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } )
      } );
  }

  resetForm () {
    this.formGroup.get( 'benefit_id' )?.reset();
    this.formGroup.get( 'user_id' )?.reset();
    this.formGroup.get( 'dependency_id' )?.reset();
    this.formGroup.get( 'is_approved' )?.reset();
    this.getBenefits();
  }

  setBarChartOptions () {
    this.barChartOptions = {
      responsive: true,
      scales: {
        x: {
          stacked: true,
          grid: {
            drawBorder: false
          }
        },
        y: {
          stacked: true,
          beginAtZero: true,
          grid: {
            drawBorder: false
          }
        },
      },
      plugins: {
        legend: {
          display: true,
        },
        datalabels: {
          anchor: 'end',
          align: 'end'
        }
      }
    };
  }

}
