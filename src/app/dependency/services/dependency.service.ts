import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TreeNode } from 'primeng/api';

import { Dependencies, Dependency } from '../interfaces/dependency.interface';
import { DataTablesResponse } from '../../shared/interfaces/DataTablesResponse.interface';
import { Position } from '../../position/interfaces/position.interface';

@Injectable( {
  providedIn: 'root'
} )
export class DependencyService {

  constructor ( private http: HttpClient ) { }

  index (): Observable<Dependencies> {
    return this.http.get<Dependencies>( `/dependency`, { withCredentials: true } )
  }

  show ( id: number ): Observable<Dependencies> {
    return this.http.get<Dependencies>( `/dependency/${ id }`, { withCredentials: true } )
  }

  create ( formValues: any ): Observable<Dependencies> {
    return this.http.post<Dependencies>( `/dependency`, formValues, { withCredentials: true } );
  }

  update ( id: number | undefined, formValues: any ) {
    return this.http.put<Dependencies>( `/dependency/${ id }`, formValues, { withCredentials: true } );
  }

  destroy ( id: number | undefined ) {
    return this.http.delete( `/dependency/${ id }`, { withCredentials: true } );
  }

  getNonTreeValidDependencies (): Observable<Dependencies> {
    return this.http.get<Dependencies>( `/dependency/getNonTreeValidDependencies`, { withCredentials: true } )
  }

  datatable ( dataTablesParameters: any ): Observable<DataTablesResponse<Dependency[]>> {
    return this.http.post<DataTablesResponse<Dependency[]>>( `/dependency/datatable`, dataTablesParameters, { withCredentials: true } );
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
  public dependencyAncestors ( id: any ): Observable<Dependencies> {
    return this.http.get<Dependencies>( `/dependency/dependencyAncestors/${ id }`, { withCredentials: true } )
  }

  /**
 * Takes a dependency and transforms it into a TreeNode
 * 
 * @param Dependency dependency 
 * @returns TreeNode
 */
  public makeNode ( dependency: Dependency ): TreeNode {
    if(!dependency) return {};
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
