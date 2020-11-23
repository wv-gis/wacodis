import { Component, OnInit, AfterViewInit } from '@angular/core';
import Plotly from 'plotly.js-dist';
import { MapCache, LayerOptions } from '@helgoland/map';
import { HelgolandParameterFilter } from '@helgoland/core';
import * as L from 'leaflet';
import * as esri from 'esri-leaflet';

export interface StatisticTempData {
  date: Date;
  ts: string;
  temp: number;
}



@Component({
  selector: 'wv-soil-temperature-view',
  templateUrl: './soil-temperature-view.component.html',
  styleUrls: ['./soil-temperature-view.component.css']
})

/**
 * component to depict the results of soil temperature with diagrams and maps and sensor data
 */
export class SoilTemperatureViewComponent implements OnInit, AfterViewInit {


  public showZoomControl = true;
  public showAttributionControl = true;
  public map: L.Map;
  public mapId = 'soilTemp-map';

  public headers: string[] = [];
  public entries = [];
  public dataArr: string[];
  public responseInterp: string;
  public stats: StatisticTempData[] = [];
  public values: Date[] = [];
  public labels: number[] = [];
  public dates: Date[] = [];
  public selectedTime: Date = new Date();

  public providerUrl: string = 'https://www.fluggs.de/sos2-intern-gis/api/v1/';
  public fitBounds: L.LatLngBoundsExpression = [[50.985, 6.924], [51.319, 7.607]];
  public zoomControlOptions: L.Control.ZoomOptions = { position: 'topleft' };
  public avoidZoomToSelection = false;
  public baseMaps: Map<string, LayerOptions> = new Map<string, LayerOptions>();
  public layerControlOptions: L.Control.LayersOptions = { position: 'bottomleft' };
  public cluster = true;
  public loadingStations: boolean;
  public baselayers: L.Layer[] = [];
  public stationFilter: HelgolandParameterFilter = {
    phenomenon: '7'
  };
  public statusIntervals = false;
  public mapOptions: L.MapOptions = { dragging: true, zoomControl: false };
  sceneNum: number;
  public dyn: esri.DynamicMapLayer;
  selectedPics: string[] = [];

  constructor(private mapCache: MapCache) {
  }

  /**
   * add Layers and listeners to Map after Initialization
   */
  ngAfterViewInit(): void {

    this.map.on('click', this.identify, this);
    this.map.invalidateSize();
  }
  /**
    * identify pixel value at selected mouse position
    * 
    * @param e mouse event
    */
  private identify(e) {

    let popupText;
    this.dyn.identify().at(e.latlng).tolerance(1).on(this.map).run(function (err, data, resp) {

      if (resp.results.length > 0) {
        popupText = resp.results[0].attributes['Pixel Value'];

      }
    });
    this.dyn.bindPopup(function (l) { return L.Util.template('<p> ~' + Math.round(parseFloat(popupText)) + 'C° </p>', e.latlng) });
  }
  /**
   * set default layer and call create Basemap
   */
  ngOnInit() {
    this.dyn = esri.dynamicMapLayer({
      url: "https://gis.wacodis.demo.52north.org:6443/arcgis/rest/services/WaCoDiS/EO_WaCoDiS_Oberfl%C3%A4chentemperatur/MapServer", layers: [1], opacity: 0.8,
      className: 'Oberflächentemp'
    });
    this.dyn.metadata((err, dat) => {
      this.sceneNum = dat["layers"].length - 1;
      let array = dat["layers"];
      array.forEach((element, i, arr) => {
        if (i == 0) {

        } else {
          this.selectedPics.push(element.name);
        }

      });

    });

    this.createMap();


  }
  /**
   * create Basemap and call addLayers
   */
  private createMap() {
    this.map = L.map(this.mapId, this.mapOptions).setView([51.07, 7.22], 12);


    L.control.scale().addTo(this.map);
    this.mapCache.setMap(this.mapId, this.map);

    this.baselayers.push(this.dyn);

    this.addLayer();
  }
  /**
   * add Layers to mainMap
   */
  private addLayer() {
    this.map.addLayer(
      L.tileLayer.wms(
        'http://ows.terrestris.de/osm/service?',
        {
          layers: 'OSM-WMS', format: 'image/png', transparent: true, maxZoom: 16, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          className: 'OSM'
        }
      )
    );
     
    this.map.addLayer(this.dyn);
    this.map.invalidateSize();
  }
  /**
   * 
   * @param date selected date of layer in mainMap
   * date to visualize for diagram text
   */
  public onSubmitOne(date: number) {
 
    this.map.eachLayer((lay) => {
      lay.remove();
    });
    this.dyn = esri.dynamicMapLayer({
      url: "https://gis.wacodis.demo.52north.org:6443/arcgis/rest/services/WaCoDiS/EO_WaCoDiS_Oberfl%C3%A4chentemperatur/MapServer", layers: [date], opacity: 0.8,
      className: 'Oberflächentemp'
    })
    this.addLayer();


  }
  /**
   * plot Avg Temperature of  river dams in Pie chart
   */
  public createPieChart() {
    let csvInterArray = this.responseInterp.split(/\r\n|\n/);
    //Datum;Talsperre;AvgTemp
    let header = ['Datum', 'Talsperre', 'AvgTemp'];
    for (let j = 3; j < header.length; j++) {
      this.headers.push(header[j]);
    }
    for (let k = 4; k < csvInterArray.length; k++) {
      this.dataArr = csvInterArray[k].split(';'); // Zeilen
      let col = [];
      for (let i = 0; i < this.dataArr.length; i++) {
        col.push(this.dataArr[i]); //Spalten
      }
      this.entries.push(col);
    }
    for (let p = 0; p < this.entries.length; p++) {
      this.stats.push({
        date: new Date(this.entries[p][0].split('-')[0], this.entries[p][0].split('-')[1] - 1, this.entries[p][0].split('-')[2]),
        ts: this.entries[p][1],
        temp: this.entries[p][2],
      });
    }

    let trace = []

    var layout = {
      width: 600,
      height: 400,
      margin: { "t": 0, "b": 0, "l": 0, "r": 0 },
      showlegend: true,
      // title: 'Landbedeckung ' + this.selectedTime.toDateString(),
    }
    Plotly.newPlot('tempChart', trace, layout, { responsive: true })
  }
}