import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

import { MessageService } from 'primeng/api';

import { Permission } from '../../interfaces/permission.interface';
import { PermissionService } from '../../services/permission.service';

@Component( {
  selector: 'permission-create',
  templateUrl: './create.component.html',
  styles: [],
  standalone: false
} )
export class CreateComponent {

  createForm: FormGroup = this.fb.group( {
    name: [ '', [ Validators.required, Validators.minLength( 5 ) ] ],
    guard_name: [ 'api', [ Validators.required ] ]
  } );
  disableSubmitBtn: boolean = false;
  permission?: Permission;

  get permissionNameErrors (): string {
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
    private permissionService: PermissionService,
    private router: Router,
    private ms: MessageService,
  ) { }

  ngOnInit () {

    if ( !this.router.url.includes( 'edit' ) ) {
      return;
    }

    this.activatedRoute.params
      .pipe(
        switchMap( ( { id } ) => this.permissionService.show( id ) )
      )
      .subscribe( {
        next: ( permission ) => {
          const extractPermissionDetail = permission.data;
          this.permission = extractPermissionDetail;
          this.createForm.get( 'name' )?.setValue( extractPermissionDetail.name );
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

    if ( this.permission?.id ) {
      this.permissionService.update( this.permission?.id, this.createForm.value )
        .subscribe(
          {
            next: () => {
              this.router.navigate( [ `../show`, this.permission?.id ], { relativeTo: this.activatedRoute } )
              this.ms.add( { severity: 'success', summary: 'Actualizado' } )
            },
            error: ( { error } ) => {
              this.disableSubmitBtn = false;
              this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } )
            }
          } );

    } else {

      this.permissionService.create( this.createForm.value )
        .subscribe(
          {
            next: ( permissions ) => {
              this.router.navigate( [ `../show`, permissions.data.id ], { relativeTo: this.activatedRoute } );
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
