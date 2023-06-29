import { Component } from '@angular/core';
import { BenefitDetail } from '../../interfaces/benefit-detail.interface';
import { BenefitDetailService } from '../../services/benefit-detail.service';
import { Benefit } from 'src/app/benefit/interfaces/benefit.interface';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component( {
  selector: 'benefitdetail-index',
  templateUrl: './index.component.html',
  styles: [
    `
      table tbody tr td a:not(:last-child) {
        border-right: 2px solid #0D6EFD;
      }
    `
  ]
} )
export class IndexComponent {

  benefitDetails: BenefitDetail[] = [];
  benefits!: Benefit[];

  constructor (
    private benefitDetailService: BenefitDetailService,
    private router: Router
  ) { }

  ngOnInit () {
    this.benefitDetailService.index()
      .subscribe( {
        next: ( benefitDetails ) => {
          this.benefitDetails = benefitDetails
          this.benefits = Object.values<Benefit>( benefitDetails );
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
          } )
        }
      } );
  }

}
