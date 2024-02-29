import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';

import { Preference } from 'src/app/shared/interfaces/Preferences.interface';
import { UserPreferencesService } from 'src/app/user-preferences/services/user-preferences.service';

@Component( {
  selector: 'user-preferences',
  templateUrl: './user-preferences.component.html',
  styles: [
  ]
} )
export class UserPreferencesComponent {

  defaultPreferences?: Preference[];
  userPreferences?: Preference[];
  preferencesForm: FormGroup = this.fb.group( {} );
  user_id!: number;
  loaded: boolean = false;

  constructor (
    private as: AlertService,
    private fb: FormBuilder,
    private userPreferencesService: UserPreferencesService,
  ) {
    this.user_id = parseInt( localStorage.getItem( 'uid' )! );
    combineLatest( {
      preferencesDefault: this.userPreferencesService.index(),
      userPreferences: this.userPreferencesService.show( this.user_id )
    } )
      .subscribe( {
        next: ( { preferencesDefault, userPreferences } ) => {
          let DefaultUserPreferences: any = preferencesDefault;
          let keys = Object.keys( DefaultUserPreferences[ 0 ] );
          this.defaultPreferences = keys.map( ( key: any ) => {
            return {
              name: key,
              values: DefaultUserPreferences[ 0 ][ key ]
            }
          } );

          let CurrentUserPreferences: any = userPreferences;
          keys = Object.keys( CurrentUserPreferences[ 0 ] );
          this.userPreferences = keys.map( ( key: any ) => {
            return {
              name: key,
              values: CurrentUserPreferences[ 0 ][ key ]
            }
          } );

          Object.keys( preferencesDefault[ 0 ] ).forEach( ( preference: any ) => {
            let value = this.userPreferences?.find( ( userPreference: any ) => userPreference.name === preference )?.values;
            this.preferencesForm.addControl( preference, new FormControl( value, [ Validators.required ] ) );
          } );
          this.loaded = true;
        }
      } );
  }


  isValidField ( campo: string ) {
    return this.preferencesForm.controls[ campo ].errors
      && this.preferencesForm.controls[ campo ].touched;
  }

  save () {
    if ( !this.preferencesForm.valid ) {
      this.preferencesForm.markAllAsTouched();
      return;
    }
    this.loaded = false;
    this.userPreferencesService.update( this.user_id, this.preferencesForm.value )
      .subscribe( {
        next: ( response ) => {
          this.as.subscriptionAlert( subscriptionMessageTitle.ACTUALIZADO, subscriptionMessageIcon.SUCCESS, response.message )
          this.loaded = true;
        },
        error: ( { error } ) => this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.message )
      } )

  }

}
