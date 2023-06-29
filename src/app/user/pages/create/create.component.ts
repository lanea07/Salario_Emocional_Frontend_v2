import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray, ValidatorFn, ValidationErrors, AbstractControl, AsyncValidator } from '@angular/forms';
import { RoleService } from 'src/app/role/services/role.service';
import { Role } from 'src/app/role/interfaces/role.interface';
import { Observable, of, switchMap, timer } from 'rxjs';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../interfaces/user.interface';
import Swal from 'sweetalert2';
import { ValidatorService } from 'src/app/shared/services/validator.service';
import { Position } from '../../../position/interfaces/position.interface';
import { PositionService } from '../../../position/services/position.service';

@Component( {
  selector: 'user-create',
  templateUrl: './create.component.html',
  styles: [
    `
      mat-form-field {
        width: 100%;
      }
  `
  ]
} )
export class CreateComponent implements OnInit {

  emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  user: User = {
    name: '',
    email: '',
    email_verified_at: null,
    position_id: 0,
    leader: null,
    created_at: new Date,
    updated_at: new Date,
    subordinates: [],
    positions: undefined,
    roles: []
  };
  roles: Role[] = [];
  positions: Position[] = [];
  posibleLeader!: User[];
  posibleSubordinates!: User[];
  disableSubmitBtn: boolean = false;
  createForm: FormGroup = this.fb.group( {
    name: [ '', [ Validators.required, Validators.minLength( 5 ) ] ],
    email: [ '', [ Validators.required, Validators.pattern( this.emailPattern ) ] ],
    password: [ '', [ Validators.required, Validators.minLength( 5 ) ] ],
    leader: [ '' ],
    subordinates: [ '' ],
    position_id: [ '', Validators.required ]

  } );
  loaded: boolean = false;
  filteredSubordinates!: User[];


  get rolesFormGroup (): FormGroup | any {
    return this.createForm.controls[ 'rolesFormGroup' ];
  }

  constructor (
    private fb: FormBuilder,
    private userService: UserService,
    private roleService: RoleService,
    private positionService: PositionService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private validatorService: ValidatorService
  ) { }


  ngOnInit () {

    this.roleService.index().subscribe( {
      next: ( roles ) => {
        this.roles = roles;
        this.loaded = true;
        this.createForm.addControl( "rolesFormGroup", this.buildChecksFormGroup( roles ) );
      },
      error: ( error ) => {
        this.router.navigateByUrl( 'benefit-employee' );
        Swal.fire( {
          title: 'Error',
          icon: 'error',
          html: error.error.msg,
          timer: 3000,
          timerProgressBar: true,
          didOpen: ( toast ) => {
            toast.addEventListener( 'mouseenter', Swal.stopTimer )
            toast.addEventListener( 'mouseleave', Swal.resumeTimer )
          }
        } )
      }
    } );

    this.positionService.index().subscribe(
      positions => {
        this.positions = positions;
        this.loaded = true;
      } )

    this.userService.index()
      .subscribe( user => {
        this.posibleLeader = user;
        this.posibleSubordinates = user;
        this.filteredSubordinates = user;
      } )

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

        if ( extractUser.leader ) this.createForm.get( 'leader' )?.setValue( extractUser.leader.id );
        if ( extractUser.subordinates ) this.createForm.get( 'subordinates' )?.setValue( extractUser.subordinates?.map( subordinate => subordinate.id ) );
        this.createForm.get( 'position_id' )?.setValue( extractUser.positions?.id?.toString() )

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

    if ( this.user.id ) {
      this.userService.update( this.user.id, this.createForm.value )
        .subscribe( resp => {
          Swal.fire( {
            title: 'Actualizado',
            icon: 'success',
            showClass: {
              popup: 'animate__animated animate__fadeIn'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            }
          } )
          this.router.navigateByUrl( `/user/show/${ this.user.id }` )
        } );

    } else {

      this.userService.create( this.createForm.value )
        .subscribe( userCreated => {
          this.router.navigateByUrl( `/user/show/${ userCreated.id }` )
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

}
