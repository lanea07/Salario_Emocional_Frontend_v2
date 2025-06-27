import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, switchMap } from 'rxjs';

import { MessageService } from 'primeng/api';

import { Preference } from 'src/app/shared/interfaces/Preferences.interface';
import { Benefit } from '../../interfaces/benefit.interface';
import { BenefitService } from '../../services/benefit.service';

@Component( {
  selector: 'settings',
  templateUrl: './settings.component.html',
  styles: ``,
  standalone: false
} )
export class SettingsComponent {

  defaultSettings?: Preference[];
  loaded: boolean = false;
  settingsForm: FormGroup = this.fb.group( {} );
  benefitSettings?: Preference[];
  benefit?: Benefit;

  constructor (
    private activatedRoute: ActivatedRoute,
    private benefitService: BenefitService,
    private fb: FormBuilder,
    private ms: MessageService
  ) {
    combineLatest( {
      settingsDefault: this.benefitService.indexSettings(),
      benefitSettings: this.activatedRoute.params.pipe(
        switchMap( ( { id } ) => this.benefitService.show( id ) ),
        switchMap( ( benefit ) => {
          this.benefit = Object.values( benefit.data )[ 0 ];
          return this.benefitService.showSettings( this.benefit!.id )
        } )
      )
    } )
      .subscribe( {
        next: ( { settingsDefault, benefitSettings } ) => {
          let defaultBenefitService: any = settingsDefault.data;
          let keys = Object.keys( defaultBenefitService[ 0 ] );
          this.defaultSettings = keys.map( ( key: any ) => {
            return {
              name: key,
              title: defaultBenefitService[ 0 ][ key ].title,
              description: defaultBenefitService[ 0 ][ key ].description,
              values: defaultBenefitService[ 0 ][ key ].allowed
            }
          } );

          let CurrentUserSettings: any = benefitSettings.data;
          keys = Object.keys( CurrentUserSettings[ 0 ] );
          this.benefitSettings = keys.map( ( key: any ) => {
            return {
              name: key,
              title: CurrentUserSettings[ 0 ][ key ].title,
              description: CurrentUserSettings[ 0 ][ key ].description,
              values: CurrentUserSettings[ 0 ][ key ]
            }
          } );

          if ( Array.isArray( settingsDefault.data ) && settingsDefault.data.length > 0 ) {
            Object.keys( settingsDefault.data[ 0 ] ).forEach( ( preference: any ) => {
              let value = this.benefitSettings?.find( ( userPreference: any ) => userPreference.name === preference )?.values;
              this.settingsForm.addControl( preference, new FormControl( value, [ Validators.required ] ) );
            } );
          }
          this.loaded = true;
        },

        error: ( { error } ) => this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } )
      } );
  }

  isValidField ( campo?: string ) {
    return this.settingsForm.controls[ campo! ].errors
      && this.settingsForm.controls[ campo! ].touched;
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
          this.ms.add( { severity: 'success', summary: 'Actualizado', detail: response.message } )
          this.loaded = true;
        },
        error: ( { error } ) => {
          this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } )
          this.loaded = true;
        }
      } );
  }
}
