import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, of, switchMap } from 'rxjs';

import { LoadingBarService } from '@ngx-loading-bar/core';

import { Dependency } from '../../interfaces/dependency.interface';
import { DependencyService } from '../../services/dependency.service';
import { MessageService } from 'primeng/api';

@Component( {
    selector: 'user-create',
    templateUrl: './create.component.html',
    styles: [],
    standalone: false
} )
export class CreateComponent implements OnInit {

  createForm: FormGroup = this.fb.group( {
    name: [ '', [ Validators.required, Validators.minLength( 5 ) ] ],
    parent_id: [ '', Validators.required ]
  } );
  dependencies!: Dependency[];
  dependency?: Dependency;
  disableSubmitBtn: boolean = false;
  loaded: boolean = false;
  loader = this.lbs.useRef();
  nodes!: any[];

  get nameErrorMsg (): string {
    const errors = this.createForm.get( 'name' )?.errors;
    if ( errors![ 'minlength' ] ) {
      return 'El nombre no cumple con el largo mínimo de 6 caracteres';
    }
    if ( errors![ 'required' ] ) {
      return 'El nombre es obligatorio';
    }
    return '';
  }

  constructor (
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private dependencyService: DependencyService,
    private lbs: LoadingBarService,
    private router: Router,
    private ms: MessageService,
  ) { }

  ngOnInit () {
    this.loader.start();
    combineLatest( {
      dependencies: this.dependencyService.index(),
      dependency: this.router.url.includes( 'edit' ) ? this.activatedRoute.params.pipe(
        switchMap( ( { id } ) => this.dependencyService.show( id ) )
      ) : of( undefined ),
    } )
      .subscribe( {
        next: ( { dependencies, dependency } ) => {
        this.dependencies = dependencies;
        this.nodes = [ this.dependencyService.buildDependencyTreeNode( dependencies[ 0 ] ) ];
          if ( dependency ) {
            this.dependency = Object.values( dependency )[ 0 ];
            let parent = this.dependencyService.flattenDependency( { ...this.dependencies[ 0 ] } ).find( ( dependency: any ) => dependency.id === this.dependency?.parent_id );
            this.createForm.reset( {
              name: this.dependency?.name,
              parent_id: this.dependencyService.makeNode( parent! )
            } );
            this.loaded = true;
          }
          this.loader.complete();
        },
        error: ( { error } ) => {
          this.router.navigate( [ 'dependency' ] );
          this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } )
          this.loader.complete();
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

    if ( this.dependency?.id ) {
      let parent_id = this.dependencyService.flattenDependency( { ...this.dependencies[ 0 ] } ).find( ( dependency: any ) => this.createForm.get( 'parent_id' )?.value[ 'label' ] === dependency.name );
      this.createForm.get( 'parent_id' )?.setValue( parent_id?.id );
      this.dependencyService.update( this.dependency.id, this.createForm.value )
        .subscribe(
          {
            next: () => {
              this.router.navigate( [ `../show`, this.dependency?.id ], { relativeTo: this.activatedRoute } )
              this.ms.add( { severity: 'success', summary: 'Actualizado' } )
            },
            error: ( { error } ) => {
              this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } )
              this.disableSubmitBtn = false;
            }
          } );

    } else {

      let parent_id = this.dependencyService.flattenDependency( { ...this.dependencies[ 0 ] } ).find( ( dependency: any ) => this.createForm.get( 'parent_id' )?.value[ 'label' ] === dependency.name );
      this.createForm.get( 'parent_id' )?.setValue( parent_id?.id );
      this.dependencyService.create( this.createForm.value )
        .subscribe(
          {
            next: dependencyCreated => {
              this.router.navigate( [ `../show`, dependencyCreated.id ], { relativeTo: this.activatedRoute } )
              this.ms.add( { severity: 'success', summary: 'Creado' } )
            },
            error: ( { error } ) => {
              this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } )
              this.disableSubmitBtn = false;
            }
          } );
    }
    this.disableSubmitBtn = true;
  }

}
