import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DefaultUserPreferences, Preference } from '../interfaces/UserPreferences.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable( {
  providedIn: 'root'
} )
export class UserPreferencesService {

  apiBaseUrl = environment.apiBaseUrl;
  token = localStorage.getItem( 'token' );

  constructor (
    private http: HttpClient,
  ) { }

  index (): Observable<DefaultUserPreferences[]> {
    const headers = new HttpHeaders()
      .set( 'Accept', 'application/json' )
      .set( 'Authorization', `Bearer ${ localStorage.getItem( 'token' ) }` );

    return this.http.get<DefaultUserPreferences[]>( `${ this.apiBaseUrl }/user-preferences`, { headers, withCredentials: true } )
  }

  show ( id: number ): Observable<DefaultUserPreferences> {
    const headers = new HttpHeaders()
      .set( 'Accept', 'application/json' )
      .set( 'Authorization', `Bearer ${ localStorage.getItem( 'token' ) }` );

    return this.http.get<DefaultUserPreferences>( `${ this.apiBaseUrl }/user-preferences/${ id }`, { headers, withCredentials: true } )
  }

  update ( id: number, formValues: any ) {
    const headers = new HttpHeaders()
      .set( 'Accept', 'application/json' )
      .set( 'Authorization', `Bearer ${ localStorage.getItem( 'token' ) }` );

    return this.http.put<any>( `${ this.apiBaseUrl }/user-preferences/${ id }`, formValues, { headers, withCredentials: true } );
  }
}
