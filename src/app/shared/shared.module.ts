import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { BackButtonDirective } from './directives/back-button-directive.directive';
import { MainContainerComponent } from './main-container/main-container.component';
import { NavbarComponent } from './navbar/navbar.component';
import { TotalBancoHorasPipe } from './pipes/TotalBancoHoras.pipe';
import { VacationsDatePipe } from './pipes/vacations-date.pipe';
import { PluckJoinPipe } from './pipes/pluck-join.pipe';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { SkeletonComponent } from './skeleton/skeleton.component';
import { PrimengModule } from '../primeng/primeng.module';

@NgModule( {
  declarations: [
    BackButtonDirective,
    BreadcrumbComponent,
    MainContainerComponent,
    NavbarComponent,
    PluckJoinPipe,
    SkeletonComponent,
    TotalBancoHorasPipe,
    VacationsDatePipe,
  ],
  imports: [
    CommonModule,
    LoadingBarModule,
    LoadingBarRouterModule,
    PrimengModule,
    RouterModule,
  ],
  exports: [
    BackButtonDirective,
    BreadcrumbComponent,
    MainContainerComponent,
    NavbarComponent,
    PluckJoinPipe,
    SkeletonComponent,
    TotalBancoHorasPipe,
    VacationsDatePipe,
  ]
} )
export class SharedModule { }
