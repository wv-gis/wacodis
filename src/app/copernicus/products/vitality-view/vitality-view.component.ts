declare var require;
import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as esri from 'esri-leaflet';
import * as L from 'leaflet';
require('leaflet-timedimension');
import { MapCache } from '@helgoland/map';
import { ActivatedRoute } from '@angular/router';
import { D3PlotOptions, AdditionalData } from '@helgoland/d3';
import { Timespan, DatasetOptions, DatasetService } from '@helgoland/core';
import { CsvDataService } from 'src/app/settings/csvData.service';
import { AdditionalDataEntry } from '@helgoland/d3/lib/extended-data-d3-timeseries-graph/extended-data-d3-timeseries-graph.component';


const vitalityService = 'https://www.wms.nrw.de/umwelt/waldNRW';
const viewCenters: L.LatLngExpression[] = [[51.07, 7.22],[51.18,7.31],[51.22,7.27],[51.14,7.51]]; // Dhuenn,Wupper, Herbring., Kerspe

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

  public baselayers: L.Layer[] = [];
  public categoryVal = ["no Data", "unverändert", "gering", "mittel",
    "stark", "Zuwachs gering", "Zuwachs mittel", "Zuwachs stark"];
  public colors = ["rgb(0,0,0)", "rgb(255,215,0)", "rgb(184,134,11)", "rgb(65,105,225)", "rgb(30,144,255)",
    "rgb(190,190,190)", "rgb(192,255,62)",
  ];

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

  constructor(private activatedRoute: ActivatedRoute, private mapCache: MapCache, private dataService: CsvDataService) {
    this.service = vitalityService;
    this.datasetIdsMultiple.forEach((entry, i) => {
      let options = new DatasetOptions(entry, this.d3Colors[1]);
      options.type = 'line';
      options.yAxisRange = { max: 40, min: 0 };
      this.datasetOptionsMultiple.set(entry, options);
    });
    this.datasetIds.forEach((entry, i) => {
      let options = new DatasetOptions(entry, this.d3Colors[i]);
      options.type = 'line';
      options.yAxisRange = { max: 200, min: 0 };
      this.datasetOptionsMultiple2.set(entry, options);
    });

    this.responseInterp = dataService.getTempDhDataset();
    this.responseInterpDh = dataService.getRainDhDataset();
    this.getCsvData();
  }

  /**
   * add Layers and Listener to Map
   */
  ngAfterViewInit(): void {
    this.baselayers.forEach((lay, i, arr) => {
      this.mapCache.getMap(this.mapId).addLayer(lay);
    });

    this.mainMap.on('moveend', this.changeBounds, this);
    this.mainMap.on('click', this.identify, this);

  }
  private identify(e) {

    this.dyn.identify().at(e.latlng).tolerance(1).on(this.mainMap).run(function (err, data, resp) {

      if (resp.results.length > 0) {
        var popupText = resp.results[0].attributes['Pixel Value'];
        console.log(popupText);
      }
    });
  }

  /**
   * 
   * @param TS 
   */
  public resetMapView(TS: string){
    if(TS =='Dhuenn'){
      this.mainMap.setView(viewCenters[0],13);
      this.mainMap.invalidateSize();
      this.mapBounds = this.mainMap.getBounds();
    
    }
    else if(TS == 'Kerspe'){
      this.mainMap.setView(viewCenters[3],13);
      this.mainMap.invalidateSize();
      this.mapBounds = this.mainMap.getBounds();
    }
    else if(TS == 'Herbringhauser'){
      this.mainMap.setView(viewCenters[2],13);
      this.mainMap.invalidateSize();
      this.mapBounds = this.mainMap.getBounds();
    }else if(TS =='Wupper'){
      this.mainMap.setView(viewCenters[1],13);
      this.mainMap.invalidateSize();
      this.mapBounds = this.mainMap.getBounds();
    }else{
      console.log(TS);
    }
 
  }

  /**
   * receive datasets from csv and put it into the data format
   */
  private getCsvData() {
    // this.responseInterp.forEach(resp =>{

    let csvInterArray = this.responseInterp.split(/\r\n|\n/);

    for (let k = 1; k < csvInterArray.length; k++) {
      this.InterArr = csvInterArray[k].split(';'); // Zeilen
      let col = [];
      for (let i = 0; i < this.InterArr.length; i++) {
        col.push(this.InterArr[i]); //Spalten
      }
      this.entries.push(col);
    }
    const options = new DatasetOptions('addData', 'green');
    options.pointRadius = 3;
    options.yAxisRange = { max: 200, min: 0 };
    options.lineWidth = 1;
    options.type = 'line';
    options.visible = true;
    options.zeroBasedYAxis = true;
    for (let p = 0; p < this.entries.length; p++) {

      this.avgMonthRain_B.push(
        {
          timestamp: new Date(new Date().getFullYear() - 1, 0 + p, 1).getTime(),
          value: parseFloat(this.entries[p][1])
        });
    }
    this.additionalDataTemp.push(
      {
        internalId: 'temp',
        yaxisLabel: 'Langj. Mittel °C',
        datasetOptions: options,
        data: this.avgMonthRain_B
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
    const optionsDh = new DatasetOptions('addData', 'green');
    optionsDh.pointRadius = 3;
    options.yAxisRange = { max: 40, min: 0 };
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
   * create default Map and Layers
   */
  ngOnInit() {

    this.mainMap = L.map(this.mapId, this.mapOptions).setView([51.07, 7.22], 13);

    // this.mainMap.timeDimension.setCurrentTime(new Date().getTime());

    L.control.scale().addTo(this.mainMap);
    this.mapCache.setMap(this.mapId, this.mainMap);
    this.mapBounds = this.mainMap.getBounds();

    this.mainMap.addLayer(L.tileLayer.wms(
      'http://ows.terrestris.de/osm/service?',
      {
        layers: 'OSM-WMS', format: 'image/png', transparent: true, maxZoom: 16, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        className: 'OSM'
      }
    ));
    // this.baselayers.push(L.tileLayer.wms(vitalityService,
    //   {
    //     layers: 'nadelwald_06_2017_09_2018', format: 'image/png', transparent: true, maxZoom: 16, minZoom: 11, attribution: 'Datenlizenz Deutschland – Namensnennung – Version 2.0',
    //     className: 'nadel_2017_2018'
    //   })
    // );

    this.dyn = esri.dynamicMapLayer({
      url: "https://gis.wacodis.demo.52north.org:6443/arcgis/rest/services/WaCoDiS/WPSErgebnis_Vital_Sealing/MapServer", layers: [1], opacity: 1, className: 'Waldvital2018-2019'
    });
    this.baselayers.push(this.dyn);



    // let testTimeLayer = L.timeDimension.layer.wms(L.tileLayer.wms("https://maps.dwd.de/geoserver/ows",
    //   {
    //     layers: 'dwd:RX-Produkt', format: 'image/png', transparent: true
    //   }), {
    //   updateTimeDimension: true, getCapabilitiesLayerName: 'dwd:RX-Produkt', getCapabilitiesUrl: "https://maps.dwd.de/geoserver/ows"
    // });
    
    //   let secTimeLayer = L.timeDimension.layer.wms(L.tileLayer.wms("https://gis.wacodis.demo.52north.org:6443/arcgis/services/WaCoDiS/EO_WACODIS_DAT_INTRA_LAND_COVER_CLASSIFICATION_Service/ImageServer/WMSServer",
    //   {
    //     layers: 'EO_WACODIS_DAT_INTRA_LAND_COVER_CLASSIFICATION_Service:None', format: 'image/png', transparent: true
    //   }),{ updateTimeDimensionMode: 'union',setDefaultTime: true,
    //    updateTimeDimension: true, getCapabilitiesLayerName: 'EO_WACODIS_DAT_INTRA_LAND_COVER_CLASSIFICATION_Service:None', getCapabilitiesUrl: "https://maps.dwd.de/geoserver/ows" });
    // this.baselayers.push(secTimeLayer);

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
  public setSelectedCurrentTimeLeft(date: Date) {
    this.currentSelectedTimeL = date;
  }
  
  /**
   * changes the timespan of the graph 
   * @param timespan timespan to change to
   */
  public timespanChanged(timespan: Timespan) {
    this.timespan = timespan;
  }
}