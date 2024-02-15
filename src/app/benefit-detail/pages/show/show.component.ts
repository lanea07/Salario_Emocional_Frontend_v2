import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

import Swal from 'sweetalert2';

import { BenefitDetail } from '../../interfaces/benefit-detail.interface';
import { BenefitDetailService } from '../../services/benefit-detail.service';
import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component( {
  selector: 'benefitdetail-show',
  templateUrl: './show.component.html',
  styles: [
  ]
} )
export class ShowComponent {

  benefitDetail?: BenefitDetail;
  isAdmin!: boolean;
  loaded: boolean = false;

  constructor (
    public activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private as: AlertService,
    private benefitDetailService: BenefitDetailService,
    private router: Router,
  ) { }

  ngOnInit () {
    this.activatedRoute.params
      .pipe(
        switchMap( ( { id } ) => this.benefitDetailService.show( id ) )
      )
      .subscribe( {
        next: ( benefitDetail ) => {
          this.benefitDetail = Object.values( benefitDetail )[ 0 ];
          this.loaded = true;
        },
        error: ( { error } ) => {
          this.router.navigate( [ 'basic', 'benefit-employee' ] );
          this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.message )
        }
      } );

    this.authService.validarAdmin()
      .subscribe( {
        next: ( isAdmin: any ) => {
          this.isAdmin = isAdmin.admin;
        },
        error: ( { error } ) => this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.message )
      } );
  }

}
