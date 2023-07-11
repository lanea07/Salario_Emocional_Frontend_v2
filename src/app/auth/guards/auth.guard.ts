import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, of, tap } from 'rxjs';

export const authGuard: CanMatchFn = ( route, segments ) => {
  // const router = inject( Router );
  // let tokenValid!: boolean;
  // inject( AuthService ).validarToken()
  //   .pipe(
  //     map( tokenIsValid => tokenValid = tokenIsValid! )
  //   )
  //   .subscribe( resp => {
  //     if ( tokenValid && route.path === 'login' ) {
  //       return router.createUrlTree( [ 'benefit-employee' ] );
  //     } else if ( tokenValid ) {
  //       return true;
  //     }
  //     return router.createUrlTree( [ 'login' ] );
  //   } );
  //   console.log(tokenValid);
  // return tokenValid ? tokenValid : router.createUrlTree( [ 'login' ] );
  const router = inject( Router );
  const authService = inject( AuthService );
  return authService.validarToken().pipe(
    tap( {
      next: ( resp ) => resp ? resp : of( false )
    } )
  )

};
