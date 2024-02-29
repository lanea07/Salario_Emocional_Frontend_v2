import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { BenefitDetail } from '../interfaces/benefit-detail.interface';

@Injectable( {
  providedIn: 'root'
} )
export class BenefitDetailService {

  apiBaseUrl = environment.apiBaseUrl;

  constructor ( private http: HttpClient ) { }

  index (): Observable<BenefitDetail[]> {
    return this.http.get<BenefitDetail[]>( `${ this.apiBaseUrl }/benefitdetail`, { withCredentials: true } )
  }

  show ( id: number ): Observable<BenefitDetail> {
    return this.http.get<BenefitDetail>( `${ this.apiBaseUrl }/benefitdetail/${ id }`, { withCredentials: true } )
  }

  create ( formValues: any ): Observable<BenefitDetail> {
    return this.http.post<BenefitDetail>( `${ this.apiBaseUrl }/benefitdetail`, formValues, { withCredentials: true } );
  }

  update ( id: number | undefined, formValues: any ) {
    return this.http.put<BenefitDetail>( `${ this.apiBaseUrl }/benefitdetail/${ id }`, formValues, { withCredentials: true } );
  }

  destroy ( id: number | undefined ) {
    return this.http.delete( `${ this.apiBaseUrl }/benefitdetail/${ id }`, { withCredentials: true } );
  }
}
