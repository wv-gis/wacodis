import { Component, OnInit, AfterViewInit } from '@angular/core';
// import Map from 'ol/Map.js';
// import BaseLayer from 'ol/layer/Base';
// import Layer from 'ol/layer/Layer';
// import { Tile } from 'ol/layer';
// import { OSM, TileWMS, ImageWMS, ImageArcGISRest } from 'ol/source';
// import * as esri from 'esri-leaflet';
// import { RequestTokenService } from 'src/app/services/request-token.service';
// import { OlMapService } from '@helgoland/open-layers';
// import ImageLayer from 'ol/layer/Image';
// import { CsvDataService } from 'src/app/settings/csvData.service';
import Plotly from 'plotly.js-dist';
// import { ScaleLine } from 'ol/control';
import { MapCache, LayerOptions } from '@helgoland/map';
import { ParameterFilter, Station } from '@helgoland/core';
import * as L from 'leaflet';
import * as esri from 'esri-leaflet';
const waterTempService = 'https://gis.wacodis.demo.52north.org:6443/arcgis/rest/services/WaCoDiS/EO_WACODIS_DAT_WATER_SURFACE_TEMPERATURE_Service/ImageServer';
const WvG_URL = 'http://fluggs.wupperverband.de/secman_wss_v2/service/WMS_WV_Oberflaechengewaesser_EZG/guest?';

export interface StatisticTempData{
  date: Date;
  ts: string;
  temp: number;
}

const categoryVal = ["BB0", "BE0", "BE1", "BE2",
"BE3", "BE4", "BE5", "BR0",
"DA0", "DH0", "DH10", "DH11", "DH12",
"DH13", "DH14", "DH15", "DH16", "DH17",
"DH1", "DH2", "DH2", "DH3",
"DH4", "DH5", "DH6","DH7", "DH8","DH9","Diep0","Esch0","Herb0","Herb1","Kers0","Kers1", "Kers2","Kers3","Kers4","Kers5",
"LI0", "NE0", "PA0", "PA1","RO0","SC0","Seng0","Seng1","WU0","WU1","WU2","WU3","WU4","WU5"];

@Component({
  selector: 'wv-soil-temperature-view',
  templateUrl: './soil-temperature-view.component.html',
  styleUrls: ['./soil-temperature-view.component.css']
})
export class SoilTemperatureViewComponent implements OnInit, AfterViewInit {


  public showZoomControl = true;
  public showAttributionControl = true;
  public map: L.Map;

  // public baselayers: BaseLayer[] = [];
  // public overviewMapLayers: Layer[] = [new Tile({
  //   source: new OSM()
  // })];
  // public zoom = 11;
  // public lat = 51.15;
  // public lon = 7.22;

  // public token: string = '';
  // public sentinelLayer: esri.ImageMapLayer;
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
  public stationFilter: ParameterFilter = {
    phenomenon: '7'
  };
  public statusIntervals = false;
  public mapOptions: L.MapOptions = { dragging: true, zoomControl: false };

  constructor(private mapCache: MapCache){//private mapService: OlMapService, private requestTokenSrvc: RequestTokenService, private csvService: CsvDataService) {
    // this.responseInterp = csvService.getCsvText(); 
  }
  ngAfterViewInit(): void {
    this.baselayers.forEach((blayer,i,arr)=>{
      this.mapCache.getMap(this.mapId).addLayer(blayer);
    });
    this.mapCache.getMap(this.mapId).addLayer(L.tileLayer.wms(
      WvG_URL,
        {
          layers: '0', format: 'image/png', transparent: true, maxZoom: 16, attribution: '&copy; Wupperverband>',
          className: 'WV_GB'
        }
    ));
    L.control.scale().addTo(this.mapCache.getMap(this.mapId));
  }

  ngOnInit() {

    this.baseMaps.set(this.mapId,
      {
          label: 'OSM-WMS', // will be shown in layer control
          visible: true, // is layer by default visible
          layer: L.tileLayer.wms(
            'http://ows.terrestris.de/osm/service?',
              {
                layers: 'OSM-WMS', format: 'image/png', transparent: true, maxZoom: 16, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                className: 'OSM'
              }
          )
      }
  );

  

  this.baselayers.push(
    (esri.imageMapLayer({
      url: waterTempService,
      maxZoom: 16, opacity: 1, alt: 'WaterTemperatureService'
    }))
  );

  
    // this.mapService.getMap(this.mapId).subscribe((map) => {
    //   map.getLayers().clear();
    //   map.addControl(new ScaleLine({units: "metric"}));
    //   map.addLayer(new Tile({
    //     source: new OSM()
    //   }));
    //   map.addLayer(new ImageLayer({
    //     visible: true,
    //     opacity: 0.5,
    //     source: new ImageWMS({
    //       url: WvG_URL,
    //       params: {
    //         'LAYERS': '0',
    //       },
    //     })
    //   }));
    // });

    // this.baselayers.push(
    //   new ImageLayer({
    //     visible: true,
    //     source: new ImageArcGISRest({
    //       ratio: 1,
    //       params: {
    //         'LAYERS': 'Wacodis/EO_WACODIS_DAT_INTRA_LAND_COVER_CLASSIFICATION_Service',
    //       },
    //       url: waterTempService
    //     })
    //   })
    // );
    // this.createPieChart();
  }
  public onStationSelected(station: Station) {
    alert(station.properties.label);
    console.log(station);

  }
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

    let trace =[]

    var layout = {
      width: 600,
      height: 400,
      margin: { "t": 0, "b": 0, "l": 0, "r": 0 },
      showlegend: true,
      // title: 'Landbedeckung ' + this.selectedTime.toDateString(),
    }
    Plotly.newPlot('tempChart', trace, layout,{responsive: true})
  }
}