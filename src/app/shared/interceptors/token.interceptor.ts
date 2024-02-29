import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = ( req: HttpRequest<unknown>, next: HttpHandlerFn ) => {
  const modifiedReq = req.clone( {
    headers: req.headers
      .set( 'Accept', 'application/json' )
      .set( 'Authorization', `Bearer ${ localStorage.getItem( 'token' ) }` )
  } );
  return next( modifiedReq );
};
