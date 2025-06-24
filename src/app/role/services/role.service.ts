import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Roles } from 'src/app/role/interfaces/role.interface';

@Injectable( {
  providedIn: 'root'
} )
export class RoleService {

  constructor ( private http: HttpClient ) { }

  index (): Observable<Roles> {
    return this.http.get<Roles>( `/role`, { withCredentials: true } )
  }

  show ( id: number ): Observable<Roles> {
    return this.http.get<Roles>( `/role/${ id }`, { withCredentials: true } )
  }

  create ( formValues: any ): Observable<Roles> {
    return this.http.post<Roles>( `/role`, formValues, { withCredentials: true } );
  }

  update ( id: number | undefined, formValues: any ) {
    return this.http.put<Roles>( `/role/${ id }`, formValues, { withCredentials: true } );
  }

  destroy ( id: number | undefined ) {
    return this.http.delete( `/role/${ id }`, { withCredentials: true } );
  }

  datatable ( datatableParameters: any ) {
    return this.http.post( `/role/datatable`, datatableParameters, { withCredentials: true } );
  }
}