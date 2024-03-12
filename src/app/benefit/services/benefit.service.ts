import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Benefit } from '../interfaces/benefit.interface';
import { DefaultPreferences } from 'src/app/shared/interfaces/Preferences.interface';

@Injectable( {
  providedIn: 'root'
} )
export class BenefitService {

  apiBaseUrl = environment.apiBaseUrl;
  baseUrl = environment.baseUrl

  constructor ( private http: HttpClient ) { }

  index (): Observable<Benefit[]> {
    return this.http.get<Benefit[]>( `${ this.apiBaseUrl }/benefit`, { withCredentials: true } )
  }

  show ( id: number ): Observable<Benefit> {
    return this.http.get<Benefit>( `${ this.apiBaseUrl }/benefit/${ id }`, { withCredentials: true } )
  }

  create ( formValues: any ): Observable<Benefit> {
    return this.http.post<Benefit>( `${ this.apiBaseUrl }/benefit`, formValues, { withCredentials: true } );
  }

  update ( id: number | undefined, formValues: any ) {
    return this.http.post<Benefit>( `${ this.apiBaseUrl }/benefit/${ id }`, formValues, { withCredentials: true } );
  }

  destroy ( id: number | undefined ) {
    return this.http.delete( `${ this.apiBaseUrl }/benefit/${ id }`, { withCredentials: true } );
  }

  indexAvailable (): Observable<Benefit[]> {
    return this.http.get<Benefit[]>( `${ this.apiBaseUrl }/benefit/available`, { withCredentials: true } )
  }

  indexSettings (): Observable<DefaultPreferences[]> {
    return this.http.get<DefaultPreferences[]>( `${ this.apiBaseUrl }/benefit-settings`, { withCredentials: true } )
  }

  showSettings ( id: number ): Observable<DefaultPreferences> {
    return this.http.get<DefaultPreferences>( `${ this.apiBaseUrl }/benefit-settings/${ id }`, { withCredentials: true } )
  }

  updateSettings ( id: number, formValues: any ) {
    return this.http.put<any>( `${ this.apiBaseUrl }/benefit-settings/${ id }`, formValues, { withCredentials: true } );
  }

  datatable ( dataTablesParameters: any ) {
    return this.http.post( `${ this.apiBaseUrl }/benefit/datatable`, dataTablesParameters, { withCredentials: true } )
  }
}
