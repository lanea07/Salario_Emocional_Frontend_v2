import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { forkJoin, map } from 'rxjs';

import { AuthService } from '../services/auth.service';

export const loginGuard: CanMatchFn = ( route, segments ) => {
  const authService = inject( AuthService );
  const router = inject( Router );
  return forkJoin( {
    validarToken: authService.validarToken(),
    requirePassChange: authService.validarRequirePassChange(),
  } )
    .pipe(
      map( ( { validarToken, requirePassChange } ) => {
        if ( !validarToken.data ) {
          return true;
        }
        if ( requirePassChange.data ) {
          // Redirect to the top-level password-change route
          return router.createUrlTree( [ 'auth', 'password-change' ] );
        }
        return router.createUrlTree( [ 'basic' ] );
      } )
    );
};