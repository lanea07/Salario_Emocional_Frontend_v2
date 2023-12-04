import { Component } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';


@Component( {
  selector: 'benefitemployee-index',
  templateUrl: './index.component.html',
  styles: [
  ]
} )
export class IndexComponent {

  calendarApis?: FullCalendarComponent[] = [];

  printObject ( event: any ) {
    this.calendarApis?.push( event.detail );
  }

  renderCalendars () {
    this.calendarApis?.forEach( ( calendarApi: any ) => {
      setTimeout( () => {
        calendarApi.getApi().render();
      }, 300 );
    } );
  }

}
