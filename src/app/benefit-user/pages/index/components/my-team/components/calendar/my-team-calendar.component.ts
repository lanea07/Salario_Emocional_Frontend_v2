import { Component, ElementRef, Input, OnChanges, ViewChild, AfterViewInit } from '@angular/core';

import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import esLocale from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import multiMonthPlugin from '@fullcalendar/multimonth'

import { AuthService } from 'src/app/auth/services/auth.service';
import { BenefitUserElement } from 'src/app/benefit-user/interfaces/benefit-user.interface';
import { BenefitUserService } from 'src/app/benefit-user/services/benefit-user.service';
import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';
import Swal from 'sweetalert2';

@Component( {
  selector: 'my-team-calendar-component',
  templateUrl: './my-team-calendar.component.html',
  styles: [],
} )
export class MyTeamCalendarComponent implements OnChanges, AfterViewInit {

  @ViewChild( 'my_team_calendar' ) my_team_calendar!: FullCalendarComponent;
  @Input() data?: BenefitUserElement[] = [];
  isAdmin: boolean = false;
  modalData?: any;
  visible: boolean = false;

  my_team_calendarOptions: CalendarOptions = {
    initialView: 'listMonth',
    plugins: [ dayGridPlugin, timeGridPlugin, listPlugin, multiMonthPlugin ],
    eventClick: this.showModal.bind( this ),
    events: [],
    locale: esLocale,
    headerToolbar: {
      left: 'prev,today,next',
      center: 'title',
      right: 'multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay,listMonth,listWeek,listDay'
    },
    views: {
      multiMonthYear: { buttonText: 'Año' },
      listDay: { buttonText: 'Agenda Diaria' },
      listWeek: { buttonText: 'Agenda Semanal' },
      listMonth: { buttonText: 'Agenda Mensual' }
    },
    showNonCurrentDates: false,
    navLinks: true,
    businessHours: {
      daysOfWeek: [ 1, 2, 3, 4, 5 ],
      startTime: '07:00',
      endTime: '17:00',
    },
    firstDay: 7,
  };

  constructor (
    private authService: AuthService,
    private as: AlertService,
    private benefitUserService: BenefitUserService,
    private elementRef: ElementRef
  ) {
    this.authService.validarAdmin()
      .subscribe( {
        next: ( resp: any ) => {
          this.isAdmin = resp.admin;
        },
        error: ( err ) => {
          this.as.subscriptionAlert( subscriptionMessageTitle.ERROR, subscriptionMessageIcon.ERROR, err.error.message );
        }
      } );
  }

  ngOnChanges (): void {
    this.my_team_calendar?.getApi().removeAllEvents();
    this.data?.forEach( ( item: BenefitUserElement ) => {
      this.my_team_calendar?.getApi().addEvent( this.makeEvent( item ) )
    } );
  }

  ngAfterViewInit (): void {
    const event: CustomEvent = new CustomEvent<FullCalendarComponent>( 'CalendarReady', {
      bubbles: true,
      detail: this.my_team_calendar
    } );
    this.elementRef.nativeElement.dispatchEvent( event );
  }

  showModal ( arg: any ) {
    this.modalData = arg.event
    this.visible = true;
  }

  makeEvent ( eventData: BenefitUserElement ): any {
    const { id, benefit_begin_time, benefit_end_time } = eventData;
    const event = {
      id: id,
      start: new Date( benefit_begin_time ),
      end: new Date( benefit_end_time ),
      title: `${ eventData.user.name } - ${ eventData.benefits.name }- ${ eventData.benefit_detail.name }`,
      classNames: [ this.classSelector( eventData.benefits.name ), 'text-dark' ],
      extendedProps: eventData,
      allDay: eventData.benefits.name === "Mis Vacaciones" ? true : false,
    };
    return event;
  }

  classSelector ( benefitName: string ) {
    switch ( benefitName ) {
      case 'Mi Cumpleaños':
        return 'bg-danger-subtle';
      case 'Mi Viernes':
        return 'bg-success-subtle';
      case 'Mi Banco de Horas':
        return 'bg-warning-subtle';
      case 'Mis Vacaciones':
        return 'bg-dark-subtle';
      default:
        return 'bg-secondary-subtle';
    }
  }

  deleteBenefit ( eventID: number ) {
    Swal.fire( {
      title: 'Eliminar beneficio?',
      text: 'Confirme que desea eliminar el beneficio.',
      icon: 'question',
      showClass: {
        popup: 'animate__animated animate__fadeIn'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      },
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    } ).then( ( result ) => {
      if ( result.isConfirmed ) {
        this.benefitUserService.destroy( this.modalData.event.meta.id )
          .subscribe( {
            next: () => {
              // this.calendarOptions.eventRemove( this.modalData.event._def.publicId );
            },
            error: ( err ) => { }
          } )
      }
    } );
  }

}
