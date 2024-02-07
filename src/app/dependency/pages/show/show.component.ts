import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

import Swal from 'sweetalert2';

import { TreeNode } from '../../interfaces/TreeNode';
import { Dependency } from '../../interfaces/dependency.interface';
import { DependencyService } from '../../services/dependency.service';
import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';

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
    public activatedRoute: ActivatedRoute,
    private as: AlertService,
    private dependencyService: DependencyService,
    private router: Router,
  ) { }

  ngOnInit () {
    this.activatedRoute.params
      .pipe(
        switchMap( ( { id } ) => this.dependencyService.show( id ) )
      )
      .subscribe( {
        next: ( dependency ) => {
          this.dependency = Object.values( dependency )[ 0 ];
          this.loaded = true;
        },
        error: ( { error } ) => {
          this.router.navigateByUrl( 'benefit-employee' );
          this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.message );
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
            next: ( resp ) => {
              this.router.navigateByUrl( 'dependency/index' );
              this.as.subscriptionAlert( subscriptionMessageTitle.ELIMINADO, subscriptionMessageIcon.SUCCESS )
            },
            error: ( { error } ) => this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.message )
          } );
      };
    } );
  }

}
