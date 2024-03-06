import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateComponent } from './pages/create/create.component';
import { IndexComponent } from './pages/index/index.component';
import { ShowComponent } from './pages/show/show.component';
import { MyBenefitsComponent } from './pages/index/components/my-benefits/my-benefits.component';
import { MyPendingBenefitsComponent } from './pages/index/components/my-pending-benefits/my-pending-benefits.component';
import { MyTeamComponent } from './pages/index/components/my-team/my-team.component';
import { MyTeamRequestComponent } from './pages/index/components/my-team-request/my-team-request.component';
import { MyCollaboratorsBenefitsComponent } from './pages/index/components/my-collaborators-benefits/my-collaborators-benefits.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: IndexComponent,
    title: 'Dashboard',
    children: [
      { path: 'my-benefits', component: MyBenefitsComponent, title: 'Mis Beneficios' },
      { path: 'my-pending-benefits', component: MyPendingBenefitsComponent, title: 'Mis Solicitudes' },
      { path: "my-team", component: MyTeamComponent, title: 'Mi Equipo' },
      { path: "my-team-request", component: MyTeamRequestComponent, title: 'Solicitudes de Mi Equipo' },
      { path: "my-collaborators-benefits", component: MyCollaboratorsBenefitsComponent, title: 'Mis Colaboradores' },
      { path: '**', redirectTo: 'my-benefits' }
    ]
  }, {
    path: '',
    children: [
      { path: 'edit/:id', component: CreateComponent, title: 'Editar Beneficio' },
      { path: 'show/:id', component: ShowComponent, title: 'Ver Beneficio' },
      { path: 'create', component: CreateComponent, title: 'Crear Beneficio' },
      { path: '**', redirectTo: '/basic/benefit-employee/dashboard' },
    ]
  }
];

@NgModule( {
  imports: [ RouterModule.forChild( routes ) ],
  exports: [ RouterModule ]
} )
export class BenefitUserRoutingModule { }
