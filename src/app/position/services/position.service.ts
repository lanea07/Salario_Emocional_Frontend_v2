import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Position } from '../interfaces/position.interface';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable( {
  providedIn: 'root'
} )
export class PositionService {

  apiBaseUrl = environment.apiBaseUrl;
  token = localStorage.getItem( 'token' );

  constructor ( private http: HttpClient ) { }

  index (): Observable<Position[]> {
    const headers = new HttpHeaders()
      .set( 'Accept', 'application/json' )
      .set( 'Authorization', `Bearer ${ localStorage.getItem( 'token' ) }` );

    return this.http.get<Position[]>( `${ this.apiBaseUrl }/position`, { headers, withCredentials: true } )
  }

  show ( id: number ): Observable<Position> {
    const headers = new HttpHeaders()
      .set( 'Accept', 'application/json' )
      .set( 'Authorization', `Bearer ${ localStorage.getItem( 'token' ) }` );

    return this.http.get<Position>( `${ this.apiBaseUrl }/position/${ id }`, { headers, withCredentials: true } )
  }

  create ( formValues: any ): Observable<Position> {
    const headers = new HttpHeaders()
      .set( 'Accept', 'application/json' )
      .set( 'Authorization', `Bearer ${ localStorage.getItem( 'token' ) }` );

    return this.http.post<Position>( `${ this.apiBaseUrl }/position`, formValues, { headers, withCredentials: true } );
  }

  update ( id: number | undefined, formValues: any ) {
    const headers = new HttpHeaders()
      .set( 'Accept', 'application/json' )
      .set( 'Authorization', `Bearer ${ localStorage.getItem( 'token' ) }` );

    return this.http.put<Position>( `${ this.apiBaseUrl }/position/${ id }`, formValues, { headers, withCredentials: true } );
  }

  destroy ( id: number | undefined ) {
    const headers = new HttpHeaders()
      .set( 'Accept', 'application/json' )
      .set( 'Authorization', `Bearer ${ localStorage.getItem( 'token' ) }` );

    return this.http.delete( `${ this.apiBaseUrl }/position/${ id }`, { headers, withCredentials: true } );
  }

}
