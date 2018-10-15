import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { GeocoderProvider } from '../providers/geocoder';
import { HTTPProvider } from '../providers/http';
import { LocationProvider } from '../providers/location';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    GeocoderProvider,
    HTTPProvider,
    LocationProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
