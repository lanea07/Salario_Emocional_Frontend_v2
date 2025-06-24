import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BenefitUserElement, BenefitUserElements } from 'src/app/benefit-user/interfaces/benefit-user.interface';
import { ApiV1Response } from '../../shared/interfaces/ApiV1Response.interface';

@Injectable( {
  providedIn: 'root'
} )
export class AdminService {

  constructor (
    private http: HttpClient,
  ) { }

  getAllBenefitUser ( data: any ): Observable<BenefitUserElements> {
    let params = this.cleanParams( data );
    return this.http.get<BenefitUserElements>( `/admin/getAllBenefitUser`, { params, withCredentials: true } )
  }

  getAllGroupedBenefits ( data: any ): Observable<ApiV1Response<BenefitUserElement[]>> {
    let params = this.cleanParams( data );
    return this.http.get<ApiV1Response<BenefitUserElement[]>>( `/admin/getAllGroupedBenefits`, { params, withCredentials: true } )
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
