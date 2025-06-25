import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiV1Response } from '../../shared/interfaces/ApiV1Response.interface';
import { DataTable } from '../../shared/interfaces/DataTablesResponse.interface';
import { BenefitDetail } from '../interfaces/benefit-detail.interface';

@Injectable( {
  providedIn: 'root'
} )
export class BenefitDetailService {

  constructor ( private http: HttpClient ) { }

  index (): Observable<ApiV1Response<BenefitDetail[]>> {
    return this.http.get<ApiV1Response<BenefitDetail[]>>( `/benefit-detail`, { withCredentials: true } )
  }

  show ( id: number ): Observable<ApiV1Response<BenefitDetail[]>> {
    return this.http.get<ApiV1Response<BenefitDetail[]>>( `/benefit-detail/${ id }`, { withCredentials: true } )
  }

  create ( formValues: any ): Observable<ApiV1Response<BenefitDetail>> {
    return this.http.post<ApiV1Response<BenefitDetail>>( `/benefit-detail`, formValues, { withCredentials: true } );
  }

  update ( id: number | undefined, formValues: any ) {
    return this.http.put<ApiV1Response<BenefitDetail[]>>( `/benefit-detail/${ id }`, formValues, { withCredentials: true } );
  }

  destroy ( id: number | undefined ) {
    return this.http.delete( `/benefit-detail/${ id }`, { withCredentials: true } );
  }

  datatable ( datatableParameters: any ): Observable<ApiV1Response<DataTable<BenefitDetail[]>>> {
    return this.http.post<ApiV1Response<DataTable<BenefitDetail[]>>>( `/benefit-detail/datatable`, datatableParameters, { withCredentials: true } );
  }
}
