import { Component } from '@angular/core';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { Role } from 'src/app/role/interfaces/role.interface';
import { RoleService } from '../../services/role.service';

@Component( {
  selector: 'role-index',
  templateUrl: './index.component.html',
  styles: [
  ]
} )
export class IndexComponent {

  roles: Role[] = [];

  constructor (
    private roleService: RoleService,
    private router: Router
  ) { }

  ngOnInit (): void {
    this.roleService.index()
      .subscribe( {
        next: ( roles ) => {
          this.roles = roles
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

}
