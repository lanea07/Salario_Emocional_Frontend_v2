import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

import { BenefitDetailService } from '../../services/benefit-detail.service';
import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';
import es_CO from '../../../shared/Datatables-langs/es-CO.json';

@Component( {
  selector: 'benefitdetail-index',
  templateUrl: './index.component.html',
  styles: []
} )
export class IndexComponent implements OnInit, AfterViewInit {

  columns = [
    { title: 'Nombre', data: 'name' },
    {
      title: 'Beneficio Asociado',
      data: function ( data: any, type: any, full: any ) {
        let data2 = data.benefit.map( ( benefit: any ) => {
          return `<a style="cursor: pointer;" class="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover px-1"
          benefit_detail_id="${ benefit.id }">${ benefit.name }</a>`
        } );
        return data2.join( '|' );
      }
    },
    {
      title: 'Opciones',
      data: function ( data: any, type: any, full: any ) {
        return `
          <span style="cursor: pointer;" benefit_detail_options_id="${ data.id }" class="badge rounded-pill text-bg-warning">
            Detalles
            <i class="fa-solid fa-circle-info fa-fade" style="color: #000000;"></i>
          </span>`;
      }
    } ];
  dtOptions: any;

  constructor (
    private as: AlertService,
    private benefitDetailService: BenefitDetailService,
    private renderer: Renderer2,
    private router: Router,
  ) { }

  ngOnInit (): void {
    this.dtOptions = {
      ajax: ( dataTablesParameters: any, callback: any ) => {
        this.benefitDetailService.index()
          .subscribe( {
            next: ( benefitDetails ) => {
              callback( { data: benefitDetails } );
            },
            error: ( err ) => {
              this.router.navigateByUrl( 'benefit-employee' );
              this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, err.error.message );
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
      if ( event.target.hasAttribute( "benefit_detail_id" ) ) {
        this.router.navigate( [ "/benefit/show/" + event.target.getAttribute( "benefit_detail_id" ) ] );
      }
      if ( event.target.hasAttribute( "benefit_detail_options_id" ) ) {
        this.router.navigate( [ "/benefit-detail/show/" + event.target.getAttribute( "benefit_detail_options_id" ) ] );
      }
    } );
  }

}
