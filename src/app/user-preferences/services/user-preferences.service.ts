import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DefaultPreferences, Preference } from '../../shared/interfaces/Preferences.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable( {
  providedIn: 'root'
} )
export class UserPreferencesService {

  apiBaseUrl = environment.apiBaseUrl;

  constructor (
    private http: HttpClient,
  ) { }

  index (): Observable<DefaultPreferences[]> {
    return this.http.get<DefaultPreferences[]>( `${ this.apiBaseUrl }/user-preferences`, { withCredentials: true } )
  }

  show ( id: number ): Observable<DefaultPreferences> {
    return this.http.get<DefaultPreferences>( `${ this.apiBaseUrl }/user-preferences/${ id }`, { withCredentials: true } )
  }

  update ( id: number, formValues: any ) {
    return this.http.put<any>( `${ this.apiBaseUrl }/user-preferences/${ id }`, formValues, { withCredentials: true } );
  }
}
