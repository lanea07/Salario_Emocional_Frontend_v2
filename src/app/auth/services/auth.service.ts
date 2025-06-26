import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { ApiV1Response } from '../../shared/interfaces/ApiV1Response.interface';
import { AuthData } from '../interfaces/auth.interface';

@Injectable( {
  providedIn: 'root'
} )
export class AuthService {

  public userInformation: BehaviorSubject<AuthData | null> = new BehaviorSubject<AuthData | null>( null );

  constructor ( private http: HttpClient ) {
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

    return this.http.post<ApiV1Response<AuthData>>( url, body, { withCredentials: true } );
  }

  logout () {
    const url = `/auth/logout`;
    return this.http.post<ApiV1Response<AuthData>>( url, [], { withCredentials: true } );
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

  validarActions ( actions: number[] ): boolean {
    return actions.some( action => this.getuser()?.actions.includes( action ) );
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

    return this.http.post<ApiV1Response<ApiV1Response<AuthData>>>( url, body, { withCredentials: true } );
  }

  forgotPassword ( formValues: any ) {
    const url = `/auth/forgot-password`;
    return this.http.post<boolean>( url, formValues, { withCredentials: true } )
  }

  public getUserData (): Observable<ApiV1Response<AuthData>> {
    return this.http.get<ApiV1Response<AuthData>>( '/auth/user' );
  }
}
