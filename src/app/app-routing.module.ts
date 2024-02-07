import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from './auth/guards/auth.guard';
import { LoginComponent } from './auth/pages/login/login.component';

const routes: Routes = [
  { path: 'login', loadChildren: () => import( './auth/auth.module' ).then( m => m.AuthModule ), title: 'Login' },
  { path: 'benefit-employee', loadChildren: () => import( './benefit-user/benefit-user.module' ).then( m => m.BenefitEmployeeModule ), canMatch: [ authGuard ], title: 'Beneficios de Empleado' },
  { path: 'admin', loadChildren: () => import( './admin/admin.module' ).then( m => m.AdminModule ), canMatch: [ authGuard ], title: 'Administración' },
  { path: '**', component: LoginComponent }
];

@NgModule( {
  imports: [ RouterModule.forRoot( routes ) ],
  exports: [ RouterModule ]
} )
export class AppRoutingModule { }
