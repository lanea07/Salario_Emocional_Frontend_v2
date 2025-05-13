import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';

import { MessageService } from 'primeng/api';

import { Role } from 'src/app/role/interfaces/role.interface';
import { RoleService } from '../../services/role.service';

@Component( {
    selector: 'role-show',
    templateUrl: './show.component.html',
    styles: [],
    standalone: false
} )
export class ShowComponent {

  role?: Role;
  loaded: boolean = false;

  constructor (
    public activatedRoute: ActivatedRoute,
    private roleService: RoleService,
    private ms: MessageService,
  ) { }

  ngOnInit () {
    this.activatedRoute.params
      .pipe(
        switchMap( ( { id } ) => this.roleService.show( id ) )
      )
      .subscribe( {
        next: ( role ) => {
          this.role = role;
          this.loaded = true;
        },
        error: ( { error } ) => this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } )
      } );
  }

}
