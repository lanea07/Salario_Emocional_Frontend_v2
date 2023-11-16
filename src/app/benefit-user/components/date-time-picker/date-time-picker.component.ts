import { Component } from '@angular/core';

import { getISOWeek } from 'date-fns';

@Component( {
  selector: 'ng-zorro-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styles: [
    `
      nz-range-picker {
        margin: 0 8px 12px 0;
      }
    `
  ]
} )
export class DatePickerComponent {
  date = null;

  // onChange ( result: Date[] ): void {
  //   console.log( 'onChange: ', result );
  // }
}
