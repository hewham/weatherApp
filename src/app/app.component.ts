import { Component } from '@angular/core';

import { GeocoderProvider } from '../providers/geocoder';
import { HTTPProvider } from '../providers/http';


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
  switch = "0";
  degreesType = "F";

  constructor( private geocoderProvider: GeocoderProvider, private httpProvider: HTTPProvider) {
    this.init();
  }

  async init(){
    // this.location = await this.getLocation();
    console.log("this.location returned as: ",this.currentLocation);

  }



  getLocation() {
    return new Promise((resolve) => {
      console.log("getLocation()");
      var options = {
        timeout: 10000,
        enableHighAccuracy: true
      };
  
      if (window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log('got location : ', position);
            resolve(position);
          }, (error) => {
            console.log('Geolocation error: ', error);
          }, options);
        } else {
          console.log('Geolocation not supported in this browser');
        }
    });

  }

  async getWeather(){
    var lat = 35;
    var lng = 42;
    var url = "https://api.openweathermap.org/data/2.5/weather?lat="+String(lat)+"&lon="+String(lng)+"&APPID="+String(this.weatherAppId);
    
    this.currentLocation = await this.geocoderProvider.reverseGeocoder(lat, lng);
    console.log("LOCATION: ",this.currentLocation);
    this.currentTempJSON = await this.httpProvider.httpWeatherCall(url);
    console.log(this.currentTempJSON);
    this.currentTempTrueK = this.currentTempJSON.main.temp;
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


}
