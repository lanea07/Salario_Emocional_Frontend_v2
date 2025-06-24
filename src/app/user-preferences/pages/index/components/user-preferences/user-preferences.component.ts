import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';

import { MessageService } from 'primeng/api';

import { Preference } from 'src/app/shared/interfaces/Preferences.interface';
import { UserPreferencesService } from 'src/app/user-preferences/services/user-preferences.service';

@Component( {
    selector: 'user-preferences',
    templateUrl: './user-preferences.component.html',
    styles: [],
    standalone: false
} )
export class UserPreferencesComponent {

  defaultPreferences?: Preference[];
  userPreferences?: Preference[];
  preferencesForm: FormGroup = this.fb.group( {} );
  user_id!: number;
  loaded: boolean = false;

  constructor (
    private fb: FormBuilder,
    private ms: MessageService,
    private router: Router,
    private userPreferencesService: UserPreferencesService,
  ) {
    this.user_id = parseInt( localStorage.getItem( 'uid' )! );
    combineLatest( {
      preferencesDefault: this.userPreferencesService.index(),
      userPreferences: this.userPreferencesService.show( this.user_id )
    } )
      .subscribe( {
        next: ( { preferencesDefault, userPreferences } ) => {
          let defaultUserPreferences: any = preferencesDefault.data;
          let keys = Object.keys( defaultUserPreferences[ 0 ] );
          this.defaultPreferences = keys.map( ( key: any ) => {
            return {
              name: key,
              title: defaultUserPreferences[ 0 ][ key ].title,
              description: defaultUserPreferences[ 0 ][ key ].description,
              values: defaultUserPreferences[ 0 ][ key ].allowed
            }
          } );

          let CurrentUserPreferences: any = userPreferences.data;
          keys = Object.keys( CurrentUserPreferences[ 0 ] );
          this.userPreferences = keys.map( ( key: any ) => {
            return {
              name: key,
              title: CurrentUserPreferences[ 0 ][ key ].title,
              description: CurrentUserPreferences[ 0 ][ key ].description,
              values: CurrentUserPreferences[ 0 ][ key ]
            }
          } );

          Object.keys( preferencesDefault.data[ 0 ] ).forEach( ( preference: any ) => {
            let value = this.userPreferences?.find( ( userPreference: any ) => userPreference.name === preference )?.values;
            this.preferencesForm.addControl( preference, new FormControl( value, [ Validators.required ] ) );
          } );
          this.loaded = true;
        },
        error: (error) => {
          this.ms.add({ severity: 'error', summary: 'Error', detail: error.error.message });
          return router.navigate( [ 'basic' ] );
        }
      } );
  }


  isValidField ( campo?: string ) {
    return this.preferencesForm.controls[ campo! ].errors
      && this.preferencesForm.controls[ campo! ].touched;
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
          this.ms.add( { severity: 'success', summary: 'Actualizado' } )
          this.loaded = true;
        },
        error: ( { error } ) => this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } )
      } )

  }

}
