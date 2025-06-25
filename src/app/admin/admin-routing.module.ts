import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContainerComponent } from './container/container.component';
import { ViewAllBenefitUserComponent } from './view-all-benefit-user/view-all-benefit-user.component';

const routes: Routes = [ {
  path: '',
  component: ContainerComponent,
  children: [
    { path: 'all-benefit-user', component: ViewAllBenefitUserComponent, title: 'Dashboard' },
    { path: 'benefit-detail', loadChildren: () => import( '../benefit-detail/benefit-detail.module' ).then( m => m.BenefitDetailModule ), title: 'Detalles de Beneficio' },
    { path: 'benefit-employee', loadChildren: () => import( '../benefit-user/benefit-user.module' ).then( m => m.BenefitEmployeeModule ), title: 'Beneficios de Empleado' },
    { path: 'benefit', loadChildren: () => import( '../benefit/benefit.module' ).then( m => m.BenefitModule ), title: 'Beneficios' },
    { path: 'dependency', loadChildren: () => import( '../dependency/dependency.module' ).then( m => m.DependencyModule ), title: 'Dependencias' },
    { path: 'permission', loadChildren: () => import( '../permission/permission.module' ).then( m => m.PermissionModule ), title: 'Cargos' },
    { path: 'position', loadChildren: () => import( '../position/position.module' ).then( m => m.PositionModule ), title: 'Cargos' },
    { path: 'role', loadChildren: () => import( '../role/role.module' ).then( m => m.RoleModule ), title: 'Roles' },
    { path: 'user', loadChildren: () => import( '../user/user.module' ).then( m => m.UserModule ), title: 'Usuarios' },
    { path: '**', redirectTo: 'all-benefit-user' }
  ],
} ];

@NgModule( {
  imports: [ RouterModule.forChild( routes ) ],
  exports: [ RouterModule ]
} )
export class AdminRoutingModule { }