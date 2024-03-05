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
import { CalendarComponent } from './pages/index/components/calendar/calendar.component';
import { DiaDeLaFamiliaComponent } from './pages/index/components/dia-de-la-familia/dia-de-la-familia.component';
import { MiBancoDeHorasComponent } from './pages/index/components/mi-banco-de-horas/mi-banco-de-horas.component';
import { MiCumpleanosComponent } from './pages/index/components/mi-cumpleanos/mi-cumpleanos.component';
import { MiHorarioFlexibleComponent } from './pages/index/components/mi-horario-flexible/mi-horario-flexible.component';
import { MiViernesComponent } from './pages/index/components/mi-viernes/mi-viernes.component';
import { MisVacacionesComponent } from './pages/index/components/mis-vacaciones/mis-vacaciones.component';
import { MyBenefitsComponent } from './pages/index/components/my-benefits/my-benefits.component';
import { MyCollaboratorsBenefitsComponent } from './pages/index/components/my-collaborators-benefits/my-collaborators-benefits.component';
import { MyPendingBenefitsComponent } from './pages/index/components/my-pending-benefits/my-pending-benefits.component';
import { DropdownComponent } from './pages/index/components/my-team-request/components/dropdown/dropdown.component';
import { MyTeamRequestComponent } from './pages/index/components/my-team-request/my-team-request.component';
import { MyTeamComponent } from './pages/index/components/my-team/my-team.component';
import { PermisoEspecialComponent } from './pages/index/components/permiso-especial/permiso-especial.component';
import { TrabajoHibridoComponent } from './pages/index/components/trabajo-hibrido/trabajo-hibrido.component';
import { IndexComponent } from './pages/index/index.component';
import { ShowComponent } from './pages/show/show.component';

@NgModule( {
  declarations: [
    BenefitDecisionComponent,
    CalendarComponent,
    CreateComponent,
    DiaDeLaFamiliaComponent,
    DropdownComponent,
    IndexComponent,
    MiBancoDeHorasComponent,
    MiCumpleanosComponent,
    MiHorarioFlexibleComponent,
    MiViernesComponent,
    MisVacacionesComponent,
    MyBenefitsComponent,
    MyCollaboratorsBenefitsComponent,
    MyPendingBenefitsComponent,
    MyTeamComponent,
    MyTeamRequestComponent,
    ShowComponent,
    TrabajoHibridoComponent,
    PermisoEspecialComponent,
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
