import { Injectable } from '@angular/core';


@Injectable()
export class LocationProvider {


  getLocation() {
    return new Promise((resolve) => {
      var options = {
        timeout: 10000,
        enableHighAccuracy: true
      };
  
      if (window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve(position);
          }, (error) => {
            console.log('Geolocation error: ', error);
          }, options);
        } else {
          console.log('Geolocation not supported in this browser');
        }
    });
  }

}
