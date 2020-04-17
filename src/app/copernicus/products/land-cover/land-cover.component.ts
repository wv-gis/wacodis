declare var require;
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as esri from 'esri-leaflet';
import { RequestTokenService } from 'src/app/services/request-token.service';
import * as L from 'leaflet';
import { MapCache } from '@helgoland/map';
import Plotly from 'plotly.js-dist';

require('leaflet.sync');


const intraLandService = 'https://gis.wacodis.demo.52north.org:6443/arcgis/rest/services/WaCoDiS/EO_WACODIS_DAT_INTRA_LAND_COVER_CLASSIFICATION_Service/ImageServer';


@Component({
  selector: 'wv-land-cover',
  templateUrl: './land-cover.component.html',
  styleUrls: ['./land-cover.component.css']
})
export class LandCoverComponent implements OnInit, AfterViewInit {
  @ViewChild("pixelChart", { static: true }) public plotlydiv: ElementRef;

  public showZoomControl = true;
  public showAttributionControl = true;
  public syncMap: L.Map;

  public baselayers: L.Layer[] = [];
  public syncBaselayers: L.Layer[] = [];
  public zoom = 11;
  public lat = 51.15;
  public lon = 7.22;

  public token: string = '';
  public sentinelLayer: esri.ImageMapLayer;
  public syncSentinelLayer: esri.ImageMapLayer;
  public mapId = 'landcover-map';
  public syncMapId = 'landcover-sync-map';
  public chartId = 'chartPie';
  public syncChartId = 'syncChartPie'

  public selectedTime: number = 1;
  public selectedSyncTime: number = 1;

  public mapOptions: L.MapOptions = { dragging: true, zoomControl: true, boxZoom: false };
  public wmsLayer: any;
  public mainMap: L.Map;
  public showDiagram: boolean = false;

  constructor(private requestTokenSrvc: RequestTokenService, private mapCache: MapCache) {

  }
  ngAfterViewInit(): void {
    this.mainMap.on('mouseup', this.identifyPixel, this);
    this.syncMap.on('mouseup', this.identifyPixel, this);
  }

  ngOnInit() {

    this.wmsLayer = L.tileLayer.wms('http://ows.terrestris.de/osm/service?',
      {
        layers: 'OSM-WMS', format: 'image/png', transparent: true, maxZoom: 16, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        className: 'OSM'
      });

    this.mainMap = L.map(this.mapId, this.mapOptions).setView([51.161, 7.212], 10);
    this.syncMap = L.map(this.syncMapId, this.mapOptions).setView([51.161, 7.212], 10);

    this.mainMap.addLayer(this.wmsLayer);
    L.tileLayer.wms('http://ows.terrestris.de/osm/service?',
      {
        layers: 'OSM-WMS', format: 'image/png', transparent: true, maxZoom: 16, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        className: 'OSM'
      }).addTo(this.syncMap);


    L.control.scale().addTo(this.mainMap);
    L.control.scale().addTo(this.syncMap);

    this.mapCache.setMap(this.mapId, this.mainMap);
    this.mapCache.setMap(this.syncMapId, this.syncMap);

    this.sentinelLayer = esri.imageMapLayer({ url: intraLandService, opacity: 0.8, maxZoom: 16 });
    this.syncSentinelLayer = esri.imageMapLayer({ url: intraLandService, opacity: 0.8, pane: 'imagePane' })
    this.syncMap.createPane('imagePane');

    this.mainMap.addLayer(this.sentinelLayer);
    this.syncMap.addLayer(this.syncSentinelLayer);

    this.mainMap.sync(this.syncMap);
    this.syncMap.sync(this.mainMap);

    this.baselayers.push(this.sentinelLayer);
    this.syncBaselayers.push(this.syncSentinelLayer);

    this.mainMap.invalidateSize();
    this.syncMap.invalidateSize();

 

  }
  public setSelectedTime(num: number) {
    this.selectedTime = num;
  }
  public setSelectedSyncTime(num: number) {
    this.selectedSyncTime = num;
  }

  public identifyPixel(e) {
    this.showDiagram = true;


    let identifiedPixel;
    let dateVal: { date: Date, value: number }[] = [];
    let dates: Date[] = [];
    let values: number[] = [];
    // let plotPane = this.plotlydiv.nativeElement;

    if (this.sentinelLayer) {
      this.sentinelLayer.bindPopup(function (error, identifyResults, response) {
        if (error) {
          console.log('Error: ' + error);
          return;
        } else {

          identifiedPixel = identifyResults.pixel.properties.values.reverse();
          identifyResults.catalogItems.features.forEach((f, i, arr) => {
            dateVal.push({ date: new Date(f.properties.startTime), value: identifiedPixel[i] });
          });
          dateVal.sort(function (a, b) { return a.date.getTime() - b.date.getTime(); });
          dateVal.forEach((v, i, arr) => {
            dates.push(v.date);
            values.push(v.value);
          });

          let data = {
            x: dates,
            y: values,
            mode: 'lines+markers',
            type: 'scatter'
          };
          let layout = {
            yaxis: {
              title: {
                text:'Pixelwert',
            
              },
              showline: true,

            },
            xaxis: { showline: true },
            height: 125,
            width: 800,
            margin: { "t": 0, "b": 15, "l": 45, "r": 0 },
          };
          let config = {
            toImageButtonOptions: {
              format: 'png'
            },
            responsive: true,
            displaylogo: false,
            modeBarButtonsToRemove: ['select2d', 'lasso2d', 'hoverClosestCartesian',
              'hoverCompareCartesian', 'toggleSpikelines', 'pan2d', 'zoomOut2d', 'zoomIn2d', 'autoScale2d', 'resetScale2d'],
          };
          Plotly.newPlot('pixelChart', [data], layout, config);


        }
      });
    }
  }
}
