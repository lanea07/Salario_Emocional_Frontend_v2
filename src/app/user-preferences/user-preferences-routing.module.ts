import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IndexComponent } from './pages/index/index.component';
import { authGuard } from '../auth/guards/auth.guard';

const routes: Routes = [ {
  path: '',
  children: [
    { path: 'index', component: IndexComponent, title: 'Mis Preferencias', canMatch: [authGuard] },
  ]
} ];

@NgModule( {
  imports: [ RouterModule.forChild( routes ) ],
  exports: [ RouterModule ]
} )
export class UserPreferencesRoutingModule { }
