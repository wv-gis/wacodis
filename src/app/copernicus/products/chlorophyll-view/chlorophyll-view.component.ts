import { Component, OnInit } from '@angular/core';
import { DatasetImplApiV3InterfaceService } from '@sensorwapp-toolbox/core';
import { Timespan } from '@helgoland/core';

const watermask_Srvc ="https://services9.arcgis.com/GVrcJ5O2vy6xbu2e/arcgis/rest/services/watermask_S1_2019_06_2019_11/FeatureServer"


@Component({
  selector: 'wv-chlorophyll-view',
  templateUrl: './chlorophyll-view.component.html',
  styleUrls: ['./chlorophyll-view.component.css']
})
export class ChlorophyllViewComponent implements OnInit {
  public samplingStationLabels = [];
  public dam_label = 'Dhünn-Talsperre';
  public samplingIds: string[] =[];
  public defaultDate: Date = new Date(new Date().getFullYear() - 1, 0, 1);
  public  timeSpan = new Timespan(new Date(2017, 12, 1).getTime(), new Date(2018, 11, 28).getTime());
  public samplingId = '3142';

  constructor(private datasetApi: DatasetImplApiV3InterfaceService) { 
    // this.datasetApi.getTimeseries("http://192.168.101.105/sos3/api/",{phenomenon: "316"}).subscribe((timeseries)=>{
   
    //   timeseries.forEach((series)=>{
  
    //     // this.samplingStationLabels.push(series.feature.properties.label);
    //   this.samplingStationLabels.push(series.label);
    //     this.samplingIds.push(series.id);
    //   });
    // });
  }

  ngOnInit() {
    
  }
  public changeFromDate(fromDate: Date) {
    this.defaultDate = fromDate;
  }
  public changeSamplingStation(stat: string, index: number) {
    this.dam_label = this.samplingStationLabels[index];
    this.samplingId =  this.samplingIds[index];
    // this.selectMeasureParam = this.measureParams[index];
  }
}
