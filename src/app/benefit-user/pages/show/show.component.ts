import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

import { LoadingBarService } from '@ngx-loading-bar/core';
import { ConfirmationService, MessageService } from 'primeng/api';

import { BenefitUser } from '../../interfaces/benefit-user.interface';
import { BenefitUserService } from '../../services/benefit-user.service';

@Component( {
  selector: 'benefitemployee-show',
  templateUrl: './show.component.html',
  styles: [],
  standalone: false
} )
export class ShowComponent implements OnInit {

  loaded: boolean = false;
  loader = this.lbs.useRef();
  benefitUser?: BenefitUser;


  constructor (
    public activatedRoute: ActivatedRoute,
    private benefitUserService: BenefitUserService,
    private cs: ConfirmationService,
    private lbs: LoadingBarService,
    private router: Router,
    private ms: MessageService,
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
            this.benefitUser = Object.values( benefitUser.data )[ 0 ];
            this.loader.complete();
            this.loaded = true;
          },
          error: err => {
            this.router.navigate( [ 'benefit-employee', 'index' ], { relativeTo: this.activatedRoute } );
            this.ms.add( { severity: 'error', summary: 'Error', detail: err.error.message } );
            this.loader.complete();
            this.loaded = true;
          }
        }
      );
  }

  deleteBenefit ( eventID: number ) {
    this.cs.confirm( {
      message: 'Estás Seguro? Esta acción no se puede deshacer.',
      header: 'Confirmar...',
      icon: 'fa-solid fa-triangle-exclamation',
      acceptIcon: "none",
      rejectIcon: "none",
      acceptButtonStyleClass: "btn btn-danger",
      rejectButtonStyleClass: "btn btn-link",
      accept: () => {
        this.benefitUserService.destroy( eventID )
          .subscribe( {
            next: () => {
              this.ms.add( { severity: 'success', summary: 'Eliminado' } );
              this.router.navigate( [ 'benefit-employee', 'index' ] );
            },
            error: ( { error } ) => this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } )
          } )
      },
      reject: () => {
        this.ms.add( { severity: 'info', summary: 'Operación Cancelada' } );
      }
    } );
  }

}
