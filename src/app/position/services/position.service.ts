import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Position } from '../interfaces/position.interface';

@Injectable( {
  providedIn: 'root'
} )
export class PositionService {

  apiBaseUrl = environment.apiBaseUrl;

  constructor ( private http: HttpClient ) { }

  index (): Observable<Position[]> {
    return this.http.get<Position[]>( `${ this.apiBaseUrl }/position`, { withCredentials: true } )
  }

  show ( id: number ): Observable<Position> {
    return this.http.get<Position>( `${ this.apiBaseUrl }/position/${ id }`, { withCredentials: true } )
  }

  create ( formValues: any ): Observable<Position> {
    return this.http.post<Position>( `${ this.apiBaseUrl }/position`, formValues, { withCredentials: true } );
  }

  update ( id: number | undefined, formValues: any ) {
    return this.http.put<Position>( `${ this.apiBaseUrl }/position/${ id }`, formValues, { withCredentials: true } );
  }

  destroy ( id: number | undefined ) {
    return this.http.delete( `${ this.apiBaseUrl }/position/${ id }`, { withCredentials: true } );
  }

  datatable ( datatableParameters: any ) {
    return this.http.post( `${ this.apiBaseUrl }/position/datatable`, datatableParameters, { withCredentials: true } );
  }
}
