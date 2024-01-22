import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from './auth/guards/auth.guard';
import { LoginComponent } from './auth/pages/login/login.component';

const routes: Routes = [
  { path: 'login', loadChildren: () => import( './auth/auth.module' ).then( m => m.AuthModule ), title: 'Login' },
  { path: 'benefit', loadChildren: () => import( './benefit/benefit.module' ).then( m => m.BenefitModule ), canMatch: [ authGuard ], title: 'Beneficios' },
  { path: 'benefit-detail', loadChildren: () => import( './benefit-detail/benefit-detail.module' ).then( m => m.BenefitDetailModule ), canMatch: [ authGuard ], title: 'Detalles de Beneficio' },
  { path: 'benefit-employee', loadChildren: () => import( './benefit-user/benefit-user.module' ).then( m => m.BenefitEmployeeModule ), canMatch: [ authGuard ], title: 'Beneficios de Empleado' },
  { path: 'dependency', loadChildren: () => import( './dependency/dependency.module' ).then( m => m.DependencyModule ), canMatch: [ authGuard ], title: 'Dependencias' },
  { path: 'position', loadChildren: () => import( './position/position.module' ).then( m => m.PositionModule ), canMatch: [ authGuard ], title: 'Cargis' },
  { path: 'role', loadChildren: () => import( './role/role.module' ).then( m => m.RoleModule ), canMatch: [ authGuard ], title: 'Roles' },
  { path: 'user', loadChildren: () => import( './user/user.module' ).then( m => m.UserModule ), canMatch: [ authGuard ], title: 'Usuarios' },
  { path: '**', component: LoginComponent }
];

@NgModule( {
  imports: [ RouterModule.forRoot( routes ) ],
  exports: [ RouterModule ]
} )
export class AppRoutingModule { }
