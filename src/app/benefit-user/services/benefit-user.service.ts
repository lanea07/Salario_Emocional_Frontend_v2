import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BenefitUser, BenefitUserElement } from '../interfaces/benefit-user.interface';
import { ApiV1Response } from '../../shared/interfaces/ApiV1Response.interface';
import { DataTable } from '../../shared/interfaces/DataTablesResponse.interface';

@Injectable( {
  providedIn: 'root'
} )
export class BenefitUserService {

  constructor ( private http: HttpClient ) { }

  public index ( id: number, year: number ): Observable<ApiV1Response<BenefitUser[]>> {
    return this.http.get<ApiV1Response<BenefitUser[]>>( `/benefit-user?userId=${ id }&year=${ year }`, { withCredentials: true } )
  }

  public show ( id: number ): Observable<ApiV1Response<BenefitUser[]>> {
    return this.http.get<ApiV1Response<BenefitUser[]>>( `/benefit-user/${ id }`, { withCredentials: true } )
  }

  public create ( formValues: any ): Observable<ApiV1Response<BenefitUser[]>> {
    return this.http.post<ApiV1Response<BenefitUser[]>>( `/benefit-user`, formValues, { withCredentials: true } );
  }

  public update ( id: number | undefined, formValues: any ) {
    return this.http.put<ApiV1Response<BenefitUser[]>>( `/benefit-user/${ id }`, formValues, { withCredentials: true } );
  }

  public destroy ( id: number ) {
    return this.http.delete( `/benefit-user/${ id }`, { withCredentials: true } );
  }

  public downloadReport ( formValues: any ) {
    return this.http.post( `/benefit-user/exportbenefits`, formValues, { withCredentials: true } );
  }

  public indexNonApproved ( id: number ): Observable<ApiV1Response<DataTable<BenefitUser[]>>> {
    return this.http.get<ApiV1Response<DataTable<BenefitUser[]>>>( `/benefit-user/indexnonapproved?userId=${ id }`, { withCredentials: true } )
  }

  public indexCollaboratorsNonApproved (): Observable<ApiV1Response<DataTable<BenefitUserElement[]>>>{
    return this.http.get<ApiV1Response<DataTable<BenefitUserElement[]>>>( `/benefit-user/indexcollaboratorsnonapproved`, { withCredentials: true } )
  }

  public indexCollaborators ( year: number, benefit_id?: number ) {
    let params = this.cleanParams( { year, benefit_id } )
    return this.http.get<ApiV1Response<BenefitUser[]>>( `/benefit-user/indexcollaborators`, { params, withCredentials: true } )
  }

  public decideBenefitUser ( formValues: any ) {
    return this.http.post<any>( `/benefit-user/decidebenefituser`, formValues, { withCredentials: true } )
  }

  public showByUserID ( user_id: number, year: number ) {
    return this.http.get<ApiV1Response<BenefitUser[]>>( `/benefit-user/${ user_id }/${ year }`, { withCredentials: true } )
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
