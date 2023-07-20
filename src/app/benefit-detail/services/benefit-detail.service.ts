import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BenefitDetail } from '../interfaces/benefit-detail.interface';
import { Observable } from 'rxjs';

@Injectable( {
  providedIn: 'root'
} )
export class BenefitDetailService {

  apiBaseUrl = environment.apiBaseUrl;
  token = localStorage.getItem( 'token' );

  constructor ( private http: HttpClient ) { }

  index (): Observable<BenefitDetail[]> {
    const headers = new HttpHeaders()
      .set( 'Accept', 'application/json' )
      .set( 'Authorization', `Bearer ${ this.token }` );

    return this.http.get<BenefitDetail[]>( `${ this.apiBaseUrl }/benefitdetail`, { headers, withCredentials: true } )
  }

  show ( id: number ): Observable<BenefitDetail> {
    const headers = new HttpHeaders()
      .set( 'Accept', 'application/json' )
      .set( 'Authorization', `Bearer ${ this.token }` );

    return this.http.get<BenefitDetail>( `${ this.apiBaseUrl }/benefitdetail/${ id }`, { headers, withCredentials: true } )
  }

  create ( formValues: any ): Observable<BenefitDetail> {
    const headers = new HttpHeaders()
      .set( 'Accept', 'application/json' )
      .set( 'Authorization', `Bearer ${ this.token }` );

    return this.http.post<BenefitDetail>( `${ this.apiBaseUrl }/benefitdetail`, formValues, { headers, withCredentials: true } );
  }

  update ( id: number | undefined, formValues: any ) {
    const headers = new HttpHeaders()
      .set( 'Accept', 'application/json' )
      .set( 'Authorization', `Bearer ${ this.token }` );

    return this.http.put<BenefitDetail>( `${ this.apiBaseUrl }/benefitdetail/${ id }`, formValues, { headers, withCredentials: true } );
  }

  destroy ( id: number | undefined ) {
    const headers = new HttpHeaders()
      .set( 'Accept', 'application/json' )
      .set( 'Authorization', `Bearer ${ this.token }` );

    return this.http.delete( `${ this.apiBaseUrl }/benefitdetail/${ id }`, { headers, withCredentials: true } );
  }

}
