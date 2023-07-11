import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';
import { PageNotFoundComponent } from './shared/error-pages/page-not-found/page-not-found.component';
import { LoginComponent } from './auth/pages/login/login.component';

const routes: Routes = [
  { path: 'login', loadChildren: () => import( './auth/auth.module' ).then( m => m.AuthModule ) },
  { path: 'benefit', loadChildren: () => import( './benefit/benefit.module' ).then( m => m.BenefitModule ), canMatch: [ authGuard ] },
  { path: 'benefit-detail', loadChildren: () => import( './benefit-detail/benefit-detail.module' ).then( m => m.BenefitDetailModule ), canMatch: [ authGuard ] },
  { path: 'benefit-employee', loadChildren: () => import( './benefit-user/benefit-user.module' ).then( m => m.BenefitEmployeeModule ), canMatch: [ authGuard ] },
  { path: 'position', loadChildren: () => import( './position/position.module' ).then( m => m.PositionModule ), canMatch: [ authGuard ] },
  { path: 'role', loadChildren: () => import( './role/role.module' ).then( m => m.RoleModule ), canMatch: [ authGuard ] },
  { path: 'user', loadChildren: () => import( './user/user.module' ).then( m => m.UserModule ), canMatch: [ authGuard ] },
  { path: '**', component: LoginComponent }
];

@NgModule( {
  imports: [ RouterModule.forRoot( routes ) ],
  exports: [ RouterModule ]
} )
export class AppRoutingModule { }
