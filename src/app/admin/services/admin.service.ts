import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BenefitUserElement } from 'src/app/benefit-user/interfaces/benefit-user.interface';
import { environment } from 'src/environments/environment';

@Injectable( {
  providedIn: 'root'
} )
export class AdminService {

  apiBaseUrl = environment.apiBaseUrl;
  token = localStorage.getItem( 'token' );

  constructor (
    private http: HttpClient,
  ) { }

  getAllBenefitUser ( data: any ) {
    let params = this.cleanParams( data );
    const headers = new HttpHeaders()
      .set( 'Accept', 'application/json' )
      .set( 'Authorization', `Bearer ${ localStorage.getItem( 'token' ) }` );

    return this.http.get<BenefitUserElement[]>( `${ this.apiBaseUrl }/admin/getAllBenefitUser`, { params, headers, withCredentials: true } )
  }

  getAllGroupedBenefits ( data: any ) {
    let params = this.cleanParams( data );
    const headers = new HttpHeaders()
      .set( 'Accept', 'application/json' )
      .set( 'Authorization', `Bearer ${ localStorage.getItem( 'token' ) }` );

    return this.http.get<BenefitUserElement[]>( `${ this.apiBaseUrl }/admin/getAllGroupedBenefits`, { params, headers, withCredentials: true } )
  }

  cleanParams ( data: any ): HttpParams {
    const params = new HttpParams( { fromObject: data } );
    const paramsKeysAux = params.keys();
    paramsKeysAux.forEach( ( key ) => {
      const value = params.get( key );
      if ( value === null || value === 'null' || value === undefined || value === '' ) {
        params[ 'map' ].delete( key );
      }
    } );
    return params;
  }
}
