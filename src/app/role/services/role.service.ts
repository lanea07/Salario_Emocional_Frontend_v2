import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Role } from 'src/app/role/interfaces/role.interface';
import { ApiV1Response } from '../../shared/interfaces/ApiV1Response.interface';
import { DataTable } from '../../shared/interfaces/DataTablesResponse.interface';

@Injectable( {
  providedIn: 'root'
} )
export class RoleService {

  constructor ( private http: HttpClient ) { }

  index (): Observable<ApiV1Response<Role[]>> {
    return this.http.get<ApiV1Response<Role[]>>( `/role`, { withCredentials: true } )
  }

  show ( id: number ): Observable<ApiV1Response<Role[]>> {
    return this.http.get<ApiV1Response<Role[]>>( `/role/${ id }`, { withCredentials: true } )
  }

  create ( formValues: any ): Observable<ApiV1Response<Role>> {
    return this.http.post<ApiV1Response<Role>>( `/role`, formValues, { withCredentials: true } );
  }

  update ( id: number | undefined, formValues: any ) {
    return this.http.put<ApiV1Response<Role>>( `/role/${ id }`, formValues, { withCredentials: true } );
  }

  destroy ( id: number | undefined ) {
    return this.http.delete( `/role/${ id }`, { withCredentials: true } );
  }

  datatable ( datatableParameters: any ): Observable<ApiV1Response<DataTable<Role[]>>> {
    return this.http.post<ApiV1Response<DataTable<Role[]>>>( `/role/datatable`, datatableParameters, { withCredentials: true } );
  }
}