declare var require;
import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as esri from 'esri-leaflet';
import * as L from 'leaflet';
require('leaflet-timedimension');
import { MapCache } from '@helgoland/map';
import { ActivatedRoute } from '@angular/router';
import { D3PlotOptions, AdditionalData } from '@helgoland/d3';
import { Timespan, DatasetOptions, DatasetType, HelgolandServicesConnector } from '@helgoland/core';
import { CsvDataService } from 'src/app/settings/csvData.service';
import { AdditionalDataEntry } from '@helgoland/d3/lib/extended-data-d3-timeseries-graph/extended-data-d3-timeseries-graph.component';





const vitalityService = 'https://www.wms.nrw.de/umwelt/waldNRW';
const viewCenters: L.LatLngExpression[] = [[51.07, 7.22], [51.18, 7.31], [51.22, 7.27], [51.14, 7.51]]; // Dhuenn,Wupper, Herbring., Kerspe

@Component({
  selector: 'wv-vitality-view',
  templateUrl: './vitality-view.component.html',
  styleUrls: ['./vitality-view.component.css']
})

/**
 * component for visualization of Vitality data results with map and diagrams
 */
export class VitalityViewComponent implements OnInit, AfterViewInit {


  public datasetIdsMultiple = ['https://www.fluggs.de/sos2-intern/api/v1/__682'];
  public datasetIds = ['https://www.fluggs.de/sos2/api/v1/__426'];
  public d3Colors = ['#4682B4', '#DC143C'];
  // The timespan
  public timespan = new Timespan(new Date(2019, 0, 1).getTime(), new Date(2020, 0, 1).getTime());
  selectedPics: string[]=[];
  // These are the plotting options.
  public diagramOptionsD3: D3PlotOptions = {
    togglePanZoom: true,
    showReferenceValues: false,
    generalizeAllways: true
  };
  public options: DatasetOptions = {
    internalId: this.datasetIdsMultiple[0],
    color: this.d3Colors[1],
    type: 'bar',
    barPeriod: '',
    barStartOf: '',
    visible: true,
    showReferenceValues: [],
    lineDashArray: [],
    pointRadius: 0,
    pointBorderColor: '',
    pointBorderWidth: 0,
    lineWidth: 2
  };
  public options2: DatasetOptions = {
    internalId: this.datasetIds[0],
    color: this.d3Colors[0],
    type: 'bar',
    barPeriod: '',
    barStartOf: '',
    visible: true,
    showReferenceValues: [],
    lineDashArray: [],
    pointRadius: 0,
    pointBorderColor: '',
    pointBorderWidth: 0,
    lineWidth: 2, zeroBasedYAxis: true
  };
  // 'selectedIds' determines the graphs that are visualized with a larger stroke-width. 
  public selectedIds: string[] = [];
  public datasetOptionsMultiple: Map<string, DatasetOptions> = new Map();
  public datasetOptionsMultiple2: Map<string, DatasetOptions> = new Map();
  public showZoomControl = true;
  public showAttributionControl = true;
  public id = '426';
  public tempDayId = '758';
  public baselayers: L.Layer[] = [];
  public categoryVal = ["no Data", "unverändert", "gering", "mittel",
    "stark", "Zuwachs gering", "Zuwachs mittel", "Zuwachs stark"];
  public colors = ["rgb(0,0,0)", "rgb(255,215,0)", "rgb(184,134,11)", "rgb(65,105,225)", "rgb(30,144,255)",
    "rgb(190,190,190)", "rgb(192,255,62)",
  ];
  public loadingCounter = 0;
  public mainMap: L.Map;
  public mapId = 'vitality-map';
  public zoomControlOptions: L.Control.ZoomOptions = { position: 'topleft' };
  public avoidZoomToSelection = false;
  public layerControlOptions: L.Control.LayersOptions = { position: 'bottomleft' };
  public selectedTime: number = 1;
  public currentSelectedTimeL: Date = new Date();
  public showDiagram: boolean = false;
  public mapBounds: L.LatLngBounds;
  public service: string;
  public mapOptions: L.MapOptions = {
    dragging: true, zoomControl: true,
    // timeDimension: true, timeDimensionControl: true,
    // timeDimensionControlOptions: { timeZones: ['Local'] }
  };
  public providerUrl: string = 'https://www.fluggs.de/sos2-intern-gis/api/v1/';
  public avgMonthTemp_B: AdditionalDataEntry[] = [];
  public avgMonthTemp_D: AdditionalDataEntry[] = [];
  public avgMonthRain_B: AdditionalDataEntry[] = [];
  public avgMonthRain_D: AdditionalDataEntry[] = [];
  public responseInterp: string;
  public responseInterpDh: string;
  public InterArr: string[];
  public entries = [];
  public InterArrDh: string[];
  public entriesDh = [];
  public additionalDataRain: AdditionalData[] = [];
  public additionalDataTemp: AdditionalData[] = [];
  public dyn: esri.DynamicMapLayer;
  public moSum: AdditionalDataEntry[] = [];
  public divlongMo: AdditionalDataEntry[] = [];
  public tempId: string = '682';
  moSumTemp: AdditionalDataEntry[] = [];
  countValue: number[] = [];
  loadingCountT: number = 0;
  showDiagramR: boolean = false;
  sceneNum: number;

