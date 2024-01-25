import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { AuthResponse, ValidToken } from '../interfaces/auth.interface';

@Injectable( {
  providedIn: 'root'
} )
export class AuthService {

  private baseUrl: string = environment.apiBaseUrl;
  private baseUrl1: string = environment.baseUrl;
  private getCookie (): Observable<any> {
    return this.http.get( `${ this.baseUrl1 }/sanctum/csrf-cookie` )
  }

  constructor (
    private http: HttpClient
  ) { }

  login ( email: string, password: string, device_name: string ) {
    const url = `${ this.baseUrl }/login`;
    const body = { email, password, device_name };
    const headers = new HttpHeaders().set( 'Accept', 'application/json' );
    return this.getCookie().pipe(
      mergeMap( res => {
        return this.http.post<AuthResponse>( url, body, { headers, withCredentials: true } )
          .pipe(
            tap( resp => {
              if ( resp.token ) {
                localStorage.setItem( 'token', resp.token! );
                localStorage.setItem( 'user', JSON.stringify( resp.user! ) );
                localStorage.setItem( 'uid', resp.id!.toString() );
              }
            } )
          );
      } )
    )
  }

  logout () {
    const url = `${ this.baseUrl }/logout`;
    const token = localStorage.getItem( 'token' );
    const headers = new HttpHeaders()
      .set( 'Accept', 'application/json' )
      .set( 'Authorization', `Bearer ${ token }` );

    return this.http.post<AuthResponse>( url, [], { headers, withCredentials: true } )
      .pipe(
        tap( resp => {
          localStorage.clear();
        } ),
      );
  }

  validarToken (): Observable<boolean> {
    const url = `${ this.baseUrl }/validate-token`;
    const token = localStorage.getItem( 'token' );
    const headers = new HttpHeaders()
      .append( 'Authorization', `Bearer ${ token }` );

    return this.http.post<ValidToken>( url, [], { headers, withCredentials: true } )
      .pipe(
        map( resp => resp.valid ),
        catchError( err => { return of( false ) } )
    );
  }

  validarAdmin () {
    const url = `${ this.baseUrl }/validate-roles`;
    const token = localStorage.getItem( 'token' );
    const headers = new HttpHeaders()
      .append( 'Authorization', `Bearer ${ token }` );

    return this.http.post( url, [], { headers, withCredentials: true } )
      .pipe(
        map( resp => resp ),
        catchError( err => { return of( false ) } )
      );
  }

  validarRequirePassChange (): Observable<boolean> {
    const url = `${ this.baseUrl }/validate-requirePassChange`;
    const token = localStorage.getItem( 'token' );
    const headers = new HttpHeaders()
      .append( 'Authorization', `Bearer ${ token }` );

    return this.http.post<boolean>( url, [], { headers, withCredentials: true } )
  }

  passwordChange ( formValues: any ) {
    const url = `${ this.baseUrl }/passwordChange`;
    const token = localStorage.getItem( 'token' );
    const headers = new HttpHeaders()
      .append( 'Authorization', `Bearer ${ token }` );

    return this.http.post<boolean>( url, formValues, { headers, withCredentials: true } )
  }
}
