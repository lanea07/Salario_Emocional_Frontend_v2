import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateComponent } from './pages/create/create.component';
import { IndexComponent } from './pages/index/index.component';
import { ShowComponent } from './pages/show/show.component';
import { isAdminGuard } from '../auth/guards/is-admin.guard';
import { SettingsComponent } from './pages/settings/settings.component';

const routes: Routes = [ {
  path: '',
  children: [
    { path: 'index', component: IndexComponent, title: 'Página Principal' },
    { path: 'create', component: CreateComponent, title: 'Crear Beneficio', canMatch: [ isAdminGuard ] },
    { path: 'edit/:id', component: CreateComponent, title: 'Editar Beneficio', canMatch: [ isAdminGuard ] },
    { path: 'settings/:id', component: SettingsComponent, title: 'Configuración de Beneficio', canMatch: [ isAdminGuard ] },
    { path: 'show/:id', component: ShowComponent, title: 'Ver Beneficio' },
    { path: '**', redirectTo: 'index' }
  ]
} ];

@NgModule( {
  imports: [ RouterModule.forChild( routes ) ],
  exports: [ RouterModule ]
} )
export class BenefitRoutingModule { }
