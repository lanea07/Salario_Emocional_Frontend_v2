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
    return this.getCookie().pipe(
      mergeMap( res => {
        return this.http.post<AuthResponse>( url, body, { withCredentials: true } )
          .pipe(
            tap( resp => {
              if ( resp.token ) {
                localStorage.setItem( 'token', resp.token! );
                localStorage.setItem( 'user', JSON.stringify( resp.user! ) );
                localStorage.setItem( 'uid', resp.id!.toString() );
                localStorage.setItem( 'simulated', false + '' );
              }
            } )
          );
      } )
    )
  }

  logout () {
    const url = `${ this.baseUrl }/logout`;
    return this.http.post<AuthResponse>( url, [], { withCredentials: true } )
      .pipe(
        tap( resp => {
          localStorage.clear();
        } ),
      );
  }

  validarToken (): Observable<boolean> {
    const url = `${ this.baseUrl }/validate-token`;
    return this.http.post<ValidToken>( url, [], { withCredentials: true } )
      .pipe(
        map( resp => resp.valid ),
        catchError( err => { return of( false ) } )
    );
  }

  validarAdmin () {
    const url = `${ this.baseUrl }/validate-roles`;
    return this.http.post<any>( url, [], { withCredentials: true } );
  }

  validarRequirePassChange (): Observable<boolean> {
    const url = `${ this.baseUrl }/validate-requirePassChange`;
    return this.http.post<boolean>( url, [], { withCredentials: true } )
  }

  passwordChange ( formValues: any ) {
    const url = `${ this.baseUrl }/passwordChange`;
    return this.http.post<boolean>( url, formValues, { withCredentials: true } )
  }

  loginAs ( user_id: number ) {
    const url = `${ this.baseUrl }/login-as`;
    const device_name = 'PC';
    const body = { user_id, device_name };
    return this.getCookie().pipe(
      mergeMap( () => {
        return this.http.post<AuthResponse>( url, body, { withCredentials: true } )
          .pipe(
            tap( resp => {
              if ( resp.token ) {
                localStorage.setItem( 'token', resp.token! );
                localStorage.setItem( 'user', JSON.stringify( resp.user! ) );
                localStorage.setItem( 'uid', resp.id!.toString() );
                localStorage.setItem( 'simulated', resp.simulated!.toString() );
              }
            } )
          );
      } )
    )
  }
}
