import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Timespan } from '@helgoland/core';
import { DatasetImplApiV3InterfaceService } from '@sensorwapp-toolbox/core';

@Component({
  selector: 'wv-isoplethen-view',
  templateUrl: './isoplethen-view.component.html',
  styleUrls: ['./isoplethen-view.component.css']
})
export class IsoplethenViewComponent implements OnInit, AfterViewInit {

  timeSpan = new Timespan(new Date(2017, 12, 1).getTime(), new Date(2018, 11, 28).getTime());
  samplingId = '1223';

  public fixed: boolean = true;
  public even: boolean = false;
  //input parameters:
  private num_iso;
  private size_iso = 1; // Abstand zwischen Isolinien
  public selectMeasureParam: string = 'Sauerstoff [mg/l]';
  public dam_label = 'Bever-Talsperre';
  public samplingStationLabels = [];//['Dhünn-Talsperre', "Bever-Talsperre", "Brucher-Talsperre", "Lingese-Talsperre", "Panzer-Talsperre", "Wupper-Talsperre", "Ronsdorfer-Talsperre"]
  public measureParams = [];//['Sauerstoff [mg/l]', "Temperatur C°", "ph-Wert", "Chlorophyll [yg/l]", "Leitfähigkeit [yS/cm]", "Trübung [TEF]"];
  public selDate: Date[] = [];
  public autocontourPara = false;
  public defaultDate: Date = new Date(new Date().getFullYear() - 1, 0, 1);
  public showPlot: boolean = false;
  public samplingIds: string[] =[];

  constructor(private datasetApi: DatasetImplApiV3InterfaceService) {
    //obserationType="profile"
    this.datasetApi.getTimeseries("http://192.168.101.105/sos2/api/v1/",{phenomenon: "6"}).subscribe((timeseries)=>{
      timeseries.forEach((series)=>{
        this.measureParams.push(series.label);
        this.samplingStationLabels.push(series.station.properties.label);
        this.samplingIds.push(series.id);
      });
    });
   }

  ngOnInit() {
  }

  public createIsoPlot() {
    this.num_iso = document.forms.item(1).elements["numIso"].value;
    this.size_iso = document.forms.item(3).elements["distIso"].value;

    if(this.showPlot){

    }else{
      this.showPlot = !this.showPlot;
    }
  }


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
  public changeMeasureParam(param: string) {
    this.selectMeasureParam = param;

  }
  public changeFromDate(fromDate: Date) {
    this.defaultDate = fromDate;
  }
  public changeSamplingStation(stat: string, index: number) {
    this.dam_label = this.samplingStationLabels[index];
    // this.samplingId =  this.samplingIds[index];
    // this.selectMeasureParam = this.measureParams[index];
  }
}