  constructor(private activatedRoute: ActivatedRoute, private mapCache: MapCache, private dataService: CsvDataService, private apiInterface: HelgolandServicesConnector) {
    this.service = vitalityService;

    this.responseInterp = dataService.getTempDhDataset();
    this.responseInterpDh = dataService.getRainDhDataset();
    this.getCsvData();
  }

  /**
   * add Layers and Listener to Map
   */
  ngAfterViewInit(): void {
 

    this.mainMap.on('moveend', this.changeBounds, this);
    this.mainMap.on('click', this.identify, this);

  }
  /**
   * identify pixel value at selected mouse position
   * 
   * @param e mouse event
   */
  private identify(e) {

    let popupText;
    this.dyn.identify().at(e.latlng).tolerance(1).on(this.mainMap).run(function (err, data, resp) {

      if (resp.results.length > 0) {
        popupText = resp.results[0].attributes['Pixel Value'];
    
        console.log(popupText);
      }
    });
    this.dyn.bindPopup(function (l) {return L.Util.template('<p> ~' + Math.round(parseFloat(popupText)*100) + '% </p>',e.latlng)});
  }

  /**
   * reset the map view on dam selected and set corresponding parameters 
   * @param TS selected dam
   */
  public resetMapView(TS: string) {
    if (TS == 'Dhuenn') {
      this.mainMap.setView(viewCenters[0], 13);
      this.mainMap.invalidateSize();
      this.mapBounds = this.mainMap.getBounds();
      this.id = '426';
      this.tempId = '682';
      this.tempDayId = '682';
      this.resetTempRainData();
      this.getCsvData();
      this.responseInterp = this.dataService.getTempDhDataset();
      this.responseInterpDh = this.dataService.getRainDhDataset();
    }
    else if (TS == 'Kerspe') {
      this.mainMap.setView(viewCenters[3], 13);
      this.mainMap.invalidateSize();
      this.mapBounds = this.mainMap.getBounds();
      this.id = '427';
      this.tempId = '751';
      this.responseInterp = this.dataService.getTempDatasetText();
      this.responseInterpDh = this.dataService.getRainDataset();
      this.resetTempRainData();
      this.getCsvData();
    }
    else if (TS == 'Herbringhauser') {
      this.mainMap.setView(viewCenters[2], 13);
      this.mainMap.invalidateSize();
      this.mapBounds = this.mainMap.getBounds();
      this.id = '427';
      this.tempId = '751';
      this.responseInterp = this.dataService.getTempDatasetText();
      this.responseInterpDh = this.dataService.getRainDataset();
      this.resetTempRainData();
      this.getCsvData();
    } else if (TS == 'Wupper') {
      this.mainMap.setView(viewCenters[1], 13);
      this.mainMap.invalidateSize();
      this.mapBounds = this.mainMap.getBounds();
      this.id = '427';
      this.tempId = '751';
      this.tempDayId = '758';
      this.responseInterp = this.dataService.getTempDatasetText();
      this.responseInterpDh = this.dataService.getRainDataset();
      this.resetTempRainData();
      this.getCsvData();
    } else {

    }

  }
/**
 * reset temp Data on input change
 */
  resetTempRainData(){
     
    this.additionalDataRain = [];
    this.avgMonthRain_D = [];
    this.avgMonthTemp_D =[];
    this.additionalDataTemp = [];
    this.InterArr =[];
    this.InterArrDh =[];
    this.moSum = [];
    this.moSumTemp = [];
    this.countValue = [];
    this.divlongMo =[];
    this.entries =[];
    this.entriesDh=[];
    this.showDiagram =false;
    this.showDiagramR = false;
  }
  /**
   * calculate monthly mean for temperature and rain data
   */
  public calculateMeanData() {

    this.apiInterface.getDatasets('https://fluggs.wupperverband.de/sos2-intern-gis/api/v1/', {
      type: DatasetType.Timeseries,
      expanded: true
    }).subscribe((data) => {
      data.forEach((val, i, arr) => {
        if (val.id == this.id) {

          for (let m = 0; m < 12; m++) {
            let sum = 0;
            let d = new Date(new Date(new Date().getFullYear() - 1, m + 1, 1).getTime() - 86400000).getDate();
            this.apiInterface.getDatasetData(val, new Timespan(new Date(new Date().getFullYear() - 1, m, 1), new Date(new Date().getFullYear() - 1, m, d))
            ).subscribe((dataset) => {
              dataset.values.forEach((v, i, arr) => {
                sum += v[1];
              });
            }, error => console.log(error), () => this.setMonthSum({ timestamp: new Date(new Date().getFullYear() - 1, m, 1).getTime(), value: sum }, m));
          }
        }
        else if (val.id == this.tempId) {
          for (let m = 0; m < 12; m++) {
            let sum = 0;
            let h;
            let d = new Date(new Date(new Date().getFullYear() - 1, m + 1, 1).getTime() - 86400000).getDate();
            this.apiInterface.getDatasetData(val, new Timespan(new Date(new Date().getFullYear() - 1, m, 1), new Date(new Date().getFullYear() - 1, m, d))
            ).subscribe((dataset) => {
              if (dataset.values.length) {
                dataset.values.forEach((v, i, arr) => {
                  sum += v[1];
                });
                h = dataset.values.length;
              }
            }, error => console.log(error), () => {
              if (h != undefined) {
                this.setMonthMeanTemp({ timestamp: new Date(new Date().getFullYear() - 1, m, 1).getTime(), value: sum }, m, h);
              } else {
                this.setMonthMeanTemp({ timestamp: new Date(new Date().getFullYear() - 1, m, 1).getTime(), value: undefined }, m, undefined);
              }
            }
            );
          }
        }
      //   else if(val.id == this.tempDayId){
      //    let values: AdditionalDataEntry[] =[];
      //     this.apiInterface.getDatasetData(val, new Timespan(new Date(new Date().getFullYear() - 1, 0, 1), new Date(new Date().getFullYear() - 1,11 ,31 ))
      //     ).subscribe((dataset) => {
      //       if (dataset.values.length) {
      //         dataset.values.forEach((v, i, arr) => {
      //           values.push({timestamp: v[0],value: v[1]});         
      //         });
              
      //       }
      //     },error => console.log(error),()=>this.setAvgDayTmp(values))
      //   }
       });
    }, error => console.log(error));
  }


