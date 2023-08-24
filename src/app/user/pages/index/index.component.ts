import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

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
    { title: 'Jefe Directo', data: 'leader.name' },
    { title: 'Empleados a cargo', data: 'subordinates.length' },
    {
      title: 'Opciones',
      data: function ( data: any, type: any, full: any ) {
        return `
          <span style="cursor: pointer;" user_id="${ data.id }" class="badge rounded-pill text-bg-warning">
            Detalles
            <i class="fa-solid fa-circle-info fa-fade" style="color: #000000;"></i>
          </span>`;
      }
    } ];
  dtOptions: any;

  constructor (
    private as: AlertService,
    private renderer: Renderer2,
    private router: Router,
    private titleService: Title,
    private userService: UserService,
  ) {
    this.titleService.setTitle( 'Usuarios' );
  }

  ngOnInit (): void {
    this.dtOptions = {
      ajax: ( dataTablesParameters: any, callback: any ) => {
        this.userService.index()
          .subscribe(
            {
              next: users => {
                callback( { data: users } );
              },
              error: err => {
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
      if ( event.target.hasAttribute( "user_id" ) ) {
        this.router.navigate( [ "/user/show/" + event.target.getAttribute( "user_id" ) ] );
      }
    } );
  }

}
