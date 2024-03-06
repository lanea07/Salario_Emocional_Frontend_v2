import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FullCalendarModule } from '@fullcalendar/angular';
import { DataTablesModule } from 'angular-datatables';

import { PrimengModule } from '../primeng/primeng.module';
import { SharedModule } from '../shared/shared.module';
import { BenefitUserRoutingModule } from './benefit-user-routing.module';
import { CreateComponent } from './pages/create/create.component';
import { BenefitDecisionComponent } from './pages/index/components/benefit-decision/benefit-decision.component';
import { BenefitDetailContainerComponent } from './pages/index/components/benefit-detail-container/benefit-detail-container.component';
import { CalendarComponent } from './pages/index/components/calendar/calendar.component';
import { MyBenefitsComponent } from './pages/index/components/my-benefits/my-benefits.component';
import { MyCollaboratorsBenefitsComponent } from './pages/index/components/my-collaborators-benefits/my-collaborators-benefits.component';
import { MyPendingBenefitsComponent } from './pages/index/components/my-pending-benefits/my-pending-benefits.component';
import { DropdownComponent } from './pages/index/components/my-team-request/components/dropdown/dropdown.component';
import { MyTeamRequestComponent } from './pages/index/components/my-team-request/my-team-request.component';
import { MyTeamComponent } from './pages/index/components/my-team/my-team.component';
import { YearSelectorComponent } from './pages/index/components/year-selector/year-selector.component';
import { IndexComponent } from './pages/index/index.component';
import { ShowComponent } from './pages/show/show.component';
import { BenefitDetailComponent } from './pages/index/components/benefit-detail-container/components/benefit-detail.component';

@NgModule( {
  declarations: [
    BenefitDecisionComponent,
    BenefitDetailComponent,
    BenefitDetailContainerComponent,
    CalendarComponent,
    CreateComponent,
    DropdownComponent,
    IndexComponent,
    MyBenefitsComponent,
    MyCollaboratorsBenefitsComponent,
    MyPendingBenefitsComponent,
    MyTeamComponent,
    MyTeamRequestComponent,
    ShowComponent,
    YearSelectorComponent,
  ],
  imports: [
    BenefitUserRoutingModule,
    CommonModule,
    DataTablesModule,
    FormsModule,
    FullCalendarModule,
    PrimengModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: []
} )
export class BenefitEmployeeModule { }
