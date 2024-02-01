import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { BackButtonDirective } from './directives/back-button-directive.directive';
import { MainContainerComponent } from './main-container/main-container.component';
import { NavbarComponent } from './navbar/navbar.component';
import { OffcanvasComponent } from './offcanvas/offcanvas.component';
import { TotalBancoHorasPipe } from './pipes/TotalBancoHoras.pipe';
import { VacationsDatePipe } from './pipes/vacations-date.pipe';

@NgModule( {
  declarations: [
    BackButtonDirective,
    BreadcrumbComponent,
    MainContainerComponent,
    NavbarComponent,
    OffcanvasComponent,
    TotalBancoHorasPipe,
    VacationsDatePipe,
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [
    BackButtonDirective,
    BreadcrumbComponent,
    MainContainerComponent,
    NavbarComponent,
    OffcanvasComponent,
    TotalBancoHorasPipe,
    VacationsDatePipe,
  ]
} )
export class SharedModule { }
