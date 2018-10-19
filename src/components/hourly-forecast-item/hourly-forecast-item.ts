import { Component, Input } from '@angular/core';


@Component({
  selector: 'hourly-forecast-item',
  templateUrl: 'hourly-forecast-item.html'
})
export class HourlyForecastItemComponent {

  @Input('hourly') hourly: any;

  constructor() {}

}