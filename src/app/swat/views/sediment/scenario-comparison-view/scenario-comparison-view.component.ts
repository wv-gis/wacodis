import { Component, OnInit } from '@angular/core';
import * as L from "leaflet";
import { MapCache } from '@helgoland/map';
import * as esri from "esri-leaflet";
declare var require;
require('esri-leaflet-renderers');
require('leaflet.sync');

@Component({
  selector: 'wv-scenario-comparison-view',
  templateUrl: './scenario-comparison-view.component.html',
  styleUrls: ['./scenario-comparison-view.component.css']
})
export class ScenarioComparisonViewComponent implements OnInit {

  public mapOptions: L.TimeDimensionMapOptions = {
    dragging: true, zoomControl: true, boxZoom: false, timeDimension: true, timeDimensionControl: false,
    timeDimensionControlOptions: { timeZones: ['Local'], position: 'bottomleft' }
  };
  public wmsLayer: any;
  public mainMap: L.Map;
  public mapId = 'szOne-CompMap';
  public szenario2Id = 'szTwo-CompMap';
  public szenarioMap: L.Map;
  public featureService: esri.FeatureLayerService;
  public szenarioTS_ID=[1,5];
  public szenarioSub_ID=[2,7];
  public selSzenario_id_l= 0;
  public selSzenario_id_r = 1;
  public showBarChart : boolean = false;
  public featureTSLayerUrl = "https://services9.arcgis.com/GVrcJ5O2vy6xbu2e/ArcGIS/rest/services/SWATimClient/FeatureServer";


  constructor(private mapCache: MapCache) { }

  ngOnInit() {
    this.showBarChart = true;
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
  this.mainMap.createPane('FirstLayer');
 

  this.szenarioMap.addLayer(L.tileLayer.wms('http://ows.terrestris.de/osm/service?',
  {
    layers: 'OSM-WMS', format: 'image/png', transparent: true, maxZoom: 16, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    className: 'OSM2'
  }));
  this.szenarioMap.createPane('TopLayer');

  this.mainMap.addLayer(esri.featureLayer({
    url: "https://services9.arcgis.com/GVrcJ5O2vy6xbu2e/ArcGIS/rest/services/SWATimClient/FeatureServer/"+ this.szenarioSub_ID[this.selSzenario_id_l]
  }));
  
  this.mainMap.addLayer(esri.featureLayer({
    url: "https://services9.arcgis.com/GVrcJ5O2vy6xbu2e/ArcGIS/rest/services/SWATimClient/FeatureServer/" + this.szenarioTS_ID[this.selSzenario_id_l],
    fields: ["OBJECTID", "rsv_yearavg_csv_SED_OUT", "rsv_yearavg_csv_SED_IN", "rsv_yearavg_csv_SED_CONC",
      "rsv_yearavg_csv_Name", "rsv_yearavg_csv_ResID"],pane: 'FirstLayer'
  }));
  
  


 
  this.szenarioMap.addLayer(esri.featureLayer({
    url: "https://services9.arcgis.com/GVrcJ5O2vy6xbu2e/ArcGIS/rest/services/SWATimClient/FeatureServer/"+ this.szenarioSub_ID[this.selSzenario_id_r]
  }));
  this.szenarioMap.addLayer(esri.featureLayer({
    url: "https://services9.arcgis.com/GVrcJ5O2vy6xbu2e/ArcGIS/rest/services/SWATimClient/FeatureServer/" + this.szenarioTS_ID[this.selSzenario_id_r],
    fields: ["OBJECTID", "rsv_yearavg_csv_SED_OUT", "rsv_yearavg_csv_SED_IN", "rsv_yearavg_csv_SED_CONC",
      "rsv_yearavg_csv_Name", "rsv_yearavg_csv_ResID"],pane: 'TopLayer'
  }));


  this.mainMap.sync(this.szenarioMap);
  this.szenarioMap.sync(this.mainMap);

  this.mainMap.invalidateSize();
  this.szenarioMap.invalidateSize();
  }

}
