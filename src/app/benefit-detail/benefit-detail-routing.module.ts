import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainContainerComponent } from '../shared/main-container/main-container.component';
import { CreateComponent } from './pages/create/create.component';
import { IndexComponent } from './pages/index/index.component';
import { ShowComponent } from './pages/show/show.component';
import { isAdminGuard } from '../auth/guards/is-admin.guard';
import { authGuard } from '../auth/guards/auth.guard';

const routes: Routes = [ {
  path: '',
  children: [
    { path: 'index', component: IndexComponent, title: 'Página Principal' },
    { path: 'create', component: CreateComponent, title: 'Crear Beneficio', canMatch: [ authGuard, isAdminGuard ] },
    { path: 'edit/:id', component: CreateComponent, title: 'Editar Beneficio', canMatch: [ authGuard, isAdminGuard ] },
    { path: 'show/:id', component: ShowComponent, title: 'Ver Beneficio' },
    { path: '**', redirectTo: 'index' }
  ]
} ];

@NgModule( {
  imports: [ RouterModule.forChild( routes ) ],
  exports: [ RouterModule ]
} )
export class BenefitDetailRoutingModule { }
