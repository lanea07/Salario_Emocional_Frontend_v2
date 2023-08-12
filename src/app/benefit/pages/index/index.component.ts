import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { Benefit } from '../../interfaces/benefit.interface';
import { BenefitService } from '../../services/benefit.service';

@Component( {
  selector: 'benefit-index',
  templateUrl: './index.component.html',
  styles: [
  ]
} )
export class IndexComponent implements OnInit {

  benefits: Benefit[] = [];

  constructor (
    private benefitService: BenefitService,
    private router: Router
  ) { }
  ngOnInit () {
    this.benefitService.index().subscribe( {
      next: ( benefits ) => {
        this.benefits = benefits
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
  }

}
