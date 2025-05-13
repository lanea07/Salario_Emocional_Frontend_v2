import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component( {
    selector: 'admin-sidebar',
    templateUrl: './sidebar.component.html',
    styles: [],
    standalone: false
} )
export class SidebarComponent {

  constructor (
    protected router: Router
  ) { }

}
