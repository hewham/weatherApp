import { Component } from '@angular/core';

import { GeocoderProvider } from '../providers/geocoder';
import { HTTPProvider } from '../providers/http';
import { LocationProvider } from '../providers/location';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  currentLocation = <any>{};
  weatherAppId = "f4e684c62746716f90ffa981c9a5306d";
  currentTempTrueK = 0;
  currentTemp = 0;
  currentTempJSON = <any>{};
  switch = 0;
  degreesType = "F";
  lat = 42.3314;
  lng = -83.0458;
  isLoading: boolean = true;

  constructor( private geocoderProvider: GeocoderProvider, private httpProvider: HTTPProvider, private locationProvider: LocationProvider) {
    this.init();
  }

  async init(){
    this.isLoading = true;
    await this.getLocation();
    await this.getWeather();
  }

  async getLocation(){
    this.currentLocation = await this.locationProvider.getLocation();
    if(this.currentLocation == "error"){
      await this.askForLocation();
    }else{
      this.lat = this.currentLocation.coords.latitude;
      this.lng = this.currentLocation.coords.longitude;
      this.currentLocation = await this.geocoderProvider.reverseGeocoder(this.lat, this.lng);
    }
    return;
  }

  async askForLocation(){
    var inputLocation = prompt("Couldn't detect your location, please enter one.", "Detroit, MI");
    this.currentLocation = await this.geocoderProvider.geocoder(inputLocation);
    this.lat = this.currentLocation.latitude;
    this.lng = this.currentLocation.longitude;
    return;
  }

  async getWeather(){
    var url = "https://api.openweathermap.org/data/2.5/weather?lat="+String(this.lat)+"&lon="+String(this.lng)+"&APPID="+String(this.weatherAppId);
    
    this.currentTempJSON = await this.httpProvider.httpWeatherCall(url);
    this.currentTempTrueK = this.currentTempJSON.main.temp;
    document.getElementById("weather-container").classList.remove("hidden");
    this.isLoading = false;
    this.switchDegrees('F');

  }



  switchDegrees(type){
    if(type == "F"){
      this.currentTemp = Math.floor((this.currentTempTrueK * (9/5) - 459.67) * 10)/10;
    }else if(type == "C"){
      this.currentTemp = Math.round((this.currentTempTrueK - 273) * 10)/10;
    }else if(type == "K"){
      this.currentTemp = Math.round(this.currentTempTrueK * 10)/10;
    }
    document.getElementById("button-"+this.degreesType).classList.remove("active");
    document.getElementById("button-"+type).classList.add("active");
    this.degreesType = type;
  }

  changeSwitch(changeTo){
    if(changeTo == 0){
      document.getElementById("button-temp").classList.add("active");
      document.getElementById("button-5day").classList.remove("active");
    }else if(changeTo == 1){
      document.getElementById("button-temp").classList.remove("active");
      document.getElementById("button-5day").classList.add("active");
    }
    this.switch = changeTo;
  }


}
