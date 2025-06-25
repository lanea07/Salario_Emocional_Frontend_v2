import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';

import { MessageService } from 'primeng/api';

import { Permission } from 'src/app/permission/interfaces/permission.interface';
import { PermissionService } from '../../services/permission.service';
import { ApiV1Response } from '../../../shared/interfaces/ApiV1Response.interface';

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
        next: ( permission: ApiV1Response<Permission> ) => {
          this.permission = permission.data;
          this.loaded = true;
        },
        error: ( { error } ) => this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } )
      } );
  }

}
