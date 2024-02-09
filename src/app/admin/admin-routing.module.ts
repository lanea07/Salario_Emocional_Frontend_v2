import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from '../auth/guards/auth.guard';
import { ContainerComponent } from './container/container.component';
import { ViewAllBenefitUserComponent } from './view-all-benefit-user/view-all-benefit-user.component';

const routes: Routes = [ {
  path: '',
  component: ContainerComponent,
  children: [
    { path: 'all-benefit-user', component: ViewAllBenefitUserComponent, title: 'Dashboard' },
    { path: 'benefit-detail', loadChildren: () => import( '../benefit-detail/benefit-detail.module' ).then( m => m.BenefitDetailModule ), canMatch: [ authGuard ], title: 'Detalles de Beneficio' },
    { path: 'benefit', loadChildren: () => import( '../benefit/benefit.module' ).then( m => m.BenefitModule ), canMatch: [ authGuard ], title: 'Beneficios' },
    { path: 'dependency', loadChildren: () => import( '../dependency/dependency.module' ).then( m => m.DependencyModule ), canMatch: [ authGuard ], title: 'Dependencias' },
    { path: 'position', loadChildren: () => import( '../position/position.module' ).then( m => m.PositionModule ), canMatch: [ authGuard ], title: 'Cargos' },
    { path: 'role', loadChildren: () => import( '../role/role.module' ).then( m => m.RoleModule ), canMatch: [ authGuard ], title: 'Roles' },
    { path: 'user', loadChildren: () => import( '../user/user.module' ).then( m => m.UserModule ), canMatch: [ authGuard ], title: 'Usuarios' },
    { path: '**', redirectTo: 'all-benefit-user' }
  ],
} ];

@NgModule( {
  imports: [ RouterModule.forChild( routes ) ],
  exports: [ RouterModule ]
} )
export class AdminRoutingModule { }