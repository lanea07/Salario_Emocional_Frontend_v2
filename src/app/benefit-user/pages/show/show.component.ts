import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

import Swal from 'sweetalert2';

import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';
import { BenefitUser } from '../../interfaces/benefit-user.interface';
import { BenefitUserService } from '../../services/benefit-user.service';

@Component( {
  selector: 'benefitemployee-show',
  templateUrl: './show.component.html',
  styles: [
  ]
} )
export class ShowComponent implements OnInit {

  loaded: boolean = false;
  benefitUser?: BenefitUser;

  constructor (
    private activatedRoute: ActivatedRoute,
    private as: AlertService,
    private benefitUserService: BenefitUserService,
    private router: Router,
  ) { }

  ngOnInit (): void {
    this.activatedRoute.params
      .pipe(
        switchMap( ( { id } ) => this.benefitUserService.show( id ) )
      )
      .subscribe(
        {
          next: benefitUser => {
            this.benefitUser = Object.values( benefitUser )[ 0 ];
            this.loaded = true;
          },
          error: err => {
            this.router.navigateByUrl( 'benefit-employee/index' );
            this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, err.error.message );
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
              this.router.navigateByUrl( '/benefit-employee/index' );
            },
            error: ( { error } ) => this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.message )
          } )
      }
    } );
  }

}
