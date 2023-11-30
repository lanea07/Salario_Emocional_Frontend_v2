import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dependency } from '../interfaces/dependency.interface';
import { TreeNode } from 'primeng/api';

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

    return this.http.get<Dependency[]>( `${ this.apiBaseUrl }/dependency`, { headers, withCredentials: true } )
  }

  show ( id: number ): Observable<Dependency> {
    const headers = new HttpHeaders()
      .set( 'Accept', 'application/json' )
      .set( 'Authorization', `Bearer ${ localStorage.getItem( 'token' ) }` );

    return this.http.get<Dependency>( `${ this.apiBaseUrl }/dependency/${ id }`, { headers, withCredentials: true } )
  }

  create ( formValues: any ): Observable<Dependency> {
    const headers = new HttpHeaders()
      .set( 'Accept', 'application/json' )
      .set( 'Authorization', `Bearer ${ localStorage.getItem( 'token' ) }` );

    return this.http.post<Dependency>( `${ this.apiBaseUrl }/dependency`, formValues, { headers, withCredentials: true } );
  }

  update ( id: number | undefined, formValues: any ) {
    const headers = new HttpHeaders()
      .set( 'Accept', 'application/json' )
      .set( 'Authorization', `Bearer ${ localStorage.getItem( 'token' ) }` );

    return this.http.put<Dependency>( `${ this.apiBaseUrl }/dependency/${ id }`, formValues, { headers, withCredentials: true } );
  }

  destroy ( id: number | undefined ) {
    const headers = new HttpHeaders()
      .set( 'Accept', 'application/json' )
      .set( 'Authorization', `Bearer ${ localStorage.getItem( 'token' ) }` );

    return this.http.delete( `${ this.apiBaseUrl }/dependency/${ id }`, { headers, withCredentials: true } );
  }

  // Methods for transform the dependencies results

  /**
   * Transforms the dependencies nested array into a tree structure
   * @param Dependency dependency 
   * @returns TreeNode
   */
  public buildDependencyTreeNode ( dependency: Dependency ): TreeNode {
    const { path, name, children } = dependency;
    const simplifiedChildren: TreeNode[] = children!.map( child => this.buildDependencyTreeNode( child ) );
    return { key: path.replace( '.', '-' ), label: name, children: simplifiedChildren };
  }

  /**
   * Takes the input dependencies nested array and returns a level 1 flatted array of dependencies
   * 
   * @param any dependency 
   * @returns Dependency[]
   */
  public flattenDependency ( dependency: any ): Dependency[] {
    let flattened: Dependency[] = [ dependency ];
    if ( dependency.children && dependency.children.length > 0 ) {
      for ( const child of dependency.children ) {
        flattened = flattened.concat( this.flattenDependency( child ) );
      }
    }
    return flattened;
  }

  /**
   * Takes a dependency and transforms it into a TreeNode
   * 
   * @param Dependency dependency 
   * @returns TreeNode
   */
  public makeNode ( dependency: Dependency ): TreeNode {
    const { path, name, children } = dependency;
    const simplifiedChildren: TreeNode[] = children ? children!.map( child => this.makeNode( child ) ) : [];
    return { key: path.replace( '.', '-' ), label: name, children: simplifiedChildren };
  }

}
