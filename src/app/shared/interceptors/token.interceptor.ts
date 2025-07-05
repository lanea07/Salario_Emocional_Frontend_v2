import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';

import { MessageService } from 'primeng/api';
import { AuthService } from '../../auth/services/auth.service';

export const httpInterceptor: HttpInterceptorFn = ( req: HttpRequest<unknown>, next: HttpHandlerFn ) => {
  const ms = inject( MessageService );
  const router = inject( Router );
  const authService = inject( AuthService );
  const token = authService.getuser()?.token;
  const version = 'v1';
  const lang = 'es';

  // Prepend /api to all relative URLs that are not external and don't already start with /api
  let apiUrl = req.url;
  if ( !apiUrl.startsWith( '/api' ) && !apiUrl.startsWith( 'http' ) ) {
    apiUrl = `/api/${ version }/${ lang }${ apiUrl.startsWith( '/' ) ? '' : '/' }${ apiUrl }`;
  }

  const url = new URL( apiUrl, window.location.origin );
  const modifiedReq = req.clone( {
    url: url.toString(),
    headers: req.headers
      .append( 'Accept', 'application/json' )
  } );
  return next( modifiedReq )
    .pipe(
      catchError( err => {
        if ( err instanceof HttpErrorResponse ) {
          if ( err.status === 401 && token ) {
            ms.add( { severity: 'warn', summary: 'Aviso', detail: 'Sesión caducada. Vuelve a iniciar sesión' } )
            router.navigate( [ 'login' ] );
          }
        }
        return next( modifiedReq );
      } )
    );
};