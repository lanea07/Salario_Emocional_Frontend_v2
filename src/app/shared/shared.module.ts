import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
