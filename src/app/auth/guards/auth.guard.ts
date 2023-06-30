import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, tap } from 'rxjs';

export const authGuard: CanMatchFn = ( route, segments ) => {
  const router = inject( Router );
  let tokenValid!: boolean;
  inject( AuthService ).validarToken()
    .pipe(
      map( tokenIsValid => tokenValid = tokenIsValid! )
    )
    .subscribe( resp => {
      if ( tokenValid && route.path === 'login' ) {
        return router.createUrlTree( [ 'benefit-employee' ] );
      } else if ( tokenValid ) {
        return true;
      }
      return router.createUrlTree( [ 'login' ] );
    } );
  return tokenValid;

};
