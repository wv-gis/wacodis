import { Component, OnInit } from '@angular/core';
import * as L from "leaflet";
import { MapCache } from '@helgoland/map';
import * as esri from "esri-leaflet";
declare var require;
require('esri-leaflet-renderers');
require('leaflet.sync');

@Component({
  selector: 'wv-scenario-comparison-nitrogen-view',
  templateUrl: './scenario-comparison-nitrogen-view.component.html',
  styleUrls: ['./scenario-comparison-nitrogen-view.component.css']
})
export class ScenarioComparisonNitrogenViewComponent implements OnInit {

  public mapOptions: L.TimeDimensionMapOptions = {
    dragging: true, zoomControl: true, boxZoom: false, timeDimension: true, timeDimensionControl: false,
    timeDimensionControlOptions: { timeZones: ['Local'], position: 'bottomleft' }
  };
  public wmsLayer: any;
  public mainMap: L.Map;
  public mapId = 'szOne-nitro-map';
  public szenario2Id = 'szTwo-nitro-map';
  public szenarioMap: L.Map;
  public featureService: esri.FeatureLayerService;
  constructor(private mapCache: MapCache) { }

  ngOnInit() {
    this.wmsLayer = L.tileLayer.wms('http://ows.terrestris.de/osm/service?',
    {
      layers: 'OSM-WMS', format: 'image/png', transparent: true, maxZoom: 16, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      className: 'OSM'
    });

  this.mainMap = L.map(this.mapId, this.mapOptions).setView([51.128, 7.433], 11);
  this.szenarioMap = L.map(this.szenario2Id, this.mapOptions).setView([51.128, 7.433], 11);

  L.control.scale().addTo(this.mainMap);
  L.control.scale().addTo(this.szenarioMap);

  this.mapCache.setMap(this.mapId, this.mainMap);
  this.mapCache.setMap(this.szenario2Id, this.szenarioMap);

  this.mainMap.addLayer(this.wmsLayer);

  this.mainMap.addLayer(esri.featureLayer({
    url: "https://services9.arcgis.com/GVrcJ5O2vy6xbu2e/ArcGIS/rest/services/SWATimClient/FeatureServer/2",

  }));
  this.mainMap.addLayer(esri.featureLayer({
    url: "https://services9.arcgis.com/GVrcJ5O2vy6xbu2e/ArcGIS/rest/services/SWATimClient/FeatureServer/1",
    fields: ["OBJECTID", "rsv_yearavg_csv_ORGN_OUT", "rsv_yearavg_csv_ORGN_IN", "rsv_yearavg_csv_ORGP_IN",
    "rsv_yearavg_csv_ORGP_OUT","rsv_yearavg_csv_RES_ORGP","rsv_yearavg_csv_NO3_IN","rsv_yearavg_csv_NO3_OUT",
    "rsv_yearavg_csv_RES_NO3","rsv_yearavg_csv_NO2_IN","rsv_yearavg_csv_NO2_OUT","rsv_yearavg_csv_RES_NO2",
    "rsv_yearavg_csv_NH3_IN","rsv_yearavg_csv_NH3_OUT","rsv_yearavg_csv_RES_NH3",
      "rsv_yearavg_csv_Name", "rsv_yearavg_csv_ResID"]
  }));



  this.szenarioMap.addLayer(L.tileLayer.wms('http://ows.terrestris.de/osm/service?',
  {
    layers: 'OSM-WMS', format: 'image/png', transparent: true, maxZoom: 16, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    className: 'OSM'
  }));
  this.szenarioMap.addLayer(esri.featureLayer({
    url: "https://services9.arcgis.com/GVrcJ5O2vy6xbu2e/ArcGIS/rest/services/SWATimClient/FeatureServer/7",

  }));
  this.szenarioMap.addLayer(esri.featureLayer({
    url: "https://services9.arcgis.com/GVrcJ5O2vy6xbu2e/ArcGIS/rest/services/SWATimClient/FeatureServer/5",
    fields: ["OBJECTID", "rsv_yearavg_csv_ORGN_OUT", "rsv_yearavg_csv_ORGN_IN", "rsv_yearavg_csv_ORGP_IN",
    "rsv_yearavg_csv_ORGP_OUT","rsv_yearavg_csv_RES_ORGP","rsv_yearavg_csv_NO3_IN","rsv_yearavg_csv_NO3_OUT",
    "rsv_yearavg_csv_RES_NO3","rsv_yearavg_csv_NO2_IN","rsv_yearavg_csv_NO2_OUT","rsv_yearavg_csv_RES_NO2",
    "rsv_yearavg_csv_NH3_IN","rsv_yearavg_csv_NH3_OUT","rsv_yearavg_csv_RES_NH3",
      "rsv_yearavg_csv_Name", "rsv_yearavg_csv_ResID"]
  }));


  this.mainMap.sync(this.szenarioMap);
  this.szenarioMap.sync(this.mainMap);
  }

}