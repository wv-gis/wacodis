import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map.js';
import BaseLayer from 'ol/layer/Base';
import Layer from 'ol/layer/Layer';
import { Tile } from 'ol/layer';
import { OSM, TileWMS, ImageWMS, ImageArcGISRest } from 'ol/source';
import * as esri from 'esri-leaflet';
import { RequestTokenService } from 'src/app/services/request-token.service';
import { OlMapService } from '@helgoland/open-layers';
import ImageLayer from 'ol/layer/Image';
import Plotly from 'plotly.js-dist';
import { StatisticData } from 'src/app/map/menu/layer-tree/layer-tree.component';
import { ScaleLine } from 'ol/control';
import * as L from 'leaflet';
import { MapCache } from '@helgoland/map';



const categoryVal = ["no Data", "Acker - Mais", "Acker - sonstige Ackerfrucht", "Gewaesser",
  "Gewaesser stehend", "Siedlung - Gewerbe", "Gruenland - unbestimmt", "Gruenland - Gestruepp",
  "Offenboden", "Siedlung geschlossen", "Siedlung offen", "Verkehrsflaeche", "Laubbaeume",
  "Mischwald", "Nadelbaeume", "Acker - Raps", "Acker - unbewachsen", "Acker - Zwischenfrucht",
  "unbekannt", "unbekannt", "Acker-sonstiges-Offenboden", "Acker-Mais-Offenboden",
  "Acker-Mais-Zwischenfrucht", "Acker-Raps-Offenboden", "Acker-Raps-Zwischenfrucht"];
const colors = ["rgb(0,0,0)", "rgb(255,215,0)", "rgb(184,134,11)", "rgb(65,105,225)", "rgb(30,144,255)", "rgb(190,190,190)", "rgb(192,255,62)",
  "rgb(189,183,107)", "rgb(139,69,19)", "rgb(205,92,92)", "rgb(250,128,144)", "rgb(186,85,211)", "rgb(60,179,113)", "rgb(0,0,0)", "rgb(49,139,87)",
  "rgb(255,255,0)", "rgb(205,133,63)", "rgb(210,180,140)", "rgb(0,0,0)", "rgb(0,0,0)", "rgb(255,218,185)", "rgb(255,250,205)",
  "rgb(255,246,143)", "rgb(205,205,0)", "rgb(238,238,0)"];
const intraLandService = 'https://gis.wacodis.demo.52north.org:6443/arcgis/rest/services/WaCoDiS/EO_WACODIS_DAT_INTRA_LAND_COVER_CLASSIFICATION_Service/ImageServer';
const vitalityService = 'https://www.wms.nrw.de/umwelt/waldNRW';

@Component({
  selector: 'wv-land-cover',
  templateUrl: './land-cover.component.html',
  styleUrls: ['./land-cover.component.css']
})
export class LandCoverComponent implements OnInit {

  public showZoomControl = true;
  public showAttributionControl = true;
  public map: Map;

  public baselayers: L.Layer[] = [];
  public overviewMapLayers: Layer[] = [new Tile({
    source: new OSM()
  })];
  public zoom = 11;
  public lat = 51.15;
  public lon = 7.22;

  public token: string = '';
  public sentinelLayer: esri.ImageMapLayer;
  public mapId = 'landcover-map';

  public headers: string[] = [];
  public entries = [];
  public dataArr: string[];
  public responseInterp: string;
  public stats: StatisticData[] = [];
  public values: number[] = [];
  public labels: string[] = [];
  public colorRgb: string[] = [];
  public selectedTime: Date = new Date();

  public mapOptions: L.MapOptions = { dragging: true, zoomControl: true, boxZoom: false };
  public wmsLayer: any;
  public mainMap: L.Map;

  constructor(private mapService: OlMapService, private requestTokenSrvc: RequestTokenService, private mapCache: MapCache) {
  
  }

