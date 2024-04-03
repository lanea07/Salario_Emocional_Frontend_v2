import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

import { MessageService } from 'primeng/api';

import { AuthService } from 'src/app/auth/services/auth.service';
import { BenefitDetail } from '../../interfaces/benefit-detail.interface';
import { BenefitDetailService } from '../../services/benefit-detail.service';

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
    private benefitDetailService: BenefitDetailService,
    private router: Router,
    private ms: MessageService,
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
          this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } )
        }
      } );

    this.authService.validarAdmin()
      .subscribe( {
        next: ( isAdmin: any ) => {
          this.isAdmin = isAdmin.admin;
        },
        error: ( { error } ) => this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } )
      } );
  }

}
