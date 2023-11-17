import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

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

  constructor (
    private as: AlertService,
    private dependencyService: DependencyService,
    private renderer: Renderer2,
    private router: Router,
    private titleService: Title,
  ) {
    this.titleService.setTitle( 'Dependencias' );
  }

  ngOnInit (): void {
    this.dtOptions = {
      ajax: ( dataTablesParameters: any, callback: any ) => {
        this.dependencyService.index()
          .subscribe(
            {
              next: dependency => {
                let data = this.dependencyService.flattenDependency( Object.values( dependency )[ 0 ] );
                callback( { data: data } );
              },
              error: err => {
                this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, err.error.message );
              }
            } );
      },
      columns: this.columns,
      responsive: true,
      language: es_CO,
    }
  }

  ngAfterViewInit (): void {
    this.renderer.listen( 'document', 'click', ( event ) => {
      if ( event.target.hasAttribute( "dependency_id" ) ) {
        this.router.navigate( [ "/dependency/show/" + event.target.getAttribute( "dependency_id" ) ] );
      }
    } );
  }

}
