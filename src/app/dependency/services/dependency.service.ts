import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dependency } from '../interfaces/dependency.interface';
import { TreeNode } from '../interfaces/TreeNode';

@Injectable( {
  providedIn: 'root'
} )
export class DependencyService {

  apiBaseUrl = environment.apiBaseUrl;
  token = localStorage.getItem( 'token' );

  constructor ( private http: HttpClient ) {

  }

  index (): Observable<Dependency[]> {
    const headers = new HttpHeaders()
      .set( 'Accept', 'application/json' )
      .set( 'Authorization', `Bearer ${ localStorage.getItem( 'token' ) }` );

    return this.http.get<Dependency[]>( `${ this.apiBaseUrl }/dependencies`, { headers, withCredentials: true } )
  }

  show ( id: number ): Observable<Dependency> {
    const headers = new HttpHeaders()
      .set( 'Accept', 'application/json' )
      .set( 'Authorization', `Bearer ${ localStorage.getItem( 'token' ) }` );

    return this.http.get<Dependency>( `${ this.apiBaseUrl }/dependencies/${ id }`, { headers, withCredentials: true } )
  }

  create ( formValues: any ): Observable<Dependency> {
    const headers = new HttpHeaders()
      .set( 'Accept', 'application/json' )
      .set( 'Authorization', `Bearer ${ localStorage.getItem( 'token' ) }` );

    return this.http.post<Dependency>( `${ this.apiBaseUrl }/dependencies`, formValues, { headers, withCredentials: true } );
  }

  update ( id: number | undefined, formValues: any ) {
    const headers = new HttpHeaders()
      .set( 'Accept', 'application/json' )
      .set( 'Authorization', `Bearer ${ localStorage.getItem( 'token' ) }` );

    return this.http.put<Dependency>( `${ this.apiBaseUrl }/dependencies/${ id }`, formValues, { headers, withCredentials: true } );
  }

  destroy ( id: number | undefined ) {
    const headers = new HttpHeaders()
      .set( 'Accept', 'application/json' )
      .set( 'Authorization', `Bearer ${ localStorage.getItem( 'token' ) }` );

    return this.http.delete( `${ this.apiBaseUrl }/dependencies/${ id }`, { headers, withCredentials: true } );
  }

  simplifyDependency ( original: Dependency ): TreeNode {
    const { id, name, children } = original;
    const simplifiedChildren: TreeNode[] = children!.map( child => this.simplifyDependency( child ) );

    return { id, name, children: simplifiedChildren };
  }

  flattenDependency ( dependency: any ): Dependency[] {
    let flattened: Dependency[] = [ dependency ];

    if ( dependency.children && dependency.children.length > 0 ) {
      for ( const child of dependency.children ) {
        flattened = flattened.concat( this.flattenDependency( child ) );
      }
    }
    delete dependency.children;

    return flattened;
  }

}
