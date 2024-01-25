import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { map, forkJoin, catchError, of } from 'rxjs';

import { AuthService } from '../services/auth.service';

export const authGuard: CanMatchFn = ( route, segments ) => {

  const router = inject( Router );
  const authService = inject( AuthService );
  return forkJoin( {
    tokenIsValid: authService.validarToken(),
    requirePassChange: authService.validarRequirePassChange()
  } )
    .pipe(
      map( ( { tokenIsValid, requirePassChange } ) => {
        if ( tokenIsValid && !requirePassChange ) {
          return true;
        }
        if ( tokenIsValid && requirePassChange ) {
          return router.createUrlTree( [ 'login', 'password-change' ] )
        }
        return false;
      } ),
      catchError( err => {
        return of( false )
      } )
    )

};
