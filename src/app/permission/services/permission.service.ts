import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Permission, Permissions } from 'src/app/permission/interfaces/permission.interface';
import { DataTablesResponse } from '../../shared/interfaces/DataTablesResponse.interface';

@Injectable( {
  providedIn: 'root'
} )
export class PermissionService {

  constructor ( private http: HttpClient ) { }

  index (): Observable<Permissions<Permission[]>> {
    return this.http.get<Permissions<Permission[]>>( `/permission`, { withCredentials: true } )
  }

  show ( id: number ): Observable<Permissions<Permission>> {
    return this.http.get<Permissions<Permission>>( `/permission/${ id }`, { withCredentials: true } )
  }

  create ( formValues: any ): Observable<Permissions<Permission>> {
    return this.http.post<Permissions<Permission>>( `/permission`, formValues, { withCredentials: true } );
  }

  update ( id: number | undefined, formValues: any ) {
    return this.http.put<Permissions<Permission>>( `/permission/update/${ id }`, formValues, { withCredentials: true } );
  }

  destroy ( id: number | undefined ) {
    return this.http.delete( `/permission/${ id }`, { withCredentials: true } );
  }

  datatable ( datatableParameters: any ): Observable<DataTablesResponse<Permission[]>> {
    return this.http.post<DataTablesResponse<Permission[]>>( `/permission/datatable`, datatableParameters, { withCredentials: true } );
  }
}