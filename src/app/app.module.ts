import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import es from '@angular/common/locales/es';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgChartsConfiguration } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BreadcrumbComponent } from './shared/breadcrumb/breadcrumb.component';
import { MainContainerComponent } from './shared/main-container/main-container.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { OffcanvasComponent } from './shared/offcanvas/offcanvas.component';

registerLocaleData( es );

@NgModule( {
  declarations: [
    AppComponent,
    BreadcrumbComponent,
    MainContainerComponent,
    NavbarComponent,
    OffcanvasComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [
    { provide: NgChartsConfiguration, useValue: { generateColors: false } },
  ],
  bootstrap: [ AppComponent ],
} )
export class AppModule { }
