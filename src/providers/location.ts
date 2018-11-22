import { Injectable } from '@angular/core';


@Injectable()
export class LocationProvider {
  options = {
    timeout: 10000,
    enableHighAccuracy: true
  };


  getLocation() {
    return new Promise((resolve) => {

      if (window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve(position);
          }, (error) => {
            console.log('Geolocation error: ', error);
            // throw new TypeError('Geolocation error: '+ error);
            resolve("error");
          }, this.options);
        } else {
          console.log('Geolocation not supported in this browser');
          // throw new TypeError('Geolocation not supported in this browser');
          resolve("error");
        }
    });
  }

}