  /**
   * calculate differnec of long term mean rainData per month
   * @param d data
   */
  public calculateRainDiff(d: AdditionalDataEntry[]) {

    d.forEach((dat, p, array) => {
      array[p].value = (dat.value - this.avgMonthRain_D[p].value);
      this.loadingCounter--;
    });
    const optionsDiff = new DatasetOptions('addData', 'blue');
    optionsDiff.pointRadius = 3;
    optionsDiff.yAxisRange = { max: 200, min: -100 };
    optionsDiff.type = 'bar';
    optionsDiff.barStartOf = 'month';
    optionsDiff.barPeriod = 'PT1M';
    optionsDiff.visible = true;
    optionsDiff.zeroBasedYAxis = false;
    optionsDiff.lineWidth = 1;

    this.additionalDataRain.push(
      {
        internalId: 'rainDiff',
        yaxisLabel: 'Abw. v. Mittel mm',
        datasetOptions: optionsDiff,
        data: d
      });
    this.showDiagramR = true;
  }


/**
 * set month sum and calculte rain difference to long term mean
 * @param d data
 * @param t index
 */
  public setMonthSum(d: AdditionalDataEntry, t: number) {
    this.moSum[t] = d;
    this.loadingCounter++;
    if (this.loadingCounter == 12) {
      this.calculateRainDiff(this.moSum);
    }
  }

