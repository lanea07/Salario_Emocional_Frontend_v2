import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DefaultPreferences, Preference } from '../../shared/interfaces/Preferences.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable( {
  providedIn: 'root'
} )
export class UserPreferencesService {

  constructor (
    private http: HttpClient,
  ) { }

  index (): Observable<DefaultPreferences> {
    return this.http.get<DefaultPreferences>( `/user-preferences`, { withCredentials: true } )
  }

  show ( id: number ): Observable<DefaultPreferences> {
    return this.http.get<DefaultPreferences>( `/user-preferences/${ id }`, { withCredentials: true } )
  }

  update ( id: number, formValues: any ) {
    return this.http.put<any>( `/user-preferences/${ id }`, formValues, { withCredentials: true } );
  }
}
