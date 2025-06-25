import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';

import { MessageService } from 'primeng/api';

import { Permission, Permissions } from 'src/app/permission/interfaces/permission.interface';
import { PermissionService } from '../../services/permission.service';

@Component( {
  selector: 'permission-show',
  templateUrl: './show.component.html',
  styles: [],
  standalone: false
} )
export class ShowComponent {

  permission?: Permission;
  loaded: boolean = false;

  constructor (
    public activatedRoute: ActivatedRoute,
    private permissionService: PermissionService,
    private ms: MessageService,
  ) { }

  ngOnInit () {
    this.activatedRoute.params
      .pipe(
        switchMap( ( { id } ) => this.permissionService.show( id ) )
      )
      .subscribe( {
        next: ( permission: Permissions<Permission> ) => {
          this.permission = permission.data;
          this.loaded = true;
        },
        error: ( { error } ) => this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } )
      } );
  }

}
