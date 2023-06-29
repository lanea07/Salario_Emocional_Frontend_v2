import { Component } from '@angular/core';
import { RoleService } from '../../services/role.service';
import { Role } from 'src/app/role/interfaces/role.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import Swal from 'sweetalert2';

@Component( {
  selector: 'role-show',
  templateUrl: './show.component.html',
  styles: [
  ]
} )
export class ShowComponent {

  role?: Role;
  loaded: boolean = false;

  constructor (
    private roleService: RoleService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit () {
    this.activatedRoute.params
      .pipe(
        switchMap( ( { id } ) => this.roleService.show( id ) )
      )
      .subscribe( {
        next: ( role ) => {
          this.role = role;
          this.loaded = true;
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
