import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = ( req: HttpRequest<unknown>, next: HttpHandlerFn ) => {
  const modifiedReq = req.clone( {
    headers: req.headers
      .append( 'Accept', 'application/json' )
      .append( 'Authorization', `Bearer ${ localStorage.getItem( 'token' ) }` )
  } );
  return next( modifiedReq );
};
