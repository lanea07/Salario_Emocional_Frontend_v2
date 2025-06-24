import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Benefit, Benefits } from '../interfaces/benefit.interface';
import { DefaultPreferences } from 'src/app/shared/interfaces/Preferences.interface';
import { ApiV1Response } from '../../shared/interfaces/ApiV1Response.interface';
import { DataTablesResponse } from '../../shared/interfaces/DataTablesResponse.interface';

@Injectable( {
  providedIn: 'root'
} )
export class BenefitService {

  constructor ( private http: HttpClient ) { }

  index (): Observable<Benefits> {
    return this.http.get<Benefits>( `/benefit`, { withCredentials: true } )
  }

  show ( id: number ): Observable<Benefits> {
    return this.http.get<Benefits>( `/benefit/${ id }`, { withCredentials: true } )
  }

  create ( formValues: any ): Observable<Benefits> {
    return this.http.post<Benefits>( `/benefit/save`, formValues, { withCredentials: true } );
  }

  update ( id: number | undefined, formValues: any ) {
    return this.http.post<Benefit>( `/benefit/update/${ id }`, formValues, { withCredentials: true } );
  }

  destroy ( id: number | undefined ) {
    return this.http.delete( `/${ id }`, { withCredentials: true } );
  }

  indexAvailable (): Observable<Benefits> {
    return this.http.get<Benefits>( `/benefit/available`, { withCredentials: true } )
  }

  indexSettings (): Observable<ApiV1Response<DefaultPreferences>> {
    return this.http.get<ApiV1Response<DefaultPreferences>>( `/benefit/benefit-settings`, { withCredentials: true } )
  }

  showSettings ( id: number ): Observable<DefaultPreferences> {
    return this.http.get<DefaultPreferences>( `/benefit/benefit-settings/${ id }`, { withCredentials: true } )
  }

  updateSettings ( id: number, formValues: any ) {
    return this.http.put<any>( `/benefit/benefit-settings/${ id }`, formValues, { withCredentials: true } );
  }

  datatable ( dataTablesParameters: any ): Observable<DataTablesResponse<Benefit[]>> {
    return this.http.post<DataTablesResponse<Benefit[]>>( `/benefit/datatable`, dataTablesParameters, { withCredentials: true } )
  }
}
