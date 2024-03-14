import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable( {
  providedIn: 'root'
} )
export class HelpersService {

  constructor (
    private domSanitizer: DomSanitizer,
    private http: HttpClient,
  ) { }

  imgFromSVG ( svg?: string ) {
    if ( !svg ) return;
    let base64string = btoa( svg! );
    return this.domSanitizer.bypassSecurityTrustResourceUrl(
      `data:image/svg+xml;base64,${ base64string }`
    );
  }

}
