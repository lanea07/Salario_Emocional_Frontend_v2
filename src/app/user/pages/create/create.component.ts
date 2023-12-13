import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, switchMap } from 'rxjs';

import Swal from 'sweetalert2';

import { Dependency } from '../../../dependency/interfaces/dependency.interface';
import { DependencyService } from '../../../dependency/services/dependency.service';
import { Position } from '../../../position/interfaces/position.interface';
import { PositionService } from '../../../position/services/position.service';
import { Role } from '../../../role/interfaces/role.interface';
import { RoleService } from '../../../role/services/role.service';
import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from '../../../shared/services/alert-service.service';
import { ValidatorService } from '../../../shared/services/validator.service';
import { User } from '../../interfaces/user.interface';
import { UserService } from '../../services/user.service';

@Component( {
  selector: 'user-create',
  templateUrl: './create.component.html',
  styles: []
} )
export class CreateComponent implements OnInit {

  emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  createForm: FormGroup = this.fb.group( {
    name: [ '', [ Validators.required, Validators.minLength( 5 ) ] ],
    birthdate: [ '', Validators.required ],
    email: [ '', [ Validators.required, Validators.pattern( this.emailPattern ) ] ],
    leader: [ '' ],
    password: [ '', [ this.passwordRequiredIfNotNull() ] ],
    parent: [ '' ],
    position_id: [ '', Validators.required ],
    requirePassChange: [ false ],
    valid_id: [ '', Validators.required ],
    dependency_id: [ '', Validators.required ]
  } );
  dependencies!: Dependency[];
  disableSubmitBtn: boolean = false;
  filteredSubordinates!: User[];
  loaded: boolean = false;
  nodes!: any[];
  posibleLeader!: User[];
  posibleSubordinates!: User[];
  positions: Position[] = [];
  roles: Role[] = [];
  user?: User;
  users!: User[];

  get rolesFormGroup (): FormGroup | any {
    return this.createForm.controls[ 'rolesFormGroup' ];
  }

  get passErrorMsg (): string {
    const errors = this.createForm.get( 'password' )?.errors;
    if ( errors![ 'minlength' ] ) {
      return 'La contraseña no cumple con el largo mínimo de 6 caracteres';
    }
    if ( errors![ 'required' ] ) {
      return 'La contraseña es obligatoria';
    }

    return '';
  }

  constructor (
    private activatedRoute: ActivatedRoute,
    private as: AlertService,
    private dependencyService: DependencyService,
    private fb: FormBuilder,
    private positionService: PositionService,
    private roleService: RoleService,
    private router: Router,
    private userService: UserService,
    private validatorService: ValidatorService
  ) { }


  ngOnInit () {

    forkJoin( {
      dependencies: this.dependencyService.index(),
      positions: this.positionService.index(),
      roles: this.roleService.index(),
    } )
      .subscribe( {
        next: ( { dependencies, positions, roles } ) => {
          this.dependencies = dependencies;
          this.nodes = [ this.dependencyService.buildDependencyTreeNode( dependencies[ 0 ] ) ];
          this.positions = positions;
          this.roles = roles;
          this.loaded = true;
          this.createForm.addControl( "rolesFormGroup", this.buildChecksFormGroup( roles ) );
        },
        error: ( error ) => {
          this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.statusText );
        }
      } );

    if ( !this.router.url.includes( 'edit' ) ) {
      return;
    }

