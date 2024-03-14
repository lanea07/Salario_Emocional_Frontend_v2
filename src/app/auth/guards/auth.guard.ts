import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { map, forkJoin, catchError, of } from 'rxjs';

import { AuthService } from '../services/auth.service';

export const authGuard: CanMatchFn = ( route, segments ) => {

  const router = inject( Router );
  const authService = inject( AuthService );
  return forkJoin( {
    requirePassChange: authService.validarRequirePassChange()
  } )
    .pipe(
      map( ( { requirePassChange } ) => {
        if ( requirePassChange ) {
          return router.createUrlTree( [ 'login', 'password-change' ] )
        }
        return true;
      } ),
      catchError( err => {
        return of( false )
      } )
    )

};
