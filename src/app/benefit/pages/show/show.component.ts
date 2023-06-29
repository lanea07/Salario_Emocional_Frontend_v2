import { Component } from '@angular/core';
import { Benefit } from '../../interfaces/benefit.interface';
import { BenefitService } from '../../services/benefit.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { BenefitDetail } from 'src/app/benefit-detail/interfaces/benefit-detail.interface';
import Swal from 'sweetalert2';

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
  loaded: boolean = false;

  constructor (
    private benefitService: BenefitService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit () {
    this.activatedRoute.params
      .pipe(
        switchMap( ( { id } ) => this.benefitService.show( id ) )
      )
      .subscribe( {
        next: ( benefit ) => {
          this.benefit = Object.values( benefit )[ 0 ];
          this.details = this.benefit.benefit_detail;
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
  }

}
