import { Component, OnInit, ViewChild } from '@angular/core';
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
  dtOptions: DataTables.Settings = {};
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
    private adminService: AdminService,
    private as: AlertService,
    private benefitService: BenefitService,
    private dependencyService: DependencyService,
    private fb: FormBuilder,
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
      columns: this.columns,
    };
  }

  fillBenefits ( data: BenefitUserElement[] ) {
    this.allBenefits = data
    this.approvedBenefits = data.filter( benefit => benefit.is_approved === 1 );
    this.rejectedBenefits = data.filter( benefit => benefit.is_approved === 2 );
    this.pendingBenefits = data.filter( benefit => benefit.is_approved === 0 );
    this.dtOptions = {
      data: this.allBenefits,
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
