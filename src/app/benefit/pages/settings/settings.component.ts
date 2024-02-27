import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Preference } from 'src/app/shared/interfaces/Preferences.interface';
import { BenefitService } from '../../services/benefit.service';
import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';
import { combineLatest, switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Benefit } from '../../interfaces/benefit.interface';

@Component( {
  selector: 'settings',
  templateUrl: './settings.component.html',
  styles: ``
} )
export class SettingsComponent {

  defaultSettings?: Preference[];
  loaded: boolean = false;
  settingsForm: FormGroup = this.fb.group( {} );
  benefitSettings?: Preference[];
  benefit?: Benefit;

  constructor (
    private activatedRoute: ActivatedRoute,
    private as: AlertService,
    private benefitService: BenefitService,
    private fb: FormBuilder
  ) {
    combineLatest( {
      settingsDefault: this.benefitService.indexSettings(),
      benefitSettings: this.activatedRoute.params.pipe(
        switchMap( ( { id } ) => this.benefitService.show( id ) ),
        switchMap( ( benefit ) => {
          this.benefit = Object.values( benefit )[ 0 ];
          return this.benefitService.showSettings( this.benefit!.id )
        } )
      )
    } )
      .subscribe( {
        next: ( { settingsDefault, benefitSettings } ) => {
          let DefaultUserSettings: any = settingsDefault;
          let keys = Object.keys( DefaultUserSettings[ 0 ] );
          this.defaultSettings = keys.map( ( key: any ) => {
            return {
              name: key,
              values: DefaultUserSettings[ 0 ][ key ]
            }
          } );

          let CurrentUserSettings: any = benefitSettings;
          keys = Object.keys( CurrentUserSettings[ 0 ] );
          this.benefitSettings = keys.map( ( key: any ) => {
            return {
              name: key,
              values: CurrentUserSettings[ 0 ][ key ]
            }
          } );

          Object.keys( settingsDefault[ 0 ] ).forEach( ( preference: any ) => {
            let value = this.benefitSettings?.find( ( userPreference: any ) => userPreference.name === preference )?.values;
            this.settingsForm.addControl( preference, new FormControl( value, [ Validators.required ] ) );
          } );
          this.loaded = true;
        },
        error: ( { error } ) => this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.message )
      } );
  }

  isValidField ( campo: string ) {
    return this.settingsForm.controls[ campo ].errors
      && this.settingsForm.controls[ campo ].touched;
  }

  save () {
    if ( !this.settingsForm.valid ) {
      this.settingsForm.markAllAsTouched();
      return;
    }
    this.loaded = false;
    this.benefitService.updateSettings( this.benefit!.id, this.settingsForm.value )
      .subscribe( {
        next: ( response ) => {
          this.as.subscriptionAlert( subscriptionMessageTitle.ACTUALIZADO, subscriptionMessageIcon.SUCCESS, response.message )
          this.loaded = true;
        },
        error: ( { error } ) => {
          this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, error.message );
          this.loaded = true;
        }
      } )

  }
}
