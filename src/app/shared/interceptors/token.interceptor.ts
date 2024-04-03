import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';


export const tokenInterceptor: HttpInterceptorFn = ( req: HttpRequest<unknown>, next: HttpHandlerFn ) => {
  const ms = inject( MessageService );
  const router = inject( Router );
  const token = localStorage.getItem( 'token' );
  const modifiedReq = req.clone( {
    headers: req.headers
      .append( 'Accept', 'application/json' )
      .append( 'Authorization', `Bearer ${ localStorage.getItem( 'token' ) }` )
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
