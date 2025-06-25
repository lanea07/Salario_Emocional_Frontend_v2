import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, switchMap } from 'rxjs';

import { Permission } from '../../../permission/interfaces/permission.interface';
import { PermissionService } from '../../../permission/services/permission.service';
import { Role } from '../../interfaces/role.interface';
import { RoleService } from '../../services/role.service';

@Component( {
  selector: 'app-permissions-roles',
  templateUrl: './permissions-roles.component.html',
  standalone: false
} )
export class PermissionsRolesComponent {

  // get rolePermissions (): FormArray {
  //   return this.form.get( 'permissions' ) as FormArray;
  // }

  public role?: Role;
  public permissions?: Permission[];
  public form!: FormGroup;

  public constructor (
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private permissionService: PermissionService,
    private roleService: RoleService,
  ) {
    this.initializeForm();
    this.populateForm()
  }

  private initializeForm (): void {
    this.form = this.fb.group( {
      role_id: [ '', [ Validators.required ] ],
      permissions: ['']
    } );
  }

  private populateForm (): void {
    this.activatedRoute.params
      .pipe(
        switchMap( ( { id } ) => {
          const roles = this.roleService.show( id );
          const permissions = this.permissionService.index();
          return forkJoin( [ roles, permissions ] );
        } )
      )
      .subscribe( ( [ roles, permissions ] ) => {
        this.role = roles.data[ 0 ];
        this.permissions = permissions.data;
      } );
  }

  public save () {

  }
}