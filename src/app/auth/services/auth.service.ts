import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { ApiV1Response } from '../../shared/interfaces/ApiV1Response.interface';
import { AuthData, AuthResponse } from '../interfaces/auth.interface';

@Injectable( {
  providedIn: 'root'
} )
export class AuthService {

  public userInformation: BehaviorSubject<AuthData | null> = new BehaviorSubject<AuthData | null>( null );

  constructor (
    private http: HttpClient
  ) {
    const userJson = localStorage.getItem( 'user' );
    const token = localStorage.getItem( 'token' );
    const actionsJson = localStorage.getItem( 'actions' );
    const simulated = localStorage.getItem( 'simulated' );
    const expires_in = localStorage.getItem( 'expires_in' );

    let authData: AuthData | null = null;
    if ( userJson && token && actionsJson && simulated !== null  ) {
      authData = {
        token,
        user: JSON.parse( userJson ),
        actions: JSON.parse( actionsJson ),
        simulated: simulated === 'true',
        expires_in: Number(expires_in)
      };
    }
    this.userInformation = new BehaviorSubject<AuthData | null>( authData );
  }

  public setUser ( user: AuthData ) {
    this.userInformation.next( user );
  }

  public getuser (): AuthData | null {
    return this.userInformation.getValue();
  }

  public login ( email: string, password: string, device_name: string ) {
    const url = `/login`;
    const body = { email, password, device_name };

    return this.http.post<AuthResponse>( url, body, { withCredentials: true } )
      .pipe(
        tap( response => {
          if ( response.data.token ) {
            localStorage.setItem( 'token', response.data.token! );
            localStorage.setItem( 'user', JSON.stringify( response.data.user! ) );
            localStorage.setItem( 'uid', response.data.user.id!.toString() );
            localStorage.setItem( 'simulated', false.toString() );
            localStorage.setItem( 'expires_in', response.data.expires_in.toString() );
            localStorage.setItem( 'actions', JSON.stringify( response.data.actions ) );
          }
        } )
      );
  }

  logout () {
    const url = `/auth/logout`;
    return this.http.post<AuthResponse>( url, [], { withCredentials: true } )
      .pipe(
        tap( resp => {
          localStorage.clear();
        } ),
      );
  }

  validarToken (): Observable<ApiV1Response<boolean>> {
    const url = `/validate-token`;
    return this.http.post<ApiV1Response<boolean>>( url, [], { withCredentials: true } )
      .pipe(
        catchError( err => {
          return of( { data: false, message: 'Token validation failed', status: false } as ApiV1Response<boolean> );
        } )
      );
  }

  validarActions ( actions: number[] ): Observable<boolean> {
    const userActions = this.getuser()?.actions || [];
    return of( actions.some( action => userActions.includes( action ) ) );
  }

  validarRequirePassChange (): Observable<ApiV1Response<boolean>> {
    const url = `/validate-requirePassChange`;
    return this.http.post<ApiV1Response<boolean>>( url, [], { withCredentials: true } )
  }

  passwordChange ( formValues: any ) {
    const url = `/auth/passwordChange`;
    return this.http.post<boolean>( url, formValues, { withCredentials: true } )
  }

  loginAs ( user_id: number ) {
    const url = `/auth/login-as`;
    const device_name = 'PC';
    const body = { user_id, device_name };

    return this.http.post<AuthResponse>( url, body, { withCredentials: true } )
      .pipe(
        tap( response => {
          if ( response.data.token ) {
            localStorage.setItem( 'token', response.data.token! );
            localStorage.setItem( 'user', JSON.stringify( response.data.user! ) );
            localStorage.setItem( 'uid', response.data.user.id!.toString() );
            localStorage.setItem( 'simulated', false.toString() );
            localStorage.setItem( 'actions', JSON.stringify( response.data.actions ) );
          }
        } )
      );
  }

  forgotPassword ( formValues: any ) {
    const url = `/auth/forgot-password`;
    return this.http.post<boolean>( url, formValues, { withCredentials: true } )
  }
}
