import { Injectable } from '@angular/core';


@Injectable()
export class HTTPProvider {

  httpWeatherCall(url) {
    return new Promise((resolve) => {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function() { 
          if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            resolve({
              error: false, 
              response: JSON.parse(xmlHttp.responseText)
            });

          }else{
            // throw new Error(xmlHttp.responseText);
            // resolve({error: true, errorText: xmlHttp.responseText});
          }
      }
      xmlHttp.open("GET", url, true);
      xmlHttp.send();
    });
  }


}