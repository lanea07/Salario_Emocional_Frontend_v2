import { DATE_PIPE_DEFAULT_OPTIONS, registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import { NgChartsConfiguration } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpInterceptor } from './shared/interceptors/token.interceptor';
import { PrimengModule } from './primeng/primeng.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';
import { DataTablesModule } from 'angular-datatables';

registerLocaleData( es );

@NgModule( {
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    DataTablesModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    PrimengModule,
    SharedModule
  ],
  providers: [
    provideHttpClient(
      withInterceptors( [ httpInterceptor ] ),
    ),
    { provide: DATE_PIPE_DEFAULT_OPTIONS, useValue: { locale: 'es', dateFormat: 'medium', timezone: 'es-CO' } },
    ConfirmationService,
    MessageService,
    providePrimeNG( {
      theme: {
        preset: Lara,
        options: {
          darkModeSelector: false
        }
      }
    } )
  ],
  bootstrap: [ AppComponent ],
} )
export class AppModule { }
