import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

import { MessageService } from 'primeng/api';

import { Role } from '../../interfaces/role.interface';
import { RoleService } from '../../services/role.service';

@Component( {
    selector: 'role-create',
    templateUrl: './create.component.html',
    styles: [],
    standalone: false
} )
export class CreateComponent {

  createForm: FormGroup = this.fb.group( {
    name: [ '', [ Validators.required, Validators.minLength( 5 ) ] ]
  } );
  disableSubmitBtn: boolean = false;
  role?: Role;

  get roleNameErrors (): string {
    const errors = this.createForm.get( 'name' )?.errors;
    if ( errors![ 'minlength' ] ) {
      return 'El nombre no cumple con el largo mínimo de 5 caracteres';
    }
    if ( errors![ 'required' ] ) {
      return 'El campo es obligatorio';
    }
    return '';
  }

  constructor (
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private roleService: RoleService,
    private router: Router,
    private ms: MessageService,
  ) { }

  ngOnInit () {

    if ( !this.router.url.includes( 'edit' ) ) {
      return;
    }

    this.activatedRoute.params
      .pipe(
        switchMap( ( { id } ) => this.roleService.show( id ) )
      )
      .subscribe( {
        next: ( role ) => {
          const extractRoleDetail = role.data;
          this.role = extractRoleDetail;
          this.createForm.get( 'name' )?.setValue( extractRoleDetail.name );
        },
        error: ( { error } ) => {
          this.router.navigate( [ 'basic', 'benefit-employee' ] );
          this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } )
        }
      } );

  }

  isValidField ( campo: string ) {
    return this.createForm.controls[ campo ].errors
      && this.createForm.controls[ campo ].touched;
  }

  save () {
    if ( this.createForm.invalid ) {
      this.createForm.markAllAsTouched();
      return;
    }

    if ( this.role?.id ) {
      this.roleService.update( this.role?.id, this.createForm.value )
        .subscribe(
          {
            next: () => {
              this.router.navigate( [ `../show`, this.role?.id ], { relativeTo: this.activatedRoute } )
              this.ms.add( { severity: 'success', summary: 'Actualizado' } )
            },
            error: ( { error } ) => {
              this.disableSubmitBtn = false;
              this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } )
            }
          } );

    } else {

      this.roleService.create( this.createForm.value )
        .subscribe(
          {
            next: ( roles ) => {
              this.router.navigate( [ `../show`, roles.data.id ], { relativeTo: this.activatedRoute } );
              this.ms.add( { severity: 'success', summary: 'Creado' } )
            },
            error: ( { error } ) => {
              this.disableSubmitBtn = false;
              this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } )
            }
          } );
    }
    this.disableSubmitBtn = true;
  }

}
