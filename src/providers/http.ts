import { Injectable } from '@angular/core';


@Injectable()
export class HTTPProvider {

  httpWeatherCall(url) {
    return new Promise((resolve) => {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function() { 
          if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            resolve(JSON.parse(xmlHttp.responseText));
          }
      }
      xmlHttp.open("GET", url, true);
      xmlHttp.send();
    });
  }


}