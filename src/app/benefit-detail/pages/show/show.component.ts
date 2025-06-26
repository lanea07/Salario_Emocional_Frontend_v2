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
  styles: [],
  standalone: false
} )
export class ShowComponent {

  benefitDetail?: BenefitDetail;
  loaded: boolean = false;

  constructor (
    public activatedRoute: ActivatedRoute,
    public authService: AuthService,
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
          this.benefitDetail = Object.values( benefitDetail.data )[ 0 ];
          this.loaded = true;
        },
        error: ( { error } ) => {
          this.router.navigate( [ 'basic', 'benefit-employee' ] );
          this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } )
        }
      } );
  }

}
