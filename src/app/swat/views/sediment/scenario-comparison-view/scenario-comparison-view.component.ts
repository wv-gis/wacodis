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
  public mapId = 'szOne-map';
  public szenario2Id = 'szTwo-map';
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

  this.featureService = esri.featureLayerService({
    url: 'https://services9.arcgis.com/GVrcJ5O2vy6xbu2e/ArcGIS/rest/services/SWATimClient/FeatureServer/1'
  });
  this.featureService.query().where("rsv_yearavg_csv_SED_IN>0").run((error, featureCollection, response) => {
    // console.log("FeatureCollection: " + JSON.stringify(featureCollection));
    // console.log("Response: " + JSON.stringify(response));
  })
  this.mainMap.addLayer(this.wmsLayer);
  this.szenarioMap.addLayer(L.tileLayer.wms('http://ows.terrestris.de/osm/service?',
  {
    layers: 'OSM-WMS', format: 'image/png', transparent: true, maxZoom: 16, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    className: 'OSM2'
  }));

  this.mainMap.addLayer(esri.featureLayer({
    url: "https://services9.arcgis.com/GVrcJ5O2vy6xbu2e/ArcGIS/rest/services/SWATimClient/FeatureServer/2"
  }));
  
  this.mainMap.addLayer(esri.featureLayer({
    url: "https://services9.arcgis.com/GVrcJ5O2vy6xbu2e/ArcGIS/rest/services/SWATimClient/FeatureServer/1",
    fields: ["OBJECTID", "rsv_yearavg_csv_SED_OUT", "rsv_yearavg_csv_SED_IN", "rsv_yearavg_csv_SED_CONC",
      "rsv_yearavg_csv_Name", "rsv_yearavg_csv_ResID"]
  }));
  
  // .bindPopup(function (featureCollection) {
  //   console.log(featureCollection);
  //   return L.Util.template('<p>{rsv_yearavg_csv_Name} hat einen Sedimenteintrag von {rsv_yearavg_csv_SED_IN}'+ 
  //   'und einen Austrag von {rsv_yearavg_csv_SED_OUT}.</p>',
  //   featureCollection.features[0].properties);
  // });


 
  this.szenarioMap.addLayer(esri.featureLayer({
    url: "https://services9.arcgis.com/GVrcJ5O2vy6xbu2e/ArcGIS/rest/services/SWATimClient/FeatureServer/7"
  }));
  this.szenarioMap.addLayer(esri.featureLayer({
    url: "https://services9.arcgis.com/GVrcJ5O2vy6xbu2e/ArcGIS/rest/services/SWATimClient/FeatureServer/5",
    fields: ["OBJECTID", "rsv_yearavg_csv_SED_OUT", "rsv_yearavg_csv_SED_IN", "rsv_yearavg_csv_SED_CONC",
      "rsv_yearavg_csv_Name", "rsv_yearavg_csv_ResID"]
  }));


  this.mainMap.sync(this.szenarioMap);
  this.szenarioMap.sync(this.mainMap);

  this.mainMap.invalidateSize();
  this.szenarioMap.invalidateSize();
  }

}
