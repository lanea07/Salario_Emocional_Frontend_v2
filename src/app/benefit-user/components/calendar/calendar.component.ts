import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { BenefitUser } from '../../interfaces/benefit-user.interface';
import Swal from 'sweetalert2';
import { BenefitUserService } from '../../services/benefit-user.service';
import { AuthService } from 'src/app/auth/services/auth.service';

const colors: Record<string, EventColor> = {
  primary: {
    primary: '#37a91b',
    secondary: '#55ffbb',
  },
  secondary: {
    primary: '#888888',
    secondary: '#bbbbbb',
  }
};

@Component( {
  selector: 'calendar-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [],
  templateUrl: './calendar.component.html',
} )
export class CalendarComponent implements OnChanges {

  @ViewChild( 'modalContent', { static: true } ) modalContent!: TemplateRef<any>;
  @Input() data: any;

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  modalData!: { action: string; event: CalendarEvent; };
  isAdmin: boolean = false;

  // actions: CalendarEventAction[] = [
  //   {
  //     label: '<i class="fas fa-fw fa-pencil-alt"></i>',
  //     a11yLabel: 'Edit',
  //     onClick: ( { event }: { event: CalendarEvent } ): void => {
  //       this.handleEvent( 'Edited', event );
  //     },
  //   },
  //   {
  //     label: '<i class="fas fa-fw fa-trash-alt"></i>',
  //     a11yLabel: 'Delete',
  //     onClick: ( { event }: { event: CalendarEvent } ): void => {
  //       this.events = this.events.filter( ( iEvent ) => iEvent !== event );
  //       this.handleEvent( 'Deleted', event );
  //     },
  //   },
  // ];

  refresh = new Subject<void>();

  events: CalendarEvent[] = [
    // {
    //   start: subDays( startOfDay( new Date() ), 1 ),
    //   end: addDays( new Date(), 1 ),
    //   title: 'A 3 day event',
    //   color: { ...colors[ 'red' ] },
    //   actions: this.actions,
    //   allDay: true,
    //   resizable: {
    //     beforeStart: true,
    //     afterEnd: true,
    //   },
    //   draggable: true,
    // },
    // {
    //   start: startOfDay( new Date() ),
    //   title: 'An event with no end date',
    //   color: { ...colors[ 'yellow' ] },
    //   actions: this.actions,
    // },
    // {
    //   start: subDays( endOfMonth( new Date() ), 3 ),
    //   end: addDays( endOfMonth( new Date() ), 3 ),
    //   title: 'A long event that spans 2 months',
    //   color: { ...colors[ 'blue' ] },
    //   allDay: true,
    // },
    // {
    //   start: addHours( startOfDay( new Date() ), 2 ),
    //   end: addHours( new Date(), 2 ),
    //   title: 'A draggable and resizable event',
    //   color: { ...colors[ 'yellow' ] },
    //   actions: this.actions,
    //   resizable: {
    //     beforeStart: true,
    //     afterEnd: true,
    //   },
    //   draggable: true,
    // },
  ];

  activeDayIsOpen: boolean = false;

  constructor (
    private modal: NgbModal,
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
    // this.handleEvent( 'Dropped or resized', event );
  }

  handleEvent ( action: string, event: CalendarEvent ): void {
    this.modalData = { event, action };
    this.modal.open( this.modalContent, { size: 'lg' } );
  }

  // addEvent (): void {
  //   this.events = [
  //     ...this.events,
  //     {
  //       title: 'New event',
  //       start: startOfDay( new Date() ),
  //       end: endOfDay( new Date() ),
  //       color: colors[ 'red' ],
  //       draggable: true,
  //       resizable: {
  //         beforeStart: true,
  //         afterEnd: true,
  //       },
  //     },
  //   ];
  // }

  // deleteEvent ( eventToDelete: CalendarEvent ) {
  //   this.events = this.events.filter( ( event ) => event !== eventToDelete );
  // }

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
        this.benefitUserService.destroy( this.modalData.event.meta.id )
          .subscribe( {
            next: () => {
              this.events = this.events.filter( event => event.meta.id !== eventID );
              this.refresh.next();
              this.modal.dismissAll();
              this.activeDayIsOpen = false;
            },
            error: ( err ) => console.log( err )
          } )
      }
    } );
  }
}
