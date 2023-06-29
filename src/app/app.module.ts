import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material/angular-material.module';
import { NgChartsConfiguration } from 'ng2-charts';
import { HttpClientModule } from '@angular/common/http';
import { MainContainerComponent } from './shared/main-container/main-container.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PageNotFoundComponent } from './shared/error-pages/page-not-found/page-not-found.component';

@NgModule( {
  declarations: [
    AppComponent,
    MainContainerComponent,
    NavbarComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    HttpClientModule,
    CalendarModule.forRoot( { provide: DateAdapter, useFactory: adapterFactory } ),
    NgbModule
  ],
  providers: [
    { provide: NgChartsConfiguration, useValue: { generateColors: false } }
  ],
  bootstrap: [ AppComponent ],
  exports: [
    MainContainerComponent,
    NavbarComponent
  ]
} )
export class AppModule { }
