import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';
import es_CO from '../../../../../shared/Datatables-langs/es-CO.json';
import { BenefitUserService } from '../../../../services/benefit-user.service';
import { UserService } from 'src/app/user/services/user.service';
import { data } from 'jquery';

@Component( {
  selector: 'my-team-request',
  templateUrl: './my-team-request.component.html',
  styles: [
  ]
} )
export class MyTeamRequestComponent implements OnInit {

  columns = [
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
      data: function ( data: any, type: any, full: any ) {
        return `
          <span style="cursor: pointer;" benefit_user_id="${ data.id }" class="badge rounded-pill text-bg-warning">
            Detalles
            <i class="fa-solid fa-circle-info fa-fade" style="color: #000000;"></i>
          </span>`;
      }
    }
  ];
  dtOptions: DataTables.Settings = {};

  constructor (
    private benefitUserService: BenefitUserService,
    private as: AlertService,
    private renderer: Renderer2,
    private router: Router,
  ) { }

  ngOnInit (): void {
    this.dtOptions = {
      ajax: ( dataTablesParameters: any, callback: any ) => {
        this.benefitUserService.indexCollaboratorsNonApproved()
          .subscribe( {
            next: ( benefitUser ) => {
              callback( { data: benefitUser } );
            },
            error: ( err ) => {
              this.router.navigateByUrl( 'benefit-employee' );
              this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, err.error.message )
            }
          } );
      },
      columns: this.columns,
      responsive: true,
      language: es_CO
    }
  }

  ngAfterViewInit (): void {
    this.renderer.listen( 'document', 'click', ( event ) => {
      if ( event.target.hasAttribute( "benefit_user_id" ) ) {
        this.router.navigate( [ "/benefit-employee/show/" + event.target.getAttribute( "benefit_user_id" ) ] );
      }
    } );
  }

}
