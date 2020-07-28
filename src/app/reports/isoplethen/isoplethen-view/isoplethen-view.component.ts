import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Timespan, ApiV3Dataset, HelgolandServicesConnector, DatasetType, DatasetApiV3Connector, ApiV3InterfaceService } from '@helgoland/core';
import { DatasetImplApiV3InterfaceService } from '@sensorwapp-toolbox/core';

@Component({
  selector: 'wv-isoplethen-view',
  templateUrl: './isoplethen-view.component.html',
  styleUrls: ['./isoplethen-view.component.css']
})
/**
 * component to depict isoplthen diagram of profile datasets
 */
export class IsoplethenViewComponent implements OnInit, AfterViewInit {

  //timespan and id to calculate the isoplethen diagram for--> should be Input parameters
  timeSpan = new Timespan(new Date(2017, 12, 1).getTime(), new Date(2018, 11, 28).getTime());
  samplingId = '1223';
  public internalId = {
    id: this.samplingId,
    url: "http://192.168.101.105/sos3/api/"
  };
  public fixed: boolean = true;
  public even: boolean = false;
  //input parameters:
  private num_iso;
  private size_iso = 1; // Abstand zwischen Isolinien
  public selectMeasureParam: string = 'Sauerstoff [mg/l]';
  public dam_label = 'Dhünn-Talsperre';
  public samplingStationLabels = [];
  public measureParams = [];
  public selDate: Date[] = [];
  public autocontourPara = false;
  public defaultDate: Date = new Date(new Date().getFullYear() - 1, 0, 1);
  public showPlot: boolean = false;
  public samplingIds: string[] = [];
  public profileDataset: ApiV3Dataset;

  constructor(private datasetApi: DatasetImplApiV3InterfaceService, private api: ApiV3InterfaceService) {
    //observationType="profile"
    this.datasetApi.getTimeseries("http://192.168.101.105/sos2/api/v1/", { phenomenon: "6" }).subscribe((timeseries) => {
      timeseries.forEach((series) => {
        this.measureParams.push(series.label);
        this.samplingStationLabels.push(series.station.properties.label);
        this.samplingIds.push(series.id);
        console.log(this.samplingIds);
      });
    });
 
  }

  ngOnInit() {
    this.api.getDataset(this.internalId.id,this.internalId.url,{}).subscribe((data)=>{
      console.log(this.profileDataset);
      this.profileDataset = data;
    
    });
  }

  /**
   * set number of isolines and distance based on input parameters
   *  */ 
  public createIsoPlot() {
    this.num_iso = document.forms.item(1).elements["numIso"].value;
    this.size_iso = document.forms.item(3).elements["distIso"].value;

    if (this.showPlot) {

    } else {
      this.showPlot = !this.showPlot;
    }
  }

  /**
   * set optional choices parameter
   * */
  ngAfterViewInit(): void {

    document.forms.item(0).addEventListener("click", listener => {

      if (document.forms.item(0).elements["iso"].value == "fixed") {
        this.fixed = this.fixed;
        this.even = !this.fixed
        document.getElementById("numIso").setAttribute("disabled", "disabled");
        document.getElementById("distIso").removeAttribute("disabled");
        this.autocontourPara = !this.autocontourPara;
      }
      else {
        this.even = this.even;
        this.fixed = !this.even;
        document.getElementById("numIso").removeAttribute('disabled');
        document.getElementById("distIso").setAttribute("disabled", "disabled");
        this.autocontourPara = !this.autocontourPara;
      }
    });
   
  }

  
  /**
   * when the parameter is changed set new label. 
   * @param param new selected parameter from list
   */
  public changeMeasureParam(param: string) {
    this.selectMeasureParam = param;
    //TODO: replot graph
  }
  /**
   * change start date of diagram based on input
   * @param fromDate new Date
   */
  public changeFromDate(fromDate: Date) {
    this.defaultDate = fromDate;
    //TODO: replot graph
  }
  /**
   * change the selected station to calculate the diagram for
   * @param stat station object
   * @param index index of label
   */
  public changeSamplingStation(stat: string, index: number) {
    this.dam_label = this.samplingStationLabels[index];
    // this.samplingId =  this.samplingIds[index];
    // this.selectMeasureParam = this.measureParams[index];
  }
}
