import { Component, OnInit } from '@angular/core';

import { FullCalendarComponent } from '@fullcalendar/angular';

import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component( {
  selector: 'benefitemployee-index',
  templateUrl: './index.component.html',
  styles: [
  ]
} )
export class IndexComponent implements OnInit {

  calendarApis: FullCalendarComponent[] = [];
  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;

  constructor (
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit () {
    this.items = [
      { id: "my-benefits", label: 'Mis Beneficios', icon: 'fa-solid fa-user-large', command: () => this.router.navigate( [ "my-benefits" ], { relativeTo: this.activatedRoute } ) },
      { id: "my-pending-benefits", label: 'Mis Solicitudes', icon: 'fa-solid fa-business-time', command: () => this.router.navigate( [ "my-pending-benefits" ], { relativeTo: this.activatedRoute } ) },
      { id: "my-team", label: 'Mi Equipo', icon: 'fa-solid fa-users', command: () => this.router.navigate( [ "my-team" ], { relativeTo: this.activatedRoute } ) },
      { id: "my-team-request", label: 'Solicitudes de Mi Equipo', icon: 'fa-solid fa-users-gear', command: () => this.router.navigate( [ "my-team-request" ], { relativeTo: this.activatedRoute } ) },
      { id: "my-collaborators-benefits", label: 'Mis Colaboradores', icon: 'fa-solid fa-users-viewfinder', command: () => this.router.navigate( [ "my-collaborators-benefits" ], { relativeTo: this.activatedRoute } ) },
    ];
    this.setActiveTab();
  }

  setActiveTab () {
    const lastSegment = this.router.url.split( '/' ).pop();
    const index = this.items!.findIndex( item => item.id === lastSegment );
    this.activeItem = this.items![ index ];
  }
}
