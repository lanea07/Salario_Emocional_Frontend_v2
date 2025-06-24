import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { map, forkJoin, catchError, of } from 'rxjs';

import { AuthService } from '../services/auth.service';

export const authGuard: CanMatchFn = ( route, segments ) => {

  const router = inject( Router );
  const authService = inject( AuthService );
  return forkJoin( {
    requirePassChange: authService.validarRequirePassChange(),
    validateJwtToken: authService.validarToken()
  } )
    .pipe(
      map( ( { requirePassChange, validateJwtToken } ) => {
        if ( requirePassChange.data ) {
          return router.createUrlTree( [ 'login', 'password-change' ] )
        }
        if (!validateJwtToken.data) {
          return router.createUrlTree( [ 'login' ] )
        }
        return true;
      } ),
      catchError( err => {
        return of( false )
      } )
    )

};
