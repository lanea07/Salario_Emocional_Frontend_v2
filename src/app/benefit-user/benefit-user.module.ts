import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgChartsModule } from 'ng2-charts';

import { PrimengModule } from '../primeng/primeng.module';
import { TotalBancoHorasPipe } from '../shared/pipes/TotalBancoHoras.pipe';
import { BenefitUserRoutingModule } from './benefit-user-routing.module';
import { CreateComponent } from './pages/create/create.component';
import { BarChartComponent } from './pages/index/components/my-benefits/components/bar-chart/bar-chart.component';
import { CalendarComponent } from './pages/index/components/my-benefits/components/calendar/calendar.component';
import { DoughnutChartComponent } from './pages/index/components/my-benefits/components/doughnut-chart/doughnut-chart.component';
import { MyBenefitsComponent } from './pages/index/components/my-benefits/my-benefits.component';
import { MyPendingBenefitsComponent } from './pages/index/components/my-pending-benefits/my-pending-benefits.component';
import { MyTeamRequestComponent } from './pages/index/components/my-team-request/my-team-request.component';
import { MyTeamComponent } from './pages/index/components/my-team/my-team.component';
import { IndexComponent } from './pages/index/index.component';
import { ShowComponent } from './pages/show/show.component';
import { MiHorarioFlexibleComponent } from './pages/index/components/my-benefits/components/mi-horario-flexible/mi-horario-flexible.component';
import { MiViernesComponent } from './pages/index/components/my-benefits/components/mi-viernes/mi-viernes.component';
import { MiBancoDeHorasComponent } from './pages/index/components/my-benefits/components/mi-banco-de-horas/mi-banco-de-horas.component';
import { MiCumpleanosComponent } from './pages/index/components/my-benefits/components/mi-cumpleanos/mi-cumpleanos.component';
import { MiTiempoViajeroComponent } from './pages/index/components/my-benefits/components/mi-tiempo-viajero/mi-tiempo-viajero.component';
import { MiHorarioAlternanciaComponent } from './pages/index/components/my-benefits/components/mi-horario-alternancia/mi-horario-alternancia.component';
import { MisVacacionesComponent } from './pages/index/components/my-benefits/components/mis-vacaciones/mis-vacaciones.component';
import { FullCalendarModule } from '@fullcalendar/angular';


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
  ],
  imports: [
    BenefitUserRoutingModule,
    CommonModule,
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
