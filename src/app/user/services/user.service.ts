import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from '../interfaces/user.interface';

@Injectable( {
  providedIn: 'root'
} )
export class UserService {

  apiBaseUrl = environment.apiBaseUrl;
  token = localStorage.getItem( 'token' );

  constructor ( private http: HttpClient ) {

  }

  index (): Observable<User[]> {
    const headers = new HttpHeaders()
      .set( 'Accept', 'application/json' )
      .set( 'Authorization', `Bearer ${ this.token }` );

    return this.http.get<User[]>( `${ this.apiBaseUrl }/user`, { headers, withCredentials: true } )
  }

  show ( id: number ): Observable<User> {
    const headers = new HttpHeaders()
      .set( 'Accept', 'application/json' )
      .set( 'Authorization', `Bearer ${ this.token }` );

    return this.http.get<User>( `${ this.apiBaseUrl }/user/${ id }`, { headers, withCredentials: true } )
  }

  create ( formValues: any ): Observable<User> {
    const headers = new HttpHeaders()
      .set( 'Accept', 'application/json' )
      .set( 'Authorization', `Bearer ${ this.token }` );

    return this.http.post<User>( `${ this.apiBaseUrl }/user`, formValues, { headers, withCredentials: true } );
  }

  update ( id: number | undefined, formValues: any ) {
    const headers = new HttpHeaders()
      .set( 'Accept', 'application/json' )
      .set( 'Authorization', `Bearer ${ this.token }` );

    return this.http.put<User>( `${ this.apiBaseUrl }/user/${ id }`, formValues, { headers, withCredentials: true } );
  }

  destroy ( id: number | undefined ) {
    const headers = new HttpHeaders()
      .set( 'Accept', 'application/json' )
      .set( 'Authorization', `Bearer ${ this.token }` );

    return this.http.delete( `${ this.apiBaseUrl }/user/${ id }`, { headers, withCredentials: true } );
  }

}