  ngOnInit() {

    this.wmsLayer = L.tileLayer.wms('http://ows.terrestris.de/osm/service?',
    {
      layers: 'OSM-WMS', format: 'image/png', transparent: true, maxZoom: 16, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      className: 'OSM'
    });

  this.mainMap = L.map(this.mapId, this.mapOptions).setView([51.161, 7.482], 10);

  this.mainMap.addLayer(this.wmsLayer);
  L.control.scale().addTo(this.mainMap);
  this.mapCache.setMap(this.mapId,this.mainMap);
    // var mousePosition = [];
    this.sentinelLayer = esri.imageMapLayer({url: intraLandService, opacity: 0.8, maxZoom: 16});
    this.mainMap.addLayer(this.sentinelLayer);
    
    // this.mapService.getMap(this.mapId).subscribe((map) => {
    //   map.getLayers().clear();
    //   map.addControl(new ScaleLine({ units: "metric" }));
    //   map.addLayer(new Tile({
    //     source: new OSM()
    //   }));

    //   map.on('click', function (evt) {
    //     mousePosition = evt.coordinate;
    //     map.forEachLayerAtPixel(evt.pixel,(layer,arr)=>{

    //       let identifiedPixel;
    //       let dateVal: { date: Date, value: number }[] = [];
    //       let dates: Date[]=[];
    //       let values: number[]=[];
    //         imageMap.bindPopup(function (error, identifyResults, response) {
    //           if (error) {
    //             console.error(error);
    //             return;
    //           }
             
    //           identifiedPixel = identifyResults.pixel.properties.values.reverse();
    //           console.log(identifiedPixel);
    //           identifyResults.catalogItems.features.forEach((f, i, arr) => {
    //             dateVal.push({ date: new Date(f.properties.startTime), value: identifiedPixel[i] });
    //           });
    //           dateVal.sort(function (a, b) { return a.date.getTime() - b.date.getTime(); });
    //           dateVal.forEach((v, i, arr) => {
    //             dates.push(v.date);
    //             values.push(v.value);
    //           });
    
    //           let data = {
    //             x: dates,
    //             y: values,
    //             mode: 'lines+markers',
    //             type: 'scatter'
    //           };
    //           let layout = {
    //             title: "Pixelverlauf",
    //             yaxis: {
    //               title: 'Pixelwert',
    //               showline: true,
    //             },
    //             xaxis: { showline: true },
    //             height: 390,
    //           };
    //           let config = {
    //             toImageButtonOptions: {
    //               format: 'png'
    //             },
    //             responsive: true,
    //             displaylogo: false,
    //             modeBarButtonsToRemove: ['select2d', 'lasso2d', 'hoverClosestCartesian',
    //               'hoverCompareCartesian', 'toggleSpikelines', 'pan2d', 'zoomOut2d', 'zoomIn2d', 'autoScale2d', 'resetScale2d'],
    //           };
    //            Plotly.newPlot("pixelPlot", [data], layout, config);
    //         });
        
    //     });
    //   });
    // });

    // let imageSource = new ImageArcGISRest({
    //   ratio: 1,
    //   params: {
    //     'LAYERS': 'Wacodis/EO_WACODIS_DAT_INTRA_LAND_COVER_CLASSIFICATION_Service',
    //   },
    //   url: intraLandService
    // });
    // this.baselayers.push(
    //   new ImageLayer({
    //     visible: true,
    //     source: imageSource
    //   })
    // );
    // this.baselayers.push(this.wmsLayer);
    this.baselayers.push(this.sentinelLayer);

    // let forestSource = new ImageWMS({
    //   attributions: "Datenlizenz Deutschland – Namensnennung – Version 2.0",
    //   params: {
    //     'LAYERS': 'waldbedeckung_Sentinel2',
    //   },
    //   url: vitalityService
    // });

    // this.baselayers.push(
    //   new ImageLayer({
    //     visible: false,
    //     source: forestSource
    //   })
    // );

  }


}
