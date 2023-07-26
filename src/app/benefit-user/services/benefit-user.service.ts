import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BenefitUser } from '../interfaces/benefit-user.interface';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable( {
  providedIn: 'root'
} )
export class BenefitUserService {

  apiBaseUrl = environment.apiBaseUrl;
  token = localStorage.getItem( 'token' );

  constructor ( private http: HttpClient ) { }

  public index ( id: number, year: number ): Observable<BenefitUser[]> {
    const headers = new HttpHeaders()
      .set( 'Accept', 'application/json' )
      .set( 'Authorization', `Bearer ${ localStorage.getItem( 'token' ) }` );

    return this.http.get<BenefitUser[]>( `${ this.apiBaseUrl }/benefituser?userId=${ id }&year=${ year }`, { headers, withCredentials: true } )
  }

  public show ( id: number ): Observable<BenefitUser> {
    const headers = new HttpHeaders()
      .set( 'Accept', 'application/json' )
      .set( 'Authorization', `Bearer ${ localStorage.getItem( 'token' ) }` );

    return this.http.get<BenefitUser>( `${ this.apiBaseUrl }/benefituser/${ id }`, { headers, withCredentials: true } )
  }

  create ( formValues: any ): Observable<BenefitUser> {
    const headers = new HttpHeaders()
      .set( 'Accept', 'application/json' )
      .set( 'Authorization', `Bearer ${ localStorage.getItem( 'token' ) }` );

    return this.http.post<BenefitUser>( `${ this.apiBaseUrl }/benefituser`, formValues, { headers, withCredentials: true } );
  }

  update ( id: number | undefined, formValues: any ) {
    const headers = new HttpHeaders()
      .set( 'Accept', 'application/json' )
      .set( 'Authorization', `Bearer ${ localStorage.getItem( 'token' ) }` );

    return this.http.put<BenefitUser>( `${ this.apiBaseUrl }/benefituser/${ id }`, formValues, { headers, withCredentials: true } );
  }

  destroy ( id: number ) {
    const headers = new HttpHeaders()
      .set( 'Accept', 'application/json' )
      .set( 'Authorization', `Bearer ${ localStorage.getItem( 'token' ) }` );

    return this.http.delete( `${ this.apiBaseUrl }/benefituser/${ id }`, { headers, withCredentials: true } );
  }

}
