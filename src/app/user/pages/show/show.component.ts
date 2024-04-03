import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { mergeMap, switchMap } from 'rxjs';

import { MessageService } from 'primeng/api';

import { User } from '../../interfaces/user.interface';
import { UserService } from '../../services/user.service';
import { UserPreferencesService } from '../../../user-preferences/services/user-preferences.service';
import { Preference } from 'src/app/shared/interfaces/Preferences.interface';

@Component( {
  selector: 'user-show',
  templateUrl: './show.component.html',
  styles: [
  ]
} )
export class ShowComponent {

  loaded: boolean = false;
  roles: string[] = [];
  user?: User;
  userPreferences?: Preference[];

  constructor (
    public activatedRoute: ActivatedRoute,
    private router: Router,
    private ms: MessageService,
    private userService: UserService,
    private userPreferencesService: UserPreferencesService,
  ) { }

  ngOnInit () {
    this.activatedRoute.params
      .pipe(
        switchMap( ( { id } ) => this.userService.show( id ) ),
        switchMap( ( user ) => {
          this.user = Object.values( user )[ 0 ];
          this.loaded = true;
          this.user?.roles?.forEach( role => this.roles.push( role.name ) );
          return this.userPreferencesService.show( this.user!.id )
        } )
      )
      .subscribe( {
        next: ( userPreferences ) => {
          let CurrentUserPreferences: any = userPreferences;
          let keys = Object.keys( CurrentUserPreferences[ 0 ] );
          this.userPreferences = keys.map( ( key: any ) => {
            return {
              name: key,
              values: CurrentUserPreferences[ 0 ][ key ]
            }
          } );
        },
        error: ( { error } ) => {
          this.router.navigate( [ 'basic', 'benefit-employee' ] );
          this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } )
        }
      } );
  }

}
