import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { User } from '../interfaces/user.interface';
import { ApiV1Response } from '../../shared/interfaces/ApiV1Response.interface';
import { DataTable } from '../../shared/interfaces/DataTablesResponse.interface';

@Injectable( {
  providedIn: 'root'
} )
export class UserService {

  constructor ( private http: HttpClient ) { }

  index (): Observable<ApiV1Response<User[]>> {
    return this.http.get<ApiV1Response<User[]>>( `/user`, { withCredentials: true } )
  }

  show ( id: number ): Observable<ApiV1Response<User[]>> {
    return this.http.get<ApiV1Response<User[]>>( `/user/${ id }`, { withCredentials: true } )
  }

  create ( formValues: any ): Observable<ApiV1Response<User[]>> {
    return this.http.post<ApiV1Response<User[]>>( `/user`, formValues, { withCredentials: true } );
  }

  update ( id: number | undefined, formValues: any ) {
    return this.http.put<ApiV1Response<User[]>>( `/user/${ id }`, formValues, { withCredentials: true } );
  }

  destroy ( id: number | undefined ) {
    return this.http.delete( `/user/${ id }`, { withCredentials: true } );
  }

  userDescendants (): Observable<ApiV1Response<User[]>> {
    return this.http.get<ApiV1Response<User[]>>( `/user/user-descendants`, { withCredentials: true } )
  }

  datatable ( datatableParameters: any ): Observable<ApiV1Response<DataTable<User[]>>> {
    return this.http.post<ApiV1Response<DataTable<User[]>>>( `/user/datatable`, datatableParameters, { withCredentials: true } );
  }
}