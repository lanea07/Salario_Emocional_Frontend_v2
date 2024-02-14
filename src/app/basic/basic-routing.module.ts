import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainContainerComponent } from '../shared/main-container/main-container.component';
import { authGuard } from '../auth/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: MainContainerComponent,
    children: [
      { path: 'benefit-employee', loadChildren: () => import( '../benefit-user/benefit-user.module' ).then( m => m.BenefitEmployeeModule ), canMatch: [ authGuard ], title: 'Beneficios de Empleado' },
      { path: 'benefit', loadChildren: () => import( '../benefit/benefit.module' ).then( m => m.BenefitModule ), canMatch: [ authGuard ], title: 'Beneficios' },
      { path: 'user-preferences', loadChildren: () => import( '../user-preferences/user-preferences.module' ).then( m => m.UserPreferencesModule ), canMatch: [ authGuard ], title: 'Preferencias' },
      { path: '**', redirectTo: 'benefit-employee' },
    ]
  }

];

@NgModule( {
  imports: [ RouterModule.forChild( routes ) ],
  exports: [ RouterModule ]
} )
export class BasicRoutingModule { }
