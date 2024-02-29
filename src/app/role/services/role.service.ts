import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Role } from 'src/app/role/interfaces/role.interface';
import { environment } from 'src/environments/environment';

@Injectable( {
  providedIn: 'root'
} )
export class RoleService {

  apiBaseUrl = environment.apiBaseUrl;

  constructor ( private http: HttpClient ) { }

  index (): Observable<Role[]> {
    return this.http.get<Role[]>( `${ this.apiBaseUrl }/role`, { withCredentials: true } )
  }

  show ( id: number ): Observable<Role> {
    return this.http.get<Role>( `${ this.apiBaseUrl }/role/${ id }`, { withCredentials: true } )
  }

  create ( formValues: any ): Observable<Role> {
    return this.http.post<Role>( `${ this.apiBaseUrl }/role`, formValues, { withCredentials: true } );
  }

  update ( id: number | undefined, formValues: any ) {
    return this.http.put<Role>( `${ this.apiBaseUrl }/role/${ id }`, formValues, { withCredentials: true } );
  }

  destroy ( id: number | undefined ) {
    return this.http.delete( `${ this.apiBaseUrl }/role/${ id }`, { withCredentials: true } );
  }
}