import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, of, switchMap } from 'rxjs';


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
    birthdate: [ '' ],
    email: [ '', [ Validators.required, Validators.pattern( this.emailPattern ) ] ],
    leader: [ '' ],
    password: [ '', [ this.passwordRequiredIfNotNull() ] ],
    parent: [ '' ],
    position_id: [ '', Validators.required ],
    requirePassChange: [ true ],
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

    combineLatest( {
      dependencies: this.dependencyService.index(),
      positions: this.positionService.index(),
      roles: this.roleService.index(),
      user: this.router.url.includes( 'edit' ) ? this.activatedRoute.params.pipe(
        switchMap( ( { id } ) => this.userService.show( id ) )
      ) : of( undefined ),
    } )
      .subscribe( {
        next: ( { dependencies, positions, roles, user } ) => {
          this.dependencies = dependencies;
          this.nodes = [ this.dependencyService.buildDependencyTreeNode( dependencies[ 0 ] ) ];
          this.positions = positions;
          this.roles = roles;
          this.loaded = true;
          this.createForm.addControl( "rolesFormGroup", this.buildChecksFormGroup( roles ) );
          this.user = user;
          if ( this.user ) {
            this.user = Object.values( this.user )[ 0 ];
            this.createForm.get( 'name' )?.setValue( this.user!.name );
            this.createForm.get( 'email' )?.setValue( this.user!.email );
            let dependency = this.dependencyService.flattenDependency( dependencies[ 0 ] ).find( ( dependency: any ) => dependency.id === this.user!.dependency.id );
            this.createForm.get( 'dependency_id' )?.setValue( this.dependencyService.makeNode( dependency! ) );
            this.fillColaboradores(
              {
                event:
                {
                  node:
                  {
                    key: `0.${ this.user!.dependency.id }`,
                    parent: `${ this.user!.parent }`
                  }
                }
              }[ 'event' ]
            );
            Object.keys( this.rolesFormGroup.controls ).forEach( ( key: string ) => {
              Object.values<Role>( this.user!.roles ).forEach( role => {
                if ( key === role.name ) {
                  this.rolesFormGroup.get( key ).setValue( true );
                }
              } );
            } );
            if ( this.user!.parent ) this.createForm.get( 'parent' )?.setValue( this.user!.parent.id );
            this.createForm.get( 'position_id' )?.setValue( this.user!.positions?.id?.toString() )
            this.createForm.get( 'requirePassChange' )?.setValue( this.user!.requirePassChange )
            this.createForm.get( 'valid_id' )?.setValue( this.user!.valid_id )
            this.createForm.get( 'birthdate' )?.setValue( this.user!.birthdate )
          }
        },
        error: ( { error } ) => {
          this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.statusText );
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
    let dependency_id = this.dependencyService.flattenDependency( { ...this.dependencies[ 0 ] } ).find( ( dependency: any ) => this.createForm.get( 'dependency_id' )?.value[ 'label' ] === dependency.name );
    this.createForm.get( 'dependency_id' )?.setValue( dependency_id?.id );

    if ( this.user?.id ) {
      this.userService.update( this.user?.id, this.createForm.value )
        .subscribe(
          {
            next: () => {
              this.router.navigate( [ `../show`, this.user?.id ], { relativeTo: this.activatedRoute } )
              this.as.subscriptionAlert( subscriptionMessageTitle.ACTUALIZADO, subscriptionMessageIcon.SUCCESS )
            },
            error: ( { error } ) => {
              this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.message )
              this.disableSubmitBtn = false;
            }
          } );
    } else {
      this.userService.create( this.createForm.value )
        .subscribe(
          {
            next: ( userCreated ) => {
              this.router.navigate( [ `../show`, userCreated.id ], { relativeTo: this.activatedRoute } )
              this.as.subscriptionAlert( subscriptionMessageTitle.CREADO, subscriptionMessageIcon.SUCCESS )
            },
            error: ( { error } ) => {
              this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.message )
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
    let id = event.node.key.split( '.' ).pop();
    this.dependencyService.dependencyAncestors( id )
      .subscribe( {
        next: ( dependencies ) => {
          let dependenciesArray = this.dependencyService.flattenDependency( dependencies[ 0 ] )
          this.users = dependenciesArray.flatMap( ( dependency: Dependency ) => {
            return dependency.users.filter( ( user: User ) => user.valid_id );
          } );
          this.users = this.users.sort( ( a, b ) => a.name.localeCompare( b.name ) );
          if ( this.user?.parent ) {
            this.createForm.get( 'leader' )?.setValue( this.user.parent.id );
          }
        },
        error: ( { error } ) => this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.message )
      } )
    this.createForm.get( 'parent' )?.reset( '' );
    this.createForm.get( 'parent' )?.enable();
  }

  emptyColaboradores () {
    this.users = [];
    this.createForm.get( 'parent' )?.disable();
  }

  validatePasswordRequired () {
    !this.createForm.get( 'password' )?.value ?
      this.createForm.get( 'requirePassChange' )?.setValue( true ) :
      this.createForm.get( 'requirePassChange' )?.setValue( false );
  }

}
