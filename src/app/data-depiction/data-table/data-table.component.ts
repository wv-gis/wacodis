import { Component, OnInit } from '@angular/core';
import { Timespan, DatasetOptions } from '@helgoland/core';
import { DatasetEmitService } from '../../services/dataset-emit.service';

@Component({
  selector: 'wv-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {
  public datasetIds = [
    // 'http://sensorweb.demo.52north.org/sensorwebtestbed/api/v1/__95',
    // 'http://sensorweb.demo.52north.org/sensorwebtestbed/api/v1/__96',
    // 'http://geo.irceline.be/sos/api/v1/__6941',
    // 'http://sensorweb.demo.52north.org/sensorwebtestbed/api/v1/__97'
  ];

  // timeframe for which data should be fetchedin table
  public timespan = new Timespan(new Date().getTime() - 100000000, new Date().getTime());
  public isActive = true;
  public datasetOptions: Map<string, DatasetOptions> = new Map();
  constructor(private dataEmitService: DatasetEmitService) {
    if (dataEmitService && dataEmitService.hasDatasets()) {
      for (let k = 0; k < dataEmitService.datasetIds.length; k++) {
        this.datasetIds.push(dataEmitService.datasetIds[k]);
      }
    }


    let i = 0;
    //sets color to the datasetOptions
    const colors = ['firebrick', 'yellow', 'darkgreen', 'lightblue'];
    this.datasetIds.forEach((entry) => {
      this.datasetOptions.set(entry, new DatasetOptions(entry, colors[i++]));
    });
  }

  ngOnInit() {
  }
  timespanChanged(time: Timespan) {
    this.timespan = time;
  }

  menuIsActive(){
    if(this.isActive){
      //if(document.getElementById('datasetMenu').getElementsByClassName('selectedDataset').item(0).className.endsWith('active')){
      this.isActive = false;
      return false;
    }
    else{
      this.isActive = true;
      return true;
    }
  }
}
