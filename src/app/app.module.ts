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
import { tokenInterceptor } from './shared/interceptors/token.interceptor';

registerLocaleData( es );

@NgModule( {
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    SharedModule
  ],
  providers: [
    provideHttpClient(
      withInterceptors( [ tokenInterceptor ] ),
    ),
    { provide: DATE_PIPE_DEFAULT_OPTIONS, useValue: { locale: 'es', dateFormat: 'medium', timezone: 'es-CO' } },
  ],
  bootstrap: [ AppComponent ],
} )
export class AppModule { }
