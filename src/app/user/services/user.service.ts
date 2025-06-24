import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { User, Users } from '../interfaces/user.interface';
import { ApiV1Response } from '../../shared/interfaces/ApiV1Response.interface';
import { DataTablesResponse } from '../../shared/interfaces/DataTablesResponse.interface';

@Injectable( {
  providedIn: 'root'
} )
export class UserService {

  constructor ( private http: HttpClient ) { }

  index (): Observable<Users> {
    return this.http.get<Users>( `/user`, { withCredentials: true } )
  }

  show ( id: number ): Observable<Users> {
    return this.http.get<Users>( `/user/${ id }`, { withCredentials: true } )
  }

  create ( formValues: any ): Observable<Users> {
    return this.http.post<Users>( `/user`, formValues, { withCredentials: true } );
  }

  update ( id: number | undefined, formValues: any ) {
    return this.http.put<Users>( `/user/${ id }`, formValues, { withCredentials: true } );
  }

  destroy ( id: number | undefined ) {
    return this.http.delete( `/user/${ id }`, { withCredentials: true } );
  }

  userDescendants (): Observable<Users> {
    return this.http.get<Users>( `/user/user-descendants`, { withCredentials: true } )
  }

  datatable ( datatableParameters: any ): Observable<DataTablesResponse<User[]>> {
    return this.http.post<DataTablesResponse<User[]>>( `/user/datatable`, datatableParameters, { withCredentials: true } );
  }
}