import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, switchMap } from 'rxjs';

import { LoadingBarService } from '@ngx-loading-bar/core';
import { Permission } from '../../../permission/interfaces/permission.interface';
import { PermissionService } from '../../../permission/services/permission.service';
import { Role } from '../../interfaces/role.interface';
import { RoleService } from '../../services/role.service';
import { Table } from 'primeng/table';

@Component( {
  selector: 'app-permissions-roles',
  templateUrl: './permissions-roles.component.html',
  standalone: false
} )
export class PermissionsRolesComponent {

  get permissionsArray (): FormArray {
    return this.form.get( 'permissions' ) as FormArray;
  }

  public role!: Role;
  public form!: FormGroup;
  public permissions!: Permission[];
  private loader = this.lbs.useRef();
  public loading: Boolean = true;
  public selectedPermissions: any;

  public constructor (
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private lbs: LoadingBarService,
    private permissionService: PermissionService,
    private roleService: RoleService,
  ) {
    this.initializeForm();
    this.populateForm()
  }

  private initializeForm (): void {
    this.form = this.fb.group( {
      role_id: [ '', [ Validators.required ] ],
      permissions: this.fb.array( [] ),
    } );
  }

  private populateForm (): void {
    this.loading = true;
    this.loader.start();
    this.activatedRoute.params
      .pipe(
        switchMap( ( { id } ) => {
          const roles = this.roleService.show( id );
          const permissions = this.permissionService.index();
          return forkJoin( [ roles, permissions ] );
        } )
      )
      .subscribe( {
        next: ( [ roles, permissions ] ) => {
          this.loader.stop();
          this.loading = false;
          this.role = roles.data[ 0 ];
          this.form.get( 'role_id' )?.setValue( this.role.id );
          this.permissions = permissions.data;
          this.selectedPermissions = roles.data[ 0 ].permissions;

        },
        error: () => {
          this.loader.stop();
          this.loading = false;
        }
      } );
  }

  public reload (): void {
    this.populateForm();
  }

  public onGlobalFilter ( table: Table, event: Event ) {
    table.filterGlobal( ( event.target as HTMLInputElement ).value, 'contains' );
  }

  public save () {
    this.roleService.updateRolePermissions( this.role?.id, this.selectedPermissions )
      .subscribe( {
        next: ( response ) => console.log( response ),
        error: ( response ) => console.log( response )
      } );
  }
}