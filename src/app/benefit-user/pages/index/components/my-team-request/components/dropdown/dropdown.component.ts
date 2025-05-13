import { Component, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Dropdown } from 'primeng/dropdown';
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
    styles: [],
    standalone: false
} )
export class DropdownComponent implements OnInit, OnDestroy {

  @Input() data = {};
  @Output() emitter = new Subject<DropdownComponentEventType>();
  @ViewChild( 'dropdown' ) dropdown!: Dropdown;

  options: Options[] = [];
  formGroup!: FormGroup;

  constructor (
    private messagingService: MessagingService,
  ) { }

  ngOnInit () {
    this.options = [
      { action: 'view', label: 'Ver' },
      { action: 'decide', label: 'Decidir' },
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
  }

}
