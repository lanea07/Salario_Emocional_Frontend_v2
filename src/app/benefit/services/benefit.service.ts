import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiV1Response } from '../../shared/interfaces/ApiV1Response.interface';
import { Benefit } from '../interfaces/benefit.interface';
import { DefaultPreference } from '../../shared/interfaces/Preferences.interface';
import { DataTable } from '../../shared/interfaces/DataTablesResponse.interface';

@Injectable( {
  providedIn: 'root'
} )
export class BenefitService {

  constructor ( private http: HttpClient ) { }

  index (): Observable<ApiV1Response<Benefit[]>> {
    return this.http.get<ApiV1Response<Benefit[]>>( `/benefit`, { withCredentials: true } )
  }

  show ( id: number ): Observable<ApiV1Response<Benefit[]>> {
    return this.http.get<ApiV1Response<Benefit[]>>( `/benefit/${ id }`, { withCredentials: true } )
  }

  create ( formValues: any ): Observable<ApiV1Response<Benefit[]>> {
    return this.http.post<ApiV1Response<Benefit[]>>( `/benefit/save`, formValues, { withCredentials: true } );
  }

  update ( id: number | undefined, formValues: any ) {
    return this.http.post<Benefit>( `/benefit/update/${ id }`, formValues, { withCredentials: true } );
  }

  destroy ( id: number | undefined ) {
    return this.http.delete( `/${ id }`, { withCredentials: true } );
  }

  indexAvailable (): Observable<ApiV1Response<Benefit[]>> {
    return this.http.get<ApiV1Response<Benefit[]>>( `/benefit/available`, { withCredentials: true } )
  }

  indexSettings (): Observable<ApiV1Response<DefaultPreference[]>> {
    return this.http.get<ApiV1Response<DefaultPreference[]>>( `/benefit/benefit-settings`, { withCredentials: true } )
  }

  showSettings ( id: number ): Observable<ApiV1Response<DefaultPreference[]>> {
    return this.http.get<ApiV1Response<DefaultPreference[]>>( `/benefit/benefit-settings/${ id }`, { withCredentials: true } )
  }

  updateSettings ( id: number, formValues: any ) {
    return this.http.put<any>( `/benefit/benefit-settings/${ id }`, formValues, { withCredentials: true } );
  }

  datatable ( dataTablesParameters: any ): Observable<ApiV1Response<DataTable<Benefit[]>>> {
    return this.http.post<ApiV1Response<DataTable<Benefit[]>>>( `/benefit/datatable`, dataTablesParameters, { withCredentials: true } )
  }
}
