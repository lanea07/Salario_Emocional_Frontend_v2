import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import esLocale from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import Swal from 'sweetalert2';

import { AuthService } from 'src/app/auth/services/auth.service';
import { BenefitUserElement } from 'src/app/benefit-user/interfaces/benefit-user.interface';
import { BenefitUserService } from 'src/app/benefit-user/services/benefit-user.service';
import { AlertService, subscriptionMessageIcon, subscriptionMessageTitle } from 'src/app/shared/services/alert-service.service';

@Component( {
  selector: 'calendar-component',
  templateUrl: './calendar.component.html',
  styles: [],
} )
export class CalendarComponent implements OnChanges {

  @ViewChild( 'calendar' ) calendar!: FullCalendarComponent;
  @Input() data?: BenefitUserElement[] = [];
  isAdmin: boolean = false;
  modalData?: any;
  visible: boolean = false;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [ dayGridPlugin, timeGridPlugin ],
    eventClick: this.showModal.bind( this ),
    events: [],
    locale: esLocale,
    headerToolbar: {
      left: 'prev,today,next',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    }
  };

  constructor (
    private authService: AuthService,
    private as: AlertService,
    private benefitUserService: BenefitUserService,
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

  ngOnChanges ( changes: SimpleChanges ): void {
    this.calendar.getApi().removeAllEvents();
    this.data?.forEach( ( item: BenefitUserElement ) => {
      this.calendar.getApi().addEvent( this.makeEvent( item ) )
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
      title: `${ eventData.benefits.name }`,
      classNames: [ this.classSelector( eventData.benefits.name ) ],
      extendedProps: eventData,
      allDay: eventData.benefits.name === "Mis Vacaciones" ? true : false,
    };
    return event;
  }

  classSelector ( benefitName: string ) {
    switch ( benefitName ) {
      case 'Mi Cumpleaños':
        return 'text-bg-danger';
      case 'Mi Viernes':
        return 'text-bg-success';
      case 'Mi Banco de Horas':
        return 'text-bg-warning';
      case 'Mis Vacaciones':
        return 'text-bg-dark';
      default:
        return 'text-bg-secondary';
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
