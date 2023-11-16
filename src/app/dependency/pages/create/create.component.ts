import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

import Swal from 'sweetalert2';

import { Dependency } from '../../interfaces/dependency.interface';
import { DependencyService } from '../../services/dependency.service';

@Component( {
  selector: 'user-create',
  templateUrl: './create.component.html',
  styles: []
} )
export class CreateComponent implements OnInit {

  createForm: FormGroup = this.fb.group( {
    name: [ '', [ Validators.required, Validators.minLength( 5 ) ] ],
  } );
  disableSubmitBtn: boolean = false;
  loaded: boolean = false;
  dependency: Dependency = {
    name: '',
    parent_id: null,
    created_at: new Date,
    updated_at: new Date,
    depth: 0,
    path: '',
    users: [],
    children: [],
  };

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
    private router: Router,
    private titleService: Title,
  ) {
    this.titleService.setTitle( 'Nueva Dependencia' );
  }


  ngOnInit () {

    this.dependencyService.index().subscribe( {
      next: ( dependency ) => {
        // this.dependency = dependency;
        this.loaded = true;
      },
      error: ( error ) => {
        this.router.navigateByUrl( 'dependency' );
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

    if ( !this.router.url.includes( 'edit' ) ) {
      return;
    }

    this.activatedRoute.params
      .pipe(
        switchMap( ( { id } ) => this.dependencyService.show( id ) )
      )
      .subscribe( dependency => {

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

    if ( this.dependency.id ) {
      this.dependencyService.update( this.dependency.id, this.createForm.value )
        .subscribe(
          {
            next: () => {
              this.router.navigateByUrl( `/dependency/show/${ this.dependency.id }` )
              Swal.fire( {
                title: 'Actualizado',
                icon: 'success',
              } );
            },
            error: err => {
              Swal.fire( {
                title: 'Error',
                text: err.error.message,
                icon: 'error',
              } );
              this.disableSubmitBtn = false;
            }
          } );

    } else {

      this.dependencyService.create( this.createForm.value )
        .subscribe(
          {
            next: dependencyCreated => {
              this.router.navigateByUrl( `/dependency/show/${ dependencyCreated.id }` )
              Swal.fire( {
                title: 'Creado',
                icon: 'success',
              } );
            },
            error: err => {
              Swal.fire( {
                title: 'Error',
                text: err.error.message,
                icon: 'error',
              } );
              this.disableSubmitBtn = false;
            }
          } );
    }
    this.disableSubmitBtn = true;
  }

}