  /**
   * set draw options for avg  day temperature
   */
  setAvgDayTmp(d: AdditionalDataEntry[]){
    const optionsTempVal = new DatasetOptions('addData', 'red');
    optionsTempVal.pointRadius = 3;
    optionsTempVal.yAxisRange = { max: 40, min: -40 };
    optionsTempVal.lineWidth = 1;
    optionsTempVal.type = 'line';
    optionsTempVal.visible = true;
    optionsTempVal.zeroBasedYAxis = true;

  
    // this.additionalDataTemp.push(
    //   {
    //     internalId: 'tempDay',
    //     yaxisLabel: 'Tagesmittel °C',
    //     datasetOptions: optionsTempVal,
    //     data: d
    //   });
      // this.showDiagram = true;
  }

  /**
   * calculate the mean temperature values and set the corresponding datasetOptions
   * @param d data
   * @param t index
   * @param x index
   */
  public setMonthMeanTemp(d: AdditionalDataEntry, t: number, x: number) {
    this.moSumTemp[t] = d;
    this.countValue[t] = x;
    this.loadingCountT++;
    let abwMonSum = [];
    if (this.loadingCountT == 12) {
      this.moSumTemp.forEach((a, b, c) => {
        if (c[b].value !== undefined && this.countValue[b] !== undefined) {
          abwMonSum.push({ value: Math.round((c[b].value / (this.countValue[b]))) - this.avgMonthTemp_D[b].value, timestamp: c[b].timestamp });
        } else {

        }
        this.loadingCountT--;
      });
      const optionsDiff = new DatasetOptions('addData', 'blue');
      // optionsDiff.pointRadius = 3;
      optionsDiff.yAxisRange = { max: 40, min: -40 };
      optionsDiff.type = 'bar';
      optionsDiff.barStartOf = 'month';
      optionsDiff.barPeriod = 'PT1M';
      optionsDiff.visible = true;
      optionsDiff.zeroBasedYAxis = false;
      // optionsDiff.lineWidth = 1;

      this.additionalDataTemp.push(
        {
          internalId: 'tempDiff',
          yaxisLabel: 'Abw. v. Mittel C°',
          datasetOptions: optionsDiff,
          data: abwMonSum
        });

      this.showDiagram = true;
    }
  }
  /**
   * receive datasets from csv and put it into the data format
   */
  private getCsvData() {
    // this.responseInterp.forEach(resp =>{
    this.calculateMeanData();
    let csvInterArray = this.responseInterp.split(/\r\n|\n/);

    for (let k = 1; k < csvInterArray.length; k++) {
      this.InterArr = csvInterArray[k].split(';'); // Zeilen
      let col = [];
      for (let i = 0; i < this.InterArr.length; i++) {
        col.push(this.InterArr[i]); //Spalten
      }
      this.entries.push(col);
    }
    const optionsT = new DatasetOptions('addData', 'orange');
    optionsT.pointRadius = 3;
    optionsT.yAxisRange = { max: 40, min: -40 };
    optionsT.lineWidth = 1;
    optionsT.type = 'line';
    optionsT.visible = true;
    optionsT.zeroBasedYAxis = true;
    for (let p = 0; p < this.entries.length; p++) {

      this.avgMonthTemp_D.push(
        {
          timestamp: new Date(new Date().getFullYear() - 1, 0 + p, 1).getTime(),
          value: parseFloat(this.entries[p][1])
        });
    }
    this.additionalDataTemp.push(
      {
        internalId: 'temp',
        yaxisLabel: 'Langj. Mittel °C',
        datasetOptions: optionsT,
        data: this.avgMonthTemp_D
      });



    let csvArray = this.responseInterpDh.split(/\r\n|\n/);

    for (let k = 1; k < csvArray.length; k++) {
      this.InterArrDh = csvArray[k].split(';'); // Zeilen
      let col = [];
      for (let i = 0; i < this.InterArr.length; i++) {
        col.push(this.InterArrDh[i]); //Spalten
      }
      this.entriesDh.push(col);
    }
    const optionsDh = new DatasetOptions('addData', 'orange');
    optionsDh.pointRadius = 3;
    optionsDh.yAxisRange = { max: 200, min: -100 };
    optionsDh.lineWidth = 1;
    optionsDh.type = 'line';
    optionsDh.visible = true;
    optionsDh.zeroBasedYAxis = true;
    for (let p = 0; p < this.entriesDh.length; p++) {

      this.avgMonthRain_D.push(
        {
          timestamp: new Date(this.entriesDh[p][0].split('.')[2], this.entriesDh[p][0].split('.')[1] - 1, this.entriesDh[p][0].split('.')[0]).getTime(),
          value: parseFloat(this.entriesDh[p][1])
        });
    }
    this.additionalDataRain.push(
      {
        internalId: 'rain',
        yaxisLabel: 'Langj. Mittel mm',
        datasetOptions: optionsDh,
        data: this.avgMonthRain_D
      });


  }
  /**
   * create default Layer and call createMap
   */
  ngOnInit() {

      this.dyn = esri.dynamicMapLayer({
      url: "https://gis.wacodis.demo.52north.org:6443/arcgis/rest/services/WaCoDiS/Vegetationsdichte_2020_Forst/MapServer", layers: [0,1], opacity: 0.8,
       className: 'Waldvital2018-2019' 
    });
    this.dyn.metadata((err,dat)=>{
     this.sceneNum= dat["layers"].length-1;
     let array =dat["layers"];
     array.forEach((element,i,arr) => {
       if(i==0){

       }else{
        this.selectedPics.push(element.name);
       }
      
     }); 
    
    });

    this.createMap();
   
  }
  /**
   * create Map element and call addLayers afterwards
   */
  private createMap(){

    this.mainMap = L.map(this.mapId, this.mapOptions).setView([51.07, 7.22], 13);


    L.control.scale().addTo(this.mainMap);
    this.mapCache.setMap(this.mapId, this.mainMap);
    this.mapBounds = this.mainMap.getBounds();
    this.baselayers.push(this.dyn);

    this.addLayers();

  }
  /**
   * add Layers to map
   */
  private addLayers(){

    this.mainMap.addLayer(L.tileLayer.wms(
      'http://ows.terrestris.de/osm/service?',
      {
        layers: 'OSM-WMS', format: 'image/png', transparent: true, maxZoom: 16, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        className: 'OSM'
      }
    ));

    this.mainMap.addLayer(this.dyn);
  }
  /**
    * set MapBounds depending on scroll and drag Movements
    */
  public changeBounds() {
    this.mapBounds = this.mainMap.getBounds();
  }
  /**
   * 
   * @param num 
   * define the selected index of dates of the sentinellayer on Selection
   * in MainMap
   */
  public setSelectedTime(num: number) {
    this.selectedTime = num;
  }

  /**
   * 
   * @param date selected date of layer in mainMap
   * date to visualize for diagram text
   */
  public onSubmitOne(date: number) {
    // this.currentSelectedTimeL = date;
   
    this.mainMap.eachLayer((lay)=>{
      lay.remove();
    });
    this.dyn = esri.dynamicMapLayer({
      url: "https://gis.wacodis.demo.52north.org:6443/arcgis/rest/services/WaCoDiS/Vegetationsdichte_2020_Forst/MapServer", layers: [0,date], opacity: 0.8,
       className: 'Waldvital2018-2019' 
    });
    this.addLayers();
  }

  /**
   * changes the timespan of the graph 
   * @param timespan timespan to change to
   */
  public timespanChanged(timespan: Timespan) {
    this.timespan = timespan;
  }
}