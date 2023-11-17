import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, map } from 'rxjs';

import Swal from 'sweetalert2';

import { Dependency } from '../../interfaces/dependency.interface';
import { DependencyService } from '../../services/dependency.service';
import { TreeNode } from '../../interfaces/TreeNode';

@Component( {
  selector: 'dependency-show',
  templateUrl: './show.component.html',
  styles: [
  ]
} )
export class ShowComponent {

  dependency?: Dependency;
  loaded: boolean = false;
  roles: string[] = [];
  treedata!: TreeNode[];

  constructor (
    private dependencyService: DependencyService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private titleService: Title
  ) {
    this.titleService.setTitle( 'Detalle' );
  }

  ngOnInit () {
    this.activatedRoute.params
      .pipe(
        switchMap( ( { id } ) => this.dependencyService.show( id ) )
      )
      .subscribe( {
        next: ( dependency ) => {
          this.dependency = Object.values( dependency )[ 0 ];
          this.loaded = true;
          this.treedata = [ ...[ this.dependencyService.simplifyDependency( this.dependency! ) ] ];
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
      text: 'Al eliminar la dependencia se eliminará todo registro de la base de datos',
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
        this.dependencyService.destroy( this.dependency?.id )
          .subscribe( {
            next: resp => {
              this.router.navigateByUrl( 'dependency/index' );
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




  isObject = ( value: any ) => {
    return !!( value && typeof value === "object" );
  };

  findNestedObject = ( object: any = {}, keyToMatch: any = "", valueToMatch: any = "" ) => {
    if ( this.isObject( object ) ) {
      const entries = Object.entries( object );

      for ( let i = 0; i < entries.length; i += 1 ) {
        const [ objectKey, objectValue ] = entries[ i ];

        if ( objectKey === keyToMatch && objectValue === valueToMatch ) {
          return object;
        }

        if ( this.isObject( objectValue ) ) {
          const child: any = this.findNestedObject( objectValue, keyToMatch, valueToMatch );

          if ( child !== null ) {
            return child;
          }
        }
      }
    }

    return null;
  };

}
