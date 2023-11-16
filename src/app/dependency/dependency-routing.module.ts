import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainContainerComponent } from '../shared/main-container/main-container.component';
import { IndexComponent } from './pages/index/index.component';
import { CreateComponent } from './pages/create/create.component';
import { ShowComponent } from './pages/show/show.component';

const routes: Routes = [ {
  path: '',
  component: MainContainerComponent,
  children: [
    { path: 'index', component: IndexComponent },
    { path: 'create', component: CreateComponent },
    { path: 'edit/:id', component: CreateComponent },
    { path: 'show/:id', component: ShowComponent },
    { path: '**', redirectTo: 'index' }
  ]
} ];

@NgModule( {
  imports: [ RouterModule.forChild( routes ) ],
  exports: [ RouterModule ]
} )
export class DependencyRoutingModule { }
