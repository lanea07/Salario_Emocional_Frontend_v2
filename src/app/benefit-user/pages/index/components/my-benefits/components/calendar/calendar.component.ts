import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { isSameDay, isSameMonth } from 'date-fns';
import { Subject } from 'rxjs';

import { CalendarEvent, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';
import { BenefitUser } from '../../../../../../interfaces/benefit-user.interface';
import { BenefitUserService } from '../../../../../../services/benefit-user.service';

const colors: Record<string, EventColor> = {
  primary: {
    primary: '#37a91b',
    secondary: '#55ffbb',
  },
  secondary: {
    primary: '#888888',
    secondary: '#bbbbbb',
  }
}

@Component( {
  selector: 'calendar-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [],
  templateUrl: './calendar.component.html',
} )
export class CalendarComponent implements OnChanges {

  @ViewChild( 'modalContent', { static: true } ) modalContent!: TemplateRef<any>;
  @Input() data: any;

  activeDayIsOpen: boolean = false;
  CalendarView = CalendarView;
  events: CalendarEvent[] = [];
  isAdmin: boolean = false;
  modalData?: { action: string; event: CalendarEvent; };
  refresh = new Subject<void>();
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  visible: boolean = false;

  constructor (
    private benefitUserService: BenefitUserService,
    private authService: AuthService
  ) { }

  ngOnInit () {
    this.authService.validarAdmin()
      .subscribe( {
        next: ( isAdmin: any ) => {
          this.isAdmin = isAdmin.admin;
        },
        error: ( error ) => {
          Swal.fire( {
            title: 'Error',
            icon: 'error',
            html: error.error.msg,
            timer: 3000,
            timerProgressBar: true,
            didOpen: ( toast ) => {
              toast.addEventListener( 'mouseenter', Swal.stopTimer )
              toast.addEventListener( 'mouseleave', Swal.resumeTimer )
            }
          } )
        }
      } );
  }

  ngOnChanges ( changes: SimpleChanges ) {
    this.addEventsToCalendar( this.data );
  }

  dayClicked ( { date, events }: { date: Date; events: CalendarEvent[] } ): void {
    if ( isSameMonth( date, this.viewDate ) ) {
      if ( ( isSameDay( this.viewDate, date ) && this.activeDayIsOpen === true ) || events.length === 0 ) {
        this.activeDayIsOpen = false;
      }
      else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
    else {
      this.viewDate = date
      this.activeDayIsOpen = false;
    }
  }

  eventTimesChanged ( {
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent ): void {
    this.events = this.events.map( ( iEvent ) => {
      if ( iEvent === event ) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    } );
  }

  handleEvent ( action: string, event: CalendarEvent ): void {
    this.modalData = { event, action };
    this.visible = true;
  }

  setView ( view: CalendarView ) {
    this.view = view;
  }

  closeOpenMonthViewDay () {
    this.activeDayIsOpen = false;
  }

  addEventsToCalendar ( data: any[] ) {
    this.events = [];
    data?.flat().forEach( ( element: BenefitUser ) => {
      let { benefit_user } = element;
      benefit_user.forEach( benefit => {
        if ( benefit.benefits.name === 'Mi Viernes' || benefit.benefits.name === 'Mi Banco de Horas' || benefit.benefits.name === 'Mi Cumpleaños' ) {
          this.events = [
            ...this.events,
            {
              title: String( element.name + ' - ' + benefit.benefits.name + ' - ' + benefit.benefit_detail.name ),
              start: new Date( benefit.benefit_begin_time ),
              end: new Date( benefit.benefit_end_time ),
              color: ( element.id === Number.parseInt( localStorage.getItem( 'uid' )! ) ) ? colors[ 'primary' ] : colors[ 'secondary' ],
              draggable: false,
              //actions: this.actions,
              meta: benefit
            }
          ];
        }

      } )
    } );

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
        this.benefitUserService.destroy( this.modalData?.event.meta.id )
          .subscribe( {
            next: () => {
              this.events = this.events.filter( event => event.meta.id !== eventID );
              this.refresh.next();
              this.activeDayIsOpen = false;
            },
            error: ( err ) => { }
          } )
      }
    } );
  }
}