    this.activatedRoute.params
      .pipe(
        switchMap( ( { id } ) => this.userService.show( id ) )
      )
      .subscribe( user => {
        const extractUser: User = Object.values( user )[ 0 ];
        this.user = extractUser;
        this.createForm.get( 'name' )?.setValue( extractUser.name );
        this.createForm.get( 'email' )?.setValue( extractUser.email );
        Object.keys( this.rolesFormGroup.controls ).forEach( ( key: string ) => {
          Object.values<Role>( extractUser.roles ).forEach( role => {
            if ( key === role.name ) {
              this.rolesFormGroup.get( key ).setValue( true );
            }
          } );
        } );

        if ( extractUser.parent ) this.createForm.get( 'parent' )?.setValue( extractUser.parent.id );
        this.createForm.get( 'position_id' )?.setValue( extractUser.positions?.id?.toString() )
        this.createForm.get( 'requirePassChange' )?.setValue( extractUser.requirePassChange )
        this.createForm.get( 'valid_id' )?.setValue( extractUser.valid_id )
        this.createForm.get( 'birthdate' )?.setValue( extractUser.birthdate )
      } );

  }

  campoEsValido ( campo: string ) {
    return this.createForm.controls[ campo ].errors
      && this.createForm.controls[ campo ].touched;
  }

  save () {
    if ( this.createForm.invalid ) {
      this.createForm.markAllAsTouched();
      return;
    }

    if ( this.user?.id ) {
      this.userService.update( this.user?.id, this.createForm.value )
        .subscribe(
          {
            next: () => {
              this.router.navigateByUrl( `/user/show/${ this.user?.id }` )
              Swal.fire( {
                title: 'Actualizado',
                icon: 'success',
              } );
            },
            error: err => {
              Swal.fire( {
                title: 'Error',
                text: err.error.message,
                icon: 'error',
              } );
              this.disableSubmitBtn = false;
            }
          } );

    } else {

      let dependency_id = this.dependencyService.flattenDependency( { ...this.dependencies[ 0 ] } ).find( ( dependency: any ) => this.createForm.get( 'dependency_id' )?.value[ 'label' ] === dependency.name );
      this.createForm.get( 'dependency_id' )?.setValue( dependency_id?.id );
      this.userService.create( this.createForm.value ) 
        .subscribe(
          {
            next: userCreated => {
              this.router.navigateByUrl( `/user/show/${ userCreated.id }` )
              Swal.fire( {
                title: 'Creado',
                icon: 'success',
              } );
            },
            error: err => {
              Swal.fire( {
                title: 'Error',
                text: err.error.message,
                icon: 'error',
              } );
              this.disableSubmitBtn = false;
            }
          } );
    }
    this.disableSubmitBtn = true;
  }

  buildChecksFormGroup ( roles: Role[], selectedRoleIds: number[] = [] ): FormGroup {
    let group = this.fb.group( {}, {
      validators: [ this.atLeastOneCheckboxCheckedValidator() ]
    } );
    roles.forEach( role => {
      let isSelected = selectedRoleIds.some( id => id === role.id );
      group.addControl( role.name, this.fb.control( isSelected, {}, this.validatorService.checkboxRequired() ) );
    } );
    return group;
  }

  atLeastOneCheckboxCheckedValidator ( minRequired = 1 ): ValidationErrors {
    return function validate ( formGroup: FormGroup ) {
      let checked = 0;

      Object.keys( formGroup.controls ).forEach( key => {
        const control = formGroup.controls[ key ];
        if ( control.value ) {
          checked++;
        }
      } );

      if ( checked < minRequired ) {
        return {
          requireCheckboxToBeChecked: true,
        };
      }

      return null;
    };
  }

  filterSubordinates ( evt: any ) {
    this.filteredSubordinates = this.posibleSubordinates.filter( subordinate => subordinate.id !== evt.value )
  }

  passwordRequiredIfNotNull ( minRequired = 6 ): ValidationErrors {
    return function validate ( control: AbstractControl ) {

      if ( !control.value && !control.hasValidator( Validators.required ) )
        return null;

      if ( control.value.length < minRequired ) {
        return {
          minlength: true,
        };
      }

      return null;
    };
  }

  fillColaboradores ( event: any ) {
    if ( !event.node.parent ) {
      this.emptyColaboradores();
      return;
    }
    let dependencies = this.dependencyService.flattenDependency( { ...this.dependencies[ 0 ] } )
    let dependency = dependencies.find( ( dependency: Dependency ) => {
      return dependency.name === event.node.parent.label;
    } );
    this.createForm.get( 'parent' )?.reset( '' );
    this.createForm.get( 'parent' )?.enable();
    this.users = dependency!.users;
  }

  emptyColaboradores () {
    this.users = [];
    this.createForm.get( 'parent' )?.disable();
  }

}
