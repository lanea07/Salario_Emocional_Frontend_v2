import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LoadingBarService } from '@ngx-loading-bar/core';
import { MessageService } from 'primeng/api';

import { BenefitUserElement } from 'src/app/benefit-user/interfaces/benefit-user.interface';
import { User } from 'src/app/user/interfaces/user.interface';
import { UserService } from 'src/app/user/services/user.service';
import { BenefitUserService } from '../../../../services/benefit-user.service';
import { AuthService } from '../../../../../auth/services/auth.service';

@Component( {
    selector: 'my-collaborators-benefits',
    templateUrl: './my-collaborators-benefits.component.html',
    styles: [],
    standalone: false
} )
export class MyCollaboratorsBenefitsComponent implements OnInit, OnChanges {

  calendarData: BenefitUserElement[] = [];
  collaborators: User[] = [];
  currentUser?: any = null;
  formGroup: FormGroup = this.fb.group( {
    user_id: [ '', Validators.required ],
  } );
  loaded: boolean = true;
  loader = this.lbs.useRef();
  year?: number = new Date().getFullYear();

  constructor (
    private authService: AuthService,
    private benefitUserService: BenefitUserService,
    private fb: FormBuilder,
    private lbs: LoadingBarService,
    private ms: MessageService,
    private userService: UserService,
  ) { }

  ngOnInit (): void {
    this.loaded = false;
    this.loader.start();
    this.userService.userDescendants()
      .subscribe( {
        next: ( currentUser ) => {
          this.loader.complete();
          this.loaded = true;
          if ( !currentUser ) {
            this.loader.complete();
            return;
          };
          this.collaborators = currentUser.data[0]?.descendants.filter( ( user ) => {
            return user.id !== this.authService.getuser()?.user.id!;
          } );
          this.collaborators.sort( ( a, b ) => a.name.localeCompare( b.name ) );
        },
        error: ( { error } ) => {
          this.loader.complete();
          this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } );
        }
      } );
  }

  ngOnChanges ( changes: SimpleChanges ): void {
    this.loaded = false;
    this.fillBenefits();
  }

  updateBenefitsPerUser ( event: any ) {
    this.year = event;
    this.fillBenefits();
  }

  fillBenefits () {
    if ( this.formGroup.invalid ) return;
    this.loaded = false;
    this.loader.start();
    this.benefitUserService.showByUserID( this.formGroup.value.user_id, this.year! )
      .subscribe( {
        next: ( benefitUser ) => {
          this.loader.complete();
          this.loaded = true;
          this.currentUser = benefitUser.data[ 0 ]
          if ( this.currentUser ) {
            this.calendarData = [];
            this.calendarData = this.currentUser.benefit_user;
          }
        },
        error: ( { error } ) => {
          this.loader.complete();
          this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } );
        }
      } );
  }

}
