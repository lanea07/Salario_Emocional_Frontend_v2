import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateComponent as BenefitDetailCreateComponente } from '../benefit-detail/pages/create/create.component';
import { IndexComponent as BenefitDetailIndexComponent } from '../benefit-detail/pages/index/index.component';
import { CreateComponent as BenefitCreateComponente } from '../benefit/pages/create/create.component';
import { IndexComponent as BenefitIndexComponent } from '../benefit/pages/index/index.component';
import { CreateComponent as DependencyCreateComponente } from '../dependency/pages/create/create.component';
import { IndexComponent as DependencyIndexComponent } from '../dependency/pages/index/index.component';
import { CreateComponent as PositionCreateComponente } from '../position/pages/create/create.component';
import { IndexComponent as PositionIndexComponent } from '../position/pages/index/index.component';
import { CreateComponent as RoleCreateComponente } from '../role/pages/create/create.component';
import { IndexComponent as RoleIndexComponent } from '../role/pages/index/index.component';
import { CreateComponent as UserCreateComponente } from '../user/pages/create/create.component';
import { IndexComponent as UserIndexComponent } from '../user/pages/index/index.component';
import { ContainerComponent } from './container/container.component';
import { ViewAllBenefitUserComponent } from './view-all-benefit-user/view-all-benefit-user.component';

const routes: Routes = [ {
  path: '',
  component: ContainerComponent,
  children: [
    { path: 'all-benefit-user', component: ViewAllBenefitUserComponent },
    { path: 'benefit-detail/index', component: BenefitDetailIndexComponent },
    { path: 'benefit-detail/create', component: BenefitDetailCreateComponente },
    { path: 'benefit/index', component: BenefitIndexComponent },
    { path: 'benefit/create', component: BenefitCreateComponente },
    { path: 'dependency/index', component: DependencyIndexComponent },
    { path: 'dependency/create', component: DependencyCreateComponente },
    { path: 'position/index', component: PositionIndexComponent },
    { path: 'position/create', component: PositionCreateComponente },
    { path: 'role/index', component: RoleIndexComponent },
    { path: 'role/create', component: RoleCreateComponente },
    { path: 'user/index', component: UserIndexComponent },
    { path: 'user/create', component: UserCreateComponente },
    { path: '**', redirectTo: 'all-benefit-user' }
  ],
} ];

@NgModule( {
  imports: [ RouterModule.forChild( routes ) ],
  exports: [ RouterModule ]
} )
export class AdminRoutingModule { }