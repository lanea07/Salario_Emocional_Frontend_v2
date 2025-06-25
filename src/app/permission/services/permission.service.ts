import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Permission } from 'src/app/permission/interfaces/permission.interface';
import { DataTable } from '../../shared/interfaces/DataTablesResponse.interface';
import { ApiV1Response } from '../../shared/interfaces/ApiV1Response.interface';

@Injectable( {
  providedIn: 'root'
} )
export class PermissionService {

  constructor ( private http: HttpClient ) { }

  index (): Observable<ApiV1Response<Permission[]>> {
    return this.http.get<ApiV1Response<Permission[]>>( `/permission`, { withCredentials: true } )
  }

  show ( id: number ): Observable<ApiV1Response<Permission>> {
    return this.http.get<ApiV1Response<Permission>>( `/permission/${ id }`, { withCredentials: true } )
  }

  create ( formValues: any ): Observable<ApiV1Response<Permission>> {
    return this.http.post<ApiV1Response<Permission>>( `/permission`, formValues, { withCredentials: true } );
  }

  update ( id: number | undefined, formValues: any ) {
    return this.http.put<ApiV1Response<Permission>>( `/permission/update/${ id }`, formValues, { withCredentials: true } );
  }

  destroy ( id: number | undefined ) {
    return this.http.delete( `/permission/${ id }`, { withCredentials: true } );
  }

  datatable ( datatableParameters: any ): Observable<ApiV1Response<DataTable<Permission[]>>> {
    return this.http.post<ApiV1Response<DataTable<Permission[]>>>( `/permission/datatable`, datatableParameters, { withCredentials: true } );
  }
}