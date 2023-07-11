import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { AuthResponse, ValidToken } from '../interfaces/auth.interface';
import { map, catchError, tap, mergeMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable( {
  providedIn: 'root'
} )
export class AuthService {

  private baseUrl: string = environment.apiBaseUrl;
  private baseUrl1: string = environment.baseUrl;

  constructor ( private http: HttpClient ) { }

  private getCookie (): Observable<any> {
    return this.http.get( `${ this.baseUrl1 }/sanctum/csrf-cookie` )
  }

  login ( email: string, password: string, device_name: string ) {
    const url = `${ this.baseUrl }/login`;
    const body = { email, password, device_name };
    const headers = new HttpHeaders().set( 'Accept', 'application/json' );
    return this.getCookie().pipe(
      mergeMap( res => {
        return this.http.post<AuthResponse>( url, body, { headers, withCredentials: true } )
          .pipe(
            tap( resp => {
              if ( resp ) {
                localStorage.setItem( 'token', resp.token! );
                localStorage.setItem( 'can', JSON.stringify( resp.can! ) );
                localStorage.setItem( 'uid', resp.id!.toString() );
              }
            } ),
            map( resp => resp ),
            catchError( err =>
              of( err.error.message ) )
          );
      } )
    )
  }

  // login ( email: string, password: string, device_name: string ) {

  //   const url = `${ this.baseUrl }/login`;
  //   const body = { email, password, device_name };
  //   const headers = new HttpHeaders().set( 'Accept', 'application/json' );

  //   return this.http.post<AuthResponse>( url, body, { headers, withCredentials: true } } )
  //     .pipe(
  //       tap( resp => {
  //         if ( resp ) {
  //           localStorage.setItem( 'token', resp.token! );
  //           localStorage.setItem( 'can', JSON.stringify( resp.can! ) );
  //           localStorage.setItem( 'uid', resp.id!.toString() );
  //         }
  //       } ),
  //       map( resp => resp ),
  //       catchError( err =>
  //         of( err.error.message ) )
  //     );

  // }

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
        catchError( err => of( false ) )
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
        catchError( err => of( false ) )
      );
  }

}
