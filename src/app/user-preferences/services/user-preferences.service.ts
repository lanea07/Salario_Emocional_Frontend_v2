import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { DefaultPreference, Preference } from '../../shared/interfaces/Preferences.interface';
import { ApiV1Response } from '../../shared/interfaces/ApiV1Response.interface';

@Injectable( {
  providedIn: 'root'
} )
export class UserPreferencesService {

  constructor (
    private http: HttpClient,
  ) { }

  index (): Observable<ApiV1Response<DefaultPreference[]>> {
    return this.http.get<ApiV1Response<DefaultPreference[]>>( `/user-preferences`, { withCredentials: true } )
  }

  show ( id: number ): Observable<ApiV1Response<DefaultPreference[]>> {
    return this.http.get<ApiV1Response<DefaultPreference[]>>( `/user-preferences/${ id }`, { withCredentials: true } )
  }

  update ( id: number, formValues: any ) {
    return this.http.put<any>( `/user-preferences/${ id }`, formValues, { withCredentials: true } );
  }
}
