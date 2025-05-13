import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import esLocale from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import multiMonthPlugin from '@fullcalendar/multimonth';
import timeGridPlugin from '@fullcalendar/timegrid';
import { ConfirmationService, MessageService } from 'primeng/api';


import { AuthService } from 'src/app/auth/services/auth.service';
import { BenefitUserElement } from 'src/app/benefit-user/interfaces/benefit-user.interface';
import { BenefitUserService } from 'src/app/benefit-user/services/benefit-user.service';


@Component( {
    selector: 'calendar-component',
    templateUrl: './calendar.component.html',
    styles: [],
    standalone: false
} )
export class CalendarComponent implements OnChanges, AfterViewInit {

  @Input() data: BenefitUserElement[] = [];
  @Input() year: number = new Date().getFullYear().valueOf();
  @ViewChild( 'calendar' ) calendar!: FullCalendarComponent;
  isAdmin: boolean = false;
  modalData?: any;
  visible: boolean = false;

  calendarOptions: CalendarOptions = {
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
    public activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private benefitUserService: BenefitUserService,
    private cs: ConfirmationService,
    private elementRef: ElementRef,
    private ms: MessageService,
  ) {
    this.authService.validarAdmin()
      .subscribe( {
        next: ( resp: any ) => {
          this.isAdmin = resp.admin;
        },
        error: ( err ) => {
          this.ms.add( { severity: 'error', summary: 'Error', detail: err.error.message } );
        }
      } );
  }

  ngOnChanges ( changes: SimpleChanges ): void {
    this.calendar?.getApi().removeAllEvents();
    if ( this.data.length > 0 ) {
      this.data?.forEach( ( item: BenefitUserElement ) => {
        this.calendar?.getApi().addEvent( this.makeEvent( item ) )
      } );
    }
    let year = this.year;
    let month = new Date().getMonth() + 1;
    let day = '01';
    let date = new Date( `${ year }-${ month }-${ day }` );
    this.calendar?.getApi().gotoDate( date );
  }

  ngAfterViewInit (): void {
    this.calendar?.getApi().removeAllEvents();
    this.data?.forEach( ( item: BenefitUserElement ) => {
      this.calendar?.getApi().addEvent( this.makeEvent( item ) )
    } );
    const event: CustomEvent = new CustomEvent<FullCalendarComponent>( 'CalendarReady', {
      bubbles: true,
      detail: this.calendar
    } );
    this.elementRef.nativeElement.dispatchEvent( event );
    this.elementRef.nativeElement.getElementsByClassName( 'fc-header-toolbar' )[ 0 ].classList
      .add(
        'd-flex',
        'flex-column',
        'flex-md-row',
      );
    let elements: HTMLCollection[] = this.elementRef.nativeElement.getElementsByClassName( 'fc-button-group' )
    Object.values( elements ).forEach( ( element: any ) => {
      element.classList
        .add(
          'd-flex',
          'flex-wrap',
        );
    } );
    elements = this.elementRef.nativeElement.getElementsByClassName( 'fc-button' )
    Object.values( elements ).forEach( ( element: any ) => {
      element.classList
        .add(
          'rounded-0',
        );
    } );
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
      case 'Día de la Familia':
        return 'bg-secondary-subtle';
      default:
        return 'bg-primary-subtle';
    }
  }

  deleteBenefit ( event: any, eventID: number ) {
    this.cs.confirm( {
      message: 'Estás Seguro? Esta acción no se puede deshacer.',
      header: 'Confirmar...',
      icon: 'fa-solid fa-triangle-exclamation',
      acceptIcon: "none",
      rejectIcon: "none",
      acceptButtonStyleClass: "btn btn-danger",
      rejectButtonStyleClass: "btn btn-link",
      accept: () => {
        this.benefitUserService.destroy( eventID )
          .subscribe( {
            next: () => {
              this.ms.add( { severity: 'success', summary: 'Eliminado' } );
              this.calendar.getApi().getEventById( eventID.toString() )?.remove();
              this.visible = false;
            },
            error: ( { error } ) => this.ms.add( { severity: 'error', summary: 'Error', detail: error.message } )
          } )
      },
      reject: () => {
        this.ms.add( { severity: 'info', summary: 'Operación Cancelada' } );
      }
    } );
  }

}
