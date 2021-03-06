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
  forecast = [];
  switch = 0;
  degreesType = "F";
  lat = 42.3314;
  lng = -83.0458;
  isLoading: boolean = true;
  searchLocation: any;

  constructor( private geocoderProvider: GeocoderProvider, private httpProvider: HTTPProvider, private locationProvider: LocationProvider) {
    this.init();
  }

  async init(){
    this.isLoading = true;
    await this.getLocation();
    console.log("Lat: ", this.lat);

    await this.getTemp();
    await this.get5day();
    this.isLoading = false;
  }


  async getLocation(){
    return new Promise(async (resolve) => {
      this.currentLocation = await this.locationProvider.getLocation();
      if(this.currentLocation == "error"){
        await this.promptForLocation();
      }else{
        this.lat = this.currentLocation.coords.latitude;
        this.lng = this.currentLocation.coords.longitude;
        this.currentLocation = await this.geocoderProvider.reverseGeocoder(this.lat, this.lng);
      }
      resolve();
    });
  }

  async promptForLocation(){
    return new Promise(async (resolve) => {
      var inputLocation = prompt("Couldn't detect your location, please enter one.", "Detroit, MI");
      await this.askForLocation(inputLocation);
      resolve();
    });
  }

  async askForLocation(inputLocation){
    console.log("askForLocation(): ",inputLocation);
    return new Promise((resolve) => {
      this.geocoderProvider.geocoder(inputLocation).then((loc : any) => {
        // this.currentLocation = loc;
        console.log("LOC: ", loc);
        if(loc == "ERROR"){
          console.log("ask for location returns error");
          // this.recheck("Error detecting location");
          // this.recheck();
          resolve();
        }
        this.currentLocation = loc;
        this.lat = loc.latitude;
        this.lng = loc.longitude;
        resolve();
      })
    });
  }

  async getTemp(){
    var url = "https://api.openweathermap.org/data/2.5/weather?lat="+String(this.lat)+"&lon="+String(this.lng)+"&APPID="+String(this.weatherAppId);
    
    var currentTempJSON = <any>{};
    try{
      currentTempJSON = await this.httpProvider.httpWeatherCall(url);
    }
    catch(err){
      console.log("catch err: ",err);
    }

    
    // if(currentTempJSON.error){
    //   // this.recheck(currentTempJSON.errorText);
    //   this.recheck();
    //   return;
    // }

    this.currentTempTrueK = currentTempJSON.response.main.temp;
    if(this.switch == 0){
      document.getElementById("weather-container").classList.remove("hidden");
    }
    this.switchDegrees('F');
    return;
  }



  async get5day(){
    var url = "https://api.openweathermap.org/data/2.5/forecast?lat="+String(this.lat)+"&lon="+String(this.lng)+"&APPID="+String(this.weatherAppId);
    
    var returnForecast = <any>{};
    returnForecast = await this.httpProvider.httpWeatherCall(url);
    if(returnForecast.error){
      this.recheck();
      // this.recheck(returnForecast.errorText);
      return;
    }

    var day = new Date();
    var i = 0;
    var onDay = 0;
    var limit = 5;

    //BUILD FORECAST ARRAY OF ARRAYS - CONTAINS DAYS WHICH CONTAIN HOURLY FORECASTS
    for (let hourly of returnForecast.response.list){
      // CHECKS FOR NEW DAY

      if((i===0 || day.getDate() !== new Date(hourly.dt_txt).getDate())){
        day = new Date(hourly.dt_txt);
        if(i!==0){
          onDay++;
        }
        if(onDay >= limit){
          break;
        }


        this.forecast.push({});

        i = 0;
        this.forecast[onDay].date = day;
        this.forecast[onDay].list = [];
      }

      // ADDS HOURLY FORECAST TO DAY
      this.forecast[onDay].list.push(hourly);
      this.forecast[onDay].list[i].iconUrl = "http://openweathermap.org/img/w/"+hourly.weather[0].icon+".png"
      this.forecast[onDay].list[i].temp = Math.floor((hourly.main.temp * (9/5) - 459.67) * 10)/10;
      this.forecast[onDay].list[i].description = hourly.weather[0].description;
      i++;
    }
    return;
  }



  async recheck(){
    // console.log("ERRORTEXT: ",errorText);
    // var searchLocation = document.getElementById("location-input").value;
    var errorMessage = "";
    // if(errorText){
    //   errorMessage = "ERROR: "+errorText;
    // }
    var inputLocation = prompt(`Look for a new location, please enter one. RECHECK()`+errorMessage, "Detroit, MI");
    this.isLoading = true;
    await this.askForLocation(inputLocation);
    await this.getTemp();
    await this.get5day();
    this.isLoading = false;

  }

  switchDegrees(type){
    if(type == "F"){
      this.currentTemp = Math.floor((this.currentTempTrueK * (9/5) - 459.67) * 10)/10;
    }else if(type == "C"){
      this.currentTemp = Math.round((this.currentTempTrueK - 273) * 10)/10;
    }else if(type == "K"){
      this.currentTemp = Math.round(this.currentTempTrueK * 10)/10;
    }
    if(this.switch == 0){
      document.getElementById("button-"+this.degreesType).classList.remove("active");
      document.getElementById("button-"+type).classList.add("active");
    }
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
