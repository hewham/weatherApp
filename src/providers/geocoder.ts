import { Injectable } from '@angular/core';

declare var google;


@Injectable()
export class GeocoderProvider {


  reverseGeocoder(lat, lng){
    //get detailed loc data from lat lng
    return new Promise((resolve) => {
      // console.log("IN REVERSEGEOCODER");
       var geocoder = new google.maps.Geocoder();
       var latlng = new google.maps.LatLng(lat, lng);
       var request = {
         latLng: latlng
       };
       geocoder.geocode(request, function(data, status) {
         var location = <any>{};
         if (status == google.maps.GeocoderStatus.OK) {
           if (data[0] != null) {
             var components = data[0].address_components;
             // console.log("address is: " + data[0].formatted_address);
             location.address = data[0].formatted_address;
             for(var component of components){
               if(component.types[0] == 'route'){
                 location.street = component.long_name;
               }
               if(component.types[0] == 'street_number'){
                 location.streetNumber = component.long_name;
               }
               if(component.types[0] == 'locality'){
                 location.city = component.long_name;
               }
               if(component.types[0] == 'sublocality'){
                 location.subcity = component.long_name;
               }
               if(component.types[0] == 'neighborhood'){
                 location.neighborhood = component.long_name;
               }
               if(component.types[0] == 'administrative_area_level_1'){
                 location.state = component.short_name;
               }
               if(component.types[0] == 'administrative_area_level_2'){
                 location.county = component.short_name;
               }
               if(component.types[0] == 'country'){
                 location.country = component.long_name;
                 location.countryShort = component.short_name;
               }
               if(component.types[0] == 'postal_code'){
                 location.zipcode = component.long_name;
               }
             }
             location.latitude = lat;
             location.longitude = lng;
             resolve(location);
           } else {
             console.log("No address available");
           }
         }
        //  this.loc_info = [street, street_num, city, state, country, countryShort, zip_code];
       });
      });
     }


  geocoder(loc){
    //Get lat lng, detailed info from general location
    return new Promise((resolve) => {
      // console.log("IN GOOGLE GEOCODER");
       var geocoder = new google.maps.Geocoder();
       var request = {
         address: loc
       };
       geocoder.geocode(request, function(data, status) {
         var location = <any>{};
         // location = loc;
         if (status == google.maps.GeocoderStatus.OK) {
           if (data[0] != null) {
             location.latitude = data[0].geometry.location.lat();
             location.longitude = data[0].geometry.location.lng();
             var components = data[0].address_components;
             // console.log("address is: " + data[0].formatted_address);
             location.address = data[0].formatted_address;
             for(var component of components){
               if(component.types[0] == 'route'){
                 location.street = component.long_name;
               }
               if(component.types[0] == 'street_number'){
                 location.streetNumber = component.long_name;
               }
               if(component.types[0] == 'locality'){
                 location.city = component.long_name;
               }
               if(component.types[0] == 'sublocality'){
                 location.subcity = component.long_name;
               }
               if(component.types[0] == 'neighborhood'){
                 location.neighborhood = component.long_name;
               }
               if(component.types[0] == 'administrative_area_level_1'){
                 location.state = component.short_name;
               }
               if(component.types[0] == 'administrative_area_level_2'){
                 location.county = component.short_name;
               }
               if(component.types[0] == 'country'){
                 location.country = component.long_name;
                 location.countryShort = component.short_name;
               }
               if(component.types[0] == 'postal_code'){
                 location.zipcode = component.long_name;
               }
             }
             resolve(location);
           } else {
             console.log("No address available");
           }
         }
       });
      });
     }

}