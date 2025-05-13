import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';

import { MessageService } from 'primeng/api';

import { AuthService } from 'src/app/auth/services/auth.service';
import { HelpersService } from 'src/app/shared/services/helpers.service';
import { Benefit } from '../../interfaces/benefit.interface';
import { BenefitService } from '../../services/benefit.service';

@Component( {
    selector: 'benefit-show',
    templateUrl: './show.component.html',
    styles: [],
    standalone: false
} )
export class ShowComponent {

  benefit?: Benefit;
  details: any;
  filePoliticas: string = "";
  isAdmin: boolean = false;
  loaded: boolean = false;

  constructor (
    public activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private benefitService: BenefitService,
    public helpers: HelpersService,
    private ms: MessageService,
  ) { }

  ngOnInit () {
    this.activatedRoute.params
      .pipe(
        switchMap( ( { id } ) => this.benefitService.show( id ) )
      )
      .subscribe( {
        next: ( benefit ) => {
          this.benefit = Object.values( benefit )[ 0 ];
          this.details = this.benefit?.benefit_detail;
          this.filePoliticas = this.benefit?.politicas_path ? this.benefit.politicas_path : '';
          this.loaded = true;
        },
        error: ( { error } ) => this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } )
      } );

    this.authService.validarAdmin()
      .subscribe( {
        next: ( isAdmin: any ) => this.isAdmin = isAdmin.admin,
        error: ( { error } ) => this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } )
      } );
  }
}
