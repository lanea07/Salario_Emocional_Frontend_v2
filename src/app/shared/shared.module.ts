import { NgModule } from '@angular/core';

import { BackButtonDirective } from './directives/back-button-directive.directive';


@NgModule( {
  declarations: [
    BackButtonDirective
  ],
  imports: [],
  exports: [
    BackButtonDirective
  ]
} )
export class SharedModule { }
