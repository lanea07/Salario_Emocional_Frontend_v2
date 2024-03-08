import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

import Swal from 'sweetalert2';

import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';
import { BenefitUser } from '../../interfaces/benefit-user.interface';
import { BenefitUserService } from '../../services/benefit-user.service';
import { LoadingBarService } from '@ngx-loading-bar/core';

@Component( {
  selector: 'benefitemployee-show',
  templateUrl: './show.component.html',
  styles: [
  ]
} )
export class ShowComponent implements OnInit {

  loaded: boolean = false;
  loader = this.lbs.useRef();
  benefitUser?: BenefitUser;


  constructor (
    public activatedRoute: ActivatedRoute,
    private as: AlertService,
    private benefitUserService: BenefitUserService,
    private lbs: LoadingBarService,
    private router: Router,
  ) { }

  ngOnInit (): void {
    this.loader.start();
    this.activatedRoute.params
      .pipe(
        switchMap( ( { id } ) => this.benefitUserService.show( id ) )
      )
      .subscribe(
        {
          next: benefitUser => {
            this.benefitUser = Object.values( benefitUser )[ 0 ];
            this.loader.complete();
            this.loaded = true;
          },
          error: err => {
            this.router.navigate( [ 'benefit-employee', 'index' ], { relativeTo: this.activatedRoute } );
            this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, err.error.message );
            this.loader.complete();
            this.loaded = true;  
          }
        }
      );
  }

  deleteBenefit ( eventID: number ) {
    Swal.fire( {
      title: 'Eliminar beneficio?',
      text: 'Confirme que desea eliminar el beneficio.',
      icon: 'question',
      showClass: {
        popup: 'animate__animated animate__fadeIn'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      },
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    } ).then( ( result ) => {
      if ( result.isConfirmed ) {
        this.benefitUserService.destroy( eventID )
          .subscribe( {
            next: resp => {
              this.as.subscriptionAlert( subscriptionMessageTitle.ELIMINADO, subscriptionMessageIcon.SUCCESS );
              this.router.navigate( [ 'benefit-employee', 'index' ] );
            },
            error: ( { error } ) => this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.message )
          } )
      }
    } );
  }

}
