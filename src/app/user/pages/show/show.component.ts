import { Component } from '@angular/core';
import { User } from '../../interfaces/user.interface';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';

@Component( {
  selector: 'user-show',
  templateUrl: './show.component.html',
  styles: [
  ]
} )
export class ShowComponent {

  user?: User;
  roles: string[] = [];
  loaded: boolean = false;

  constructor (
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private titleService: Title
  ) {
    this.titleService.setTitle( 'Detalle' );
  }

  ngOnInit () {
    this.activatedRoute.params
      .pipe(
        switchMap( ( { id } ) => this.userService.show( id ) )
      )
      .subscribe( {
        next: ( user ) => {
          this.user = Object.values( user )[ 0 ];
          this.loaded = true;
          this.user?.roles?.forEach( role => this.roles.push( role.name ) );
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

  destroy () {
    Swal.fire( {
      title: 'Está seguro?',
      text: 'Al eliminar el usuario se eliminará todo registro de la base de datos',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar!',
      showClass: {
        popup: 'animate__animated animate__fadeIn'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    } ).then( ( result ) => {
      if ( result.isConfirmed ) {
        this.userService.destroy( this.user?.id )
          .subscribe( {
            next: resp => {
              this.router.navigateByUrl( 'user/index' );
              Swal.fire( {
                title: 'Eliminado',
                icon: 'success'
              } );

            },
            error: err => {
              Swal.fire( {
                title: 'Error al borrar registro',
                text: err,
                icon: 'error'
              } );
            }
          } );
      };
    } );
  }

}
