import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiV1Response } from '../../shared/interfaces/ApiV1Response.interface';
import { BenefitDetail, BenefitDetails } from '../interfaces/benefit-detail.interface';
import { DataTablesResponse } from '../../shared/interfaces/DataTablesResponse.interface';

@Injectable( {
  providedIn: 'root'
} )
export class BenefitDetailService {

  constructor ( private http: HttpClient ) { }

  index (): Observable<BenefitDetails> {
    return this.http.get<BenefitDetails>( `/benefit-detail`, { withCredentials: true } )
  }

  show ( id: number ): Observable<BenefitDetails> {
    return this.http.get<BenefitDetails>( `/benefit-detail/${ id }`, { withCredentials: true } )
  }

  create ( formValues: any ): Observable<BenefitDetails> {
    return this.http.post<BenefitDetails>( `/benefit-detail`, formValues, { withCredentials: true } );
  }

  update ( id: number | undefined, formValues: any ) {
    return this.http.put<BenefitDetails>( `/benefit-detail/${ id }`, formValues, { withCredentials: true } );
  }

  destroy ( id: number | undefined ) {
    return this.http.delete( `/benefit-detail/${ id }`, { withCredentials: true } );
  }

  datatable ( datatableParameters: any ): Observable<DataTablesResponse<BenefitDetail[]>> {
    return this.http.post<DataTablesResponse<BenefitDetail[]>>( `/benefit-detail/datatable`, datatableParameters, { withCredentials: true } );
  }
}
