import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Position, Positions } from '../interfaces/position.interface';
import { DataTablesResponse } from '../../shared/interfaces/DataTablesResponse.interface';

@Injectable( {
  providedIn: 'root'
} )
export class PositionService {

  constructor ( private http: HttpClient ) { }

  index (): Observable<Positions> {
    return this.http.get<Positions>( `/position`, { withCredentials: true } )
  }

  show ( id: number ): Observable<Positions> {
    return this.http.get<Positions>( `/position/${ id }`, { withCredentials: true } )
  }

  create ( formValues: any ): Observable<Positions> {
    return this.http.post<Positions>( `/position`, formValues, { withCredentials: true } );
  }

  update ( id: number | undefined, formValues: any ) {
    return this.http.put<Positions>( `/position/${ id }`, formValues, { withCredentials: true } );
  }

  destroy ( id: number | undefined ) {
    return this.http.delete( `/position/${ id }`, { withCredentials: true } );
  }

  datatable ( datatableParameters: any ): Observable<DataTablesResponse<Position[]>>{
    return this.http.post<DataTablesResponse<Position[]>>( `/position/datatable`, datatableParameters, { withCredentials: true } );
  }
}
