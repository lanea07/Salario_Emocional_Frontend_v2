import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContainerComponent } from './container/container.component';
import { ViewAllBenefitUserComponent } from './view-all-benefit-user/view-all-benefit-user.component';

const routes: Routes = [ {
  path: '',
  component: ContainerComponent,
  children: [
    { path: 'all-benefit-user', component: ViewAllBenefitUserComponent },
    { path: '**', redirectTo: 'all-benefit-user' }
  ],
} ];

@NgModule( {
  imports: [ RouterModule.forChild( routes ) ],
  exports: [ RouterModule ]
} )
export class AdminRoutingModule { }