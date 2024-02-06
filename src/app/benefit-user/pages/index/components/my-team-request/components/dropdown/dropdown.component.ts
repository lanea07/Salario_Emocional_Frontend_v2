import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

import { DropdownComponentEventType } from 'src/app/benefit-user/interfaces/dropdown-component-event-type';
import { MessagingService } from 'src/app/benefit-user/services/messaging.service';

interface Options {
  action: string;
  label: string;
}

@Component( {
  selector: 'datatables-dropdown-component',
  templateUrl: './dropdown.component.html',
  styles: [
  ]
} )
export class DropdownComponent implements OnInit, OnDestroy {

  options: Options[] = [];
  @Input() data = {};
  @Output() emitter = new Subject<DropdownComponentEventType>();
  formGroup!: FormGroup;

  constructor (
    private messagingService: MessagingService,
  ) { }

  ngOnInit () {
    this.options = [
      { action: 'view', label: 'Ver' },
      { action: 'approve', label: 'Aprobar' },
      { action: 'reject', label: 'Rechazar' },
    ];

    this.formGroup = new FormGroup( {
      selectedAction: new FormControl<Options[] | null>( null )
    } );
  }

  ngOnDestroy (): void {
    this.emitter.unsubscribe();
  }

  emitEvent ( cmd: any ): void {
    this.emitter.next( {
      cmd: cmd.value,
      data: this.data,
    } );
    this.messagingService.message.next( {
      mustRefresh: true,
    } );
  }

}
