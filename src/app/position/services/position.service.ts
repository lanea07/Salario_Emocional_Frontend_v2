import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Position } from '../interfaces/position.interface';
import { ApiV1Response } from '../../shared/interfaces/ApiV1Response.interface';
import { DataTable } from '../../shared/interfaces/DataTablesResponse.interface';

@Injectable( {
  providedIn: 'root'
} )
export class PositionService {

  constructor ( private http: HttpClient ) { }

  index (): Observable<ApiV1Response<Position[]>> {
    return this.http.get<ApiV1Response<Position[]>>( `/position`, { withCredentials: true } )
  }

  show ( id: number ): Observable<ApiV1Response<Position>> {
    return this.http.get<ApiV1Response<Position>>( `/position/${ id }`, { withCredentials: true } )
  }

  create ( formValues: any ): Observable<ApiV1Response<Position>> {
    return this.http.post<ApiV1Response<Position>>( `/position`, formValues, { withCredentials: true } );
  }

  update ( id: number | undefined, formValues: any ) {
    return this.http.put<ApiV1Response<Position>>( `/position/${ id }`, formValues, { withCredentials: true } );
  }

  destroy ( id: number | undefined ) {
    return this.http.delete( `/position/${ id }`, { withCredentials: true } );
  }

  datatable ( datatableParameters: any ): Observable<ApiV1Response<DataTable<Position[]>>>{
    return this.http.post<ApiV1Response<DataTable<Position[]>>>( `/position/datatable`, datatableParameters, { withCredentials: true } );
  }
}
