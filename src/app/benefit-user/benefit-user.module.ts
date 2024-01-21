import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FullCalendarModule } from '@fullcalendar/angular';
import { DataTablesModule } from 'angular-datatables';
import { NgChartsModule } from 'ng2-charts';

import { PrimengModule } from '../primeng/primeng.module';
import { TotalBancoHorasPipe } from '../shared/pipes/TotalBancoHoras.pipe';
import { BenefitUserRoutingModule } from './benefit-user-routing.module';
import { CreateComponent } from './pages/create/create.component';
import { BarChartComponent } from './pages/index/components/my-benefits/components/bar-chart/bar-chart.component';
import { CalendarComponent } from './pages/index/components/my-benefits/components/calendar/calendar.component';
import { DoughnutChartComponent } from './pages/index/components/my-benefits/components/doughnut-chart/doughnut-chart.component';
import { MiBancoDeHorasComponent } from './pages/index/components/my-benefits/components/mi-banco-de-horas/mi-banco-de-horas.component';
import { MiCumpleanosComponent } from './pages/index/components/my-benefits/components/mi-cumpleanos/mi-cumpleanos.component';
import { MiHorarioAlternanciaComponent } from './pages/index/components/my-benefits/components/mi-horario-alternancia/mi-horario-alternancia.component';
import { MiHorarioFlexibleComponent } from './pages/index/components/my-benefits/components/mi-horario-flexible/mi-horario-flexible.component';
import { MiTiempoViajeroComponent } from './pages/index/components/my-benefits/components/mi-tiempo-viajero/mi-tiempo-viajero.component';
import { MiViernesComponent } from './pages/index/components/my-benefits/components/mi-viernes/mi-viernes.component';
import { MisVacacionesComponent } from './pages/index/components/my-benefits/components/mis-vacaciones/mis-vacaciones.component';
import { MyBenefitsComponent } from './pages/index/components/my-benefits/my-benefits.component';
import { MyPendingBenefitsComponent } from './pages/index/components/my-pending-benefits/my-pending-benefits.component';
import { DropdownComponent } from './pages/index/components/my-team-request/components/dropdown/dropdown.component';
import { MyTeamRequestComponent } from './pages/index/components/my-team-request/my-team-request.component';
import { MyTeamCalendarComponent } from './pages/index/components/my-team/components/calendar/my-team-calendar.component';
import { MyTeamComponent } from './pages/index/components/my-team/my-team.component';
import { IndexComponent } from './pages/index/index.component';
import { ShowComponent } from './pages/show/show.component';


@NgModule( {
  declarations: [
    BarChartComponent,
    CalendarComponent,
    CreateComponent,
    DoughnutChartComponent,
    IndexComponent,
    MyBenefitsComponent,
    MyPendingBenefitsComponent,
    MyTeamRequestComponent,
    MyTeamCalendarComponent,
    MyTeamComponent,
    ShowComponent,
    TotalBancoHorasPipe,
    MiHorarioFlexibleComponent,
    MiViernesComponent,
    MiBancoDeHorasComponent,
    MiCumpleanosComponent,
    MiTiempoViajeroComponent,
    MiHorarioAlternanciaComponent,
    MisVacacionesComponent,
    DropdownComponent,
  ],
  imports: [
    BenefitUserRoutingModule,
    CommonModule,
    DataTablesModule,
    FullCalendarModule,
    NgChartsModule,
    PrimengModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    TotalBancoHorasPipe,
  ]
} )
export class BenefitEmployeeModule { }
