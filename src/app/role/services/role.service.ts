import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Role, Roles } from 'src/app/role/interfaces/role.interface';
import { DataTablesResponse } from '../../shared/interfaces/DataTablesResponse.interface';

@Injectable( {
  providedIn: 'root'
} )
export class RoleService {

  constructor ( private http: HttpClient ) { }

  index (): Observable<Roles<Role[]>> {
    return this.http.get<Roles<Role[]>>( `/role`, { withCredentials: true } )
  }

  show ( id: number ): Observable<Roles<Role[]>> {
    return this.http.get<Roles<Role[]>>( `/role/${ id }`, { withCredentials: true } )
  }

  create ( formValues: any ): Observable<Roles<Role>> {
    return this.http.post<Roles<Role>>( `/role`, formValues, { withCredentials: true } );
  }

  update ( id: number | undefined, formValues: any ) {
    return this.http.put<Roles<Role>>( `/role/${ id }`, formValues, { withCredentials: true } );
  }

  destroy ( id: number | undefined ) {
    return this.http.delete( `/role/${ id }`, { withCredentials: true } );
  }

  datatable ( datatableParameters: any ): Observable<DataTablesResponse<Role[]>> {
    return this.http.post<DataTablesResponse<Role[]>>( `/role/datatable`, datatableParameters, { withCredentials: true } );
  }
}