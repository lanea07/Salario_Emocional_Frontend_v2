import { Component } from '@angular/core';
import { Role } from '../../interfaces/role.interface';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { RoleService } from '../../services/role.service';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import Swal from 'sweetalert2';

@Component( {
  selector: 'role-create',
  templateUrl: './create.component.html',
  styles: [
  ]
} )
export class CreateComponent {

  role: Role = {
    name: '',
    created_at: new Date,
    updated_at: new Date
  };
  disableSubmitBtn: boolean = false;
  createForm: FormGroup = this.fb.group( {
    name: [ '', [ Validators.required, Validators.minLength( 5 ) ] ]
  } );

  constructor (
    private fb: FormBuilder,
    private roleService: RoleService,
    private router: Router,
    private activatedRoute: ActivatedRoute
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
          const extractRoleDetail = role;
          this.role = extractRoleDetail;
          this.createForm.get( 'name' )?.setValue( extractRoleDetail.name );
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

    if ( this.role.id ) {
      this.roleService.update( this.role.id, this.createForm.value )
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
          this.router.navigateByUrl( `/role/show/${ this.role.id }` )
        } );

    } else {

      this.roleService.create( this.createForm.value )
        .subscribe( roleCreated => {
          this.router.navigateByUrl( `/role/show/${ roleCreated.id }` )
        } );
    }
    //this.disableSubmitBtn = true;
  }

}
