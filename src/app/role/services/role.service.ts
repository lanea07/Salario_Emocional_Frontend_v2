import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Role } from 'src/app/role/interfaces/role.interface';
import { Permission } from '../../permission/interfaces/permission.interface';
import { ApiV1Response } from '../../shared/interfaces/ApiV1Response.interface';
import { DataTable } from '../../shared/interfaces/DataTablesResponse.interface';

@Injectable( {
  providedIn: 'root'
} )
export class RoleService {

  constructor ( private http: HttpClient ) { }

  public index (): Observable<ApiV1Response<Role[]>> {
    return this.http.get<ApiV1Response<Role[]>>( `/role`, { withCredentials: true } )
  }

  public show ( id: number ): Observable<ApiV1Response<Role[]>> {
    return this.http.get<ApiV1Response<Role[]>>( `/role/${ id }`, { withCredentials: true } )
  }

  public create ( formValues: any ): Observable<ApiV1Response<Role>> {
    return this.http.post<ApiV1Response<Role>>( `/role`, formValues, { withCredentials: true } );
  }

  public update ( id: number | undefined, formValues: any ): Observable<ApiV1Response<Role>> {
    return this.http.put<ApiV1Response<Role>>( `/role/${ id }`, formValues, { withCredentials: true } );
  }

  public destroy ( id: number | undefined ): Observable<ApiV1Response<Role>> {
    return this.http.delete<ApiV1Response<Role>>( `/role/${ id }`, { withCredentials: true } );
  }

  public datatable ( datatableParameters: any ): Observable<ApiV1Response<DataTable<Role[]>>> {
    return this.http.post<ApiV1Response<DataTable<Role[]>>>( `/role/datatable`, datatableParameters, { withCredentials: true } );
  }

  public updateRolePermissions ( roleId: number, permissions: Permission[] ): Observable<ApiV1Response<Role>> {
    return this.http.put<ApiV1Response<Role>>( `/role/updateRolePermissions/${ roleId }`, { permissions } );
  }
}