import { Injectable } from '@angular/core';

import Swal from 'sweetalert2';

export enum subscriptionMessageTitle {
  ACTUALIZADO = 'Actualizado',
  PASSCHANGED = 'Contraseña Cambiada',
  CREADO = 'Creado',
  ELIMINADO = 'Eliminado',
  ERROR = 'Error'
}

export enum subscriptionMessageIcon {
  ERROR = 'error',
  INFO = 'info',
  QUESTION = 'question',
  SUCCESS = 'success',
  WARNING = 'warning'
}

@Injectable( {
  providedIn: 'root'
} )
export class AlertService {

  constructor () { }

  /**
   * Triggers a SweetAlert2 popup alert with the following settings
   * 
   * @param {subscriptionMessageTitle} title 
   * @param {subscriptionMessageIcon} icon 
   * @param {string} text (optional)
   */
  subscriptionAlert ( title: subscriptionMessageTitle, icon: subscriptionMessageIcon, text?: string ) {
    Swal.fire( {
      title,
      text,
      icon
    } );
  }
}
