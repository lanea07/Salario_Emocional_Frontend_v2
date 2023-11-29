import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

import { DependencyService } from 'src/app/dependency/services/dependency.service';
import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';
import es_CO from '../../../shared/Datatables-langs/es-CO.json';
import { UserService } from '../../services/user.service';

@Component( {
  selector: 'user-index',
  templateUrl: './index.component.html',
  styles: []
} )
export class IndexComponent implements OnInit, AfterViewInit {

  columns = [
    { title: 'Nombre', data: 'name' },
    { title: 'Correo', data: 'email' },
    { title: 'Roles', data: 'roles[0].name' },
    { title: 'Cargo', data: 'positions.name' },
    { title: 'Jefe Directo', data: 'parent.name' },
    { title: 'Empleados directos a cargo', data: 'children.length' },
    { 
      title: 'Válido',
      data: function ( data: any, type: any, full: any ) {
        return data.valid_id ? 'Válido' : 'No Válido';
      }
    },
    {
      title: 'Opciones',
      data: function ( data: any, type: any, full: any ) {
        return `
          <span style="cursor: pointer;" user_id="${ data.id }" class="badge rounded-pill text-bg-warning">
            Detalles
            <i class="fa-solid fa-circle-info fa-fade"  user_id="${ data.id }" style="color: #000000;"></i>
          </span>`;
      }
    } ];
  dtOptions: any;

  constructor (
    private as: AlertService,
    private dependencyService: DependencyService,
    private renderer: Renderer2,
    private router: Router,
    private userService: UserService,
  ) { }

  ngOnInit (): void {
    this.dtOptions = {
      ajax: ( dataTablesParameters: any, callback: any ) => {
        this.userService.index()
          .subscribe(
            {
              next: users => {
                callback( { data: this.dependencyService.flattenDependency( { ...users[ 0 ] } ) } );
              },
              error: err => {
                this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, err.error.message );
              }
            } );
      },
      columns: this.columns,
      responsive: true,
      language: es_CO,
      createdRow: function ( row: any, data: any, dataIndex: any ) {
        if ( !data[ 'valid_id' ] ) {
          $( row ).addClass( 'invalid-user' );
        }
      },
      columnDefs: [
        {
          render: ( data: any, type: any, row: any ) => '<p class="fw-bold">' + data + '</p>',
          targets: 0
        }
      ]
    }
  }

  ngAfterViewInit (): void {
    this.renderer.listen( 'document', 'click', ( event ) => {
      if ( event.target.hasAttribute( "user_id" ) ) {
        this.router.navigate( [ "/user/show/" + event.target.getAttribute( "user_id" ) ] );
      }
    } );
  }

}
