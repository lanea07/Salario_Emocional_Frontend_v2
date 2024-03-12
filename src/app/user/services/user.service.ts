import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user.interface';

@Injectable( {
  providedIn: 'root'
} )
export class UserService {

  apiBaseUrl = environment.apiBaseUrl;

  constructor ( private http: HttpClient ) { }

  index (): Observable<User[]> {
    return this.http.get<User[]>( `${ this.apiBaseUrl }/user`, { withCredentials: true } )
  }

  show ( id: number ): Observable<User> {
    return this.http.get<User>( `${ this.apiBaseUrl }/user/${ id }`, { withCredentials: true } )
  }

  create ( formValues: any ): Observable<User> {
    return this.http.post<User>( `${ this.apiBaseUrl }/user`, formValues, { withCredentials: true } );
  }

  update ( id: number | undefined, formValues: any ) {
    return this.http.put<User>( `${ this.apiBaseUrl }/user/${ id }`, formValues, { withCredentials: true } );
  }

  destroy ( id: number | undefined ) {
    return this.http.delete( `${ this.apiBaseUrl }/user/${ id }`, { withCredentials: true } );
  }

  userDescendants () {
    return this.http.get<User[]>( `${ this.apiBaseUrl }/user-descendants`, { withCredentials: true } )
  }

  datatable ( datatableParameters: any ) {
    return this.http.post( `${ this.apiBaseUrl }/user/datatable`, datatableParameters, { withCredentials: true } );
  }
}