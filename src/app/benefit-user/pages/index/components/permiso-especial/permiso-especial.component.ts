import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BenefitUserElement } from 'src/app/benefit-user/interfaces/benefit-user.interface';

@Component( {
  selector: 'permiso-especial',
  templateUrl: './permiso-especial.component.html',
  styles: ``
} )
export class PermisoEspecialComponent implements OnChanges {

  @Input() data: BenefitUserElement[] = [];
  dataArray: any[] = [];

  ngOnChanges ( changes: SimpleChanges ): void {
    this.dataArray = this.data?.map( ( item: BenefitUserElement ) => {
      return item;
    } );
  }
}
