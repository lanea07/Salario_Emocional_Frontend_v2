import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';

@Pipe( {
    name: 'vacationsDate',
    standalone: false
} )
export class VacationsDatePipe implements PipeTransform {

  transform ( value: Date, ...args: any[] ): string | Date {
    let date = new Date( value );
    date.setDate( date.getDate() - 1 );
    return formatDate( date, args[ 0 ], 'es-CO' );
  }

}
