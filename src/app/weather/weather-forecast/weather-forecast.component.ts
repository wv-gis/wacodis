import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'wv-weather-forecast',
  templateUrl: './weather-forecast.component.html',
  styleUrls: ['./weather-forecast.component.css']
})
export class WeatherForecastComponent implements OnInit {


  public selected = 'windy';
  constructor() { }

  ngOnInit() {
  }
  public setView(selectedView: string) {
    this.selected = selectedView;
  }
  public checkView(selectedView: string) {
    if (this.selected == selectedView) {
      return true;
    }
    else {
      return false;
    }
  }
}
