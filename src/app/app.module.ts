import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { GeocoderProvider } from '../providers/geocoder';
import { HTTPProvider } from '../providers/http';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    GeocoderProvider,
    HTTPProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
