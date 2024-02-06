import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable( {
  providedIn: 'root'
} )
export class MessagingService {

  message = new Subject<any>();

  constructor () { }
}
