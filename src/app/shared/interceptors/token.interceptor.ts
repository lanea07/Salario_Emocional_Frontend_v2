import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from '../services/alert-service.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const tokenInterceptor: HttpInterceptorFn = ( req: HttpRequest<unknown>, next: HttpHandlerFn ) => {
  const as = inject( AlertService );
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
            as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.WARNING, "Sesión Caducada." );
            router.navigate( [ 'login' ] );
          }
        }
        return next( modifiedReq );
      } )
    );
};
