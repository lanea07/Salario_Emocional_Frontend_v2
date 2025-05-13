import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

import { ConfirmationService, MessageService } from 'primeng/api';

import { TreeNode } from '../../interfaces/TreeNode';
import { Dependency } from '../../interfaces/dependency.interface';
import { DependencyService } from '../../services/dependency.service';


@Component( {
    selector: 'dependency-show',
    templateUrl: './show.component.html',
    styles: [],
    standalone: false
} )
export class ShowComponent {

  dependency?: Dependency;
  loaded: boolean = false;
  roles: string[] = [];
  treedata!: TreeNode[];

  constructor (
    public activatedRoute: ActivatedRoute,
    private cs: ConfirmationService,
    private dependencyService: DependencyService,
    private router: Router,
    private ms: MessageService,
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
          this.router.navigate( [ 'basic', 'benefit-employee' ] );
          this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } )
        }
      } );
  }

  destroy () {
    this.cs.confirm( {
      message: 'Estás Seguro? Esta acción no se puede deshacer.',
      header: 'Confirmar...',
      icon: 'fa-solid fa-triangle-exclamation',
      acceptIcon: "none",
      rejectIcon: "none",
      acceptButtonStyleClass: "btn btn-danger",
      rejectButtonStyleClass: "btn btn-link",
      accept: () => {
        this.dependencyService.destroy( this.dependency?.id )
          .subscribe( {
            next: () => {
              this.router.navigate( [ 'dependency', 'index' ] );
              this.ms.add( { severity: 'success', summary: 'Eliminado' } )
            },
            error: ( { error } ) => this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } )
          } );
      },
      reject: () => {
        this.ms.add( { severity: 'info', summary: 'Operación Cancelada' } );
      }
    } );
  }
}
