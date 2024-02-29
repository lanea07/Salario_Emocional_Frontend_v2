import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TreeNode } from 'primeng/api';

import { environment } from 'src/environments/environment';
import { Dependency } from '../interfaces/dependency.interface';

@Injectable( {
  providedIn: 'root'
} )
export class DependencyService {

  apiBaseUrl = environment.apiBaseUrl;

  constructor ( private http: HttpClient ) { }

  index (): Observable<Dependency[]> {
    return this.http.get<Dependency[]>( `${ this.apiBaseUrl }/dependency`, { withCredentials: true } )
  }

  show ( id: number ): Observable<Dependency> {
    return this.http.get<Dependency>( `${ this.apiBaseUrl }/dependency/${ id }`, { withCredentials: true } )
  }

  create ( formValues: any ): Observable<Dependency> {
    return this.http.post<Dependency>( `${ this.apiBaseUrl }/dependency`, formValues, { withCredentials: true } );
  }

  update ( id: number | undefined, formValues: any ) {
    return this.http.put<Dependency>( `${ this.apiBaseUrl }/dependency/${ id }`, formValues, { withCredentials: true } );
  }

  destroy ( id: number | undefined ) {
    return this.http.delete( `${ this.apiBaseUrl }/dependency/${ id }`, { withCredentials: true } );
  }

  getNonTreeValidDependencies (): Observable<Dependency[]> {
    return this.http.get<Dependency[]>( `${ this.apiBaseUrl }/dependency/getNonTreeValidDependencies`, { withCredentials: true } )
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
    return {
      key: path,
      label: name,
      children: simplifiedChildren,
      expanded: true,
    };
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
   * Returns all parent dependencies of the current logged-in user's dependency
   * 
   * @returns Dependency[]
   */
  public dependencyAncestors ( id: any ): Observable<Dependency[]> {
    return this.http.get<Dependency[]>( `${ this.apiBaseUrl }/dependency/dependencyAncestors/${ id }`, { withCredentials: true } )
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
    return {
      key: path.replace( '.', '-' ),
      label: name,
      children: simplifiedChildren,
      expanded: true,
    };
  }
}
