import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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

  get permissionsArray (): FormArray {
    return this.form.get( 'permissions' ) as FormArray;
  }

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
      permissions: this.fb.array( [] ),
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
        this.form.get('role_id')?.setValue(this.role.id);
        this.permissions = permissions.data;
        this.addCheckboxes();
      } );
  }

  private addCheckboxes () {
    this.permissions?.forEach( ( permission ) => this.addCheckbox( permission ) );
  }

  private addCheckbox ( permission: Permission ) {
    const isChecked = !!this.role?.permissions?.some( p => p.id === permission.id );

    const group = this.fb.group( {
      checked: [ isChecked ],
      permission: [ permission ],
    } );

    this.permissionsArray.push( group );
  }

  public save () {

  }
}