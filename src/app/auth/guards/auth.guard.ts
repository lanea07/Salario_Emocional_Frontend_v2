import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { map, forkJoin, catchError, of } from 'rxjs';

import { AuthService } from '../services/auth.service';

export const authGuard: CanMatchFn = ( route, segments ) => {
  const router = inject( Router );
  const authService = inject( AuthService );
  return forkJoin( {
    requirePassChange: authService.validarRequirePassChange(),
    userData: authService.getUserData()
  } )
    .pipe(
      map( ( { requirePassChange, userData } ) => {
        if ( requirePassChange.data ) {
          // Redirect to the top-level password-change route
          return router.createUrlTree( [ 'auth', 'password-change' ] );
        }
        authService.setUser( userData.data );
        return true;
      } ),
      catchError( err => {
        return of( false );
      } )
    );
};