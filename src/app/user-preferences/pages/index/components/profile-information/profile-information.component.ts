import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserService } from 'src/app/user/services/user.service';

@Component( {
    selector: 'profile-information',
    templateUrl: './profile-information.component.html',
    styles: [],
    standalone: false
} )
export class ProfileInformationComponent {

  profileForm: FormGroup = this.fb.group( {
    name: [ '', [ Validators.required, Validators.minLength( 3 ) ] ],
    email: [ '', [ Validators.required, Validators.email ] ],
  } );
  user_id: any;

  constructor (
    private fb: FormBuilder,
    private userService: UserService,
  ) {
    this.user_id = localStorage.getItem( 'uid' );
    this.userService.show( this.user_id )
      .subscribe( {
        next: ( user: any ) => {
          this.profileForm.reset( user[ 0 ] );
        }
      } )
    this.profileForm.controls[ 'name' ].disable();
    this.profileForm.controls[ 'email' ].disable();
  }

  isValidField ( campo: string ) {
    return this.profileForm.controls[ campo ].errors
      && this.profileForm.controls[ campo ].touched;
  }

  save () {
    if ( !this.profileForm.valid ) {
      this.profileForm.markAllAsTouched();
      return;
    }
    console.log( this.profileForm.value );
  }

}
