import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateComponent } from './pages/create/create.component';
import { IndexComponent } from './pages/index/index.component';
import { ShowComponent } from './pages/show/show.component';
import { PermissionsRolesComponent } from './pages/permissions-roles/permissions-roles.component';


const routes: Routes = [ {
  path: '',
  children: [
    { path: 'index', component: IndexComponent, title: 'Página Principal' },
    { path: 'create', component: CreateComponent, title: 'Crear Rol' },
    { path: 'edit/:id', component: CreateComponent, title: 'Editar Rol' },
    { path: 'show/:id', component: ShowComponent, title: 'Ver Rol' },
    { path: 'permissions-roles/:id', component: PermissionsRolesComponent, title: 'Permisos - Roles' },
    { path: '**', redirectTo: 'index' }
  ]
} ];

@NgModule( {
  imports: [ RouterModule.forChild( routes ) ],
  exports: [ RouterModule ]
} )
export class RoleRoutingModule { }
