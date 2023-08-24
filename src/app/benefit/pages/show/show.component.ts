import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

import Swal from 'sweetalert2';

import { Benefit } from '../../interfaces/benefit.interface';
import { BenefitService } from '../../services/benefit.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component( {
  selector: 'benefit-show',
  templateUrl: './show.component.html',
  styles: [
  ]
} )
export class ShowComponent {

  benefit: Benefit = {
    name: '',
    created_at: new Date,
    updated_at: new Date,
    benefit_detail: []
  };
  details: any;
  filePoliticas: string = "";
  isAdmin: boolean = false;
  loaded: boolean = false;

  constructor (
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private benefitService: BenefitService,
    private router: Router,
    private titleService: Title
  ) {
    this.titleService.setTitle( 'Detalle' );
  }

  ngOnInit () {
    this.activatedRoute.params
      .pipe(
        switchMap( ( { id } ) => this.benefitService.show( id ) )
      )
      .subscribe( {
        next: ( benefit ) => {
          console.log( benefit );
          this.benefit = Object.values( benefit )[ 0 ];
          this.details = this.benefit.benefit_detail;
          this.filePoliticas = this.benefit.politicas_path ? `${ environment.baseUrl }/${ this.benefit.politicas_path }` : '';
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
          } );
        }
      } );

    this.authService.validarAdmin()
      .subscribe( {
        next: ( isAdmin: any ) => {
          this.isAdmin = isAdmin.admin;
        },
        error: ( error ) => {
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
