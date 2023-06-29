import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BenefitUser } from '../interfaces/benefit-user.interface';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';

@Injectable( {
    providedIn: 'root'
} )
export class BenefitUserService {

    apiBaseUrl = environment.apiBaseUrl;
    token = localStorage.getItem( 'token' );

    constructor ( private http: HttpClient ) { }

    public index ( id: number, year: number ): Observable<BenefitUser[]> {
        const headers = new HttpHeaders()
            .set( 'Accept', 'application/json' )
            .set( 'Authorization', `Bearer ${ this.token }` );

        return this.http.get<BenefitUser[]>( `${ this.apiBaseUrl }/benefituser?userId=${ id }&year=${ year }`, { headers, withCredentials: true } )
    }

    public show ( id: number, year: number ): Observable<BenefitUser[]> {
        const headers = new HttpHeaders()
            .set( 'Accept', 'application/json' )
            .set( 'Authorization', `Bearer ${ this.token }` );

        return this.http.get<BenefitUser[]>( `${ this.apiBaseUrl }/benefituser/${ id }?year=${ year }`, { headers, withCredentials: true } )
    }

    create ( formValues: any ): Observable<BenefitUser> {
        const headers = new HttpHeaders()
            .set( 'Accept', 'application/json' )
            .set( 'Authorization', `Bearer ${ this.token }` );

        return this.http.post<BenefitUser>( `${ this.apiBaseUrl }/benefituser`, formValues, { headers, withCredentials: true } );
    }

}
