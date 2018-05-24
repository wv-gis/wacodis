import { Component, OnInit } from '@angular/core';
import { Timespan, DatasetOptions } from '@helgoland/core';

@Component({
  selector: 'wv-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {
  public datasetIds = [
    'http://sensorweb.demo.52north.org/sensorwebtestbed/api/v1/__95',
    'http://sensorweb.demo.52north.org/sensorwebtestbed/api/v1/__96',
    'http://geo.irceline.be/sos/api/v1/__6941',
    'http://sensorweb.demo.52north.org/sensorwebtestbed/api/v1/__97'
  ];

  // timeframe for which data should be fetchedin table
  public timespan = new Timespan(
    new Date('2017-10-24T01:49:59.000Z').getTime(),
    new Date('2017-10-25T01:49:59.000Z').getTime()
  );

  public datasetOptions: Map<string, DatasetOptions> = new Map();
  constructor() {
    let i = 0;
    //sets color to the datasetOptions
    const colors = ['firebrick', 'yellow', 'darkgreen', 'lightblue'];
    this.datasetIds.forEach((entry) => {
      this.datasetOptions.set(entry, new DatasetOptions(entry, colors[i++]));
    });
   }

  ngOnInit() {
  }

}
