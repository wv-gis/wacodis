import { Component, OnInit, OnDestroy } from '@angular/core';
import * as L from "leaflet";
import { MapCache } from '@helgoland/map';
import * as esri from "esri-leaflet";
declare var require;
require('esri-leaflet-renderers');


@Component({
  selector: 'wv-single-result-view',
  templateUrl: './single-result-view.component.html',
  styleUrls: ['./single-result-view.component.css']
})
export class SingleResultViewComponent implements OnInit, OnDestroy {

  public mapOptions: L.TimeDimensionMapOptions = {
    dragging: true, zoomControl: true, boxZoom: false, timeDimension: true, timeDimensionControl: false,
    timeDimensionControlOptions: { timeZones: ['Local'], position: 'bottomleft' }
  };
  public wmsLayer: any;
  public featureTSLayerUrl = "https://services9.arcgis.com/GVrcJ5O2vy6xbu2e/ArcGIS/rest/services/SWATimClient/FeatureServer";

  public showBarChart : boolean = false;
  public szenario2Id = 'szTwo-map';
  public szenarioSoilId = 'szSoil-map';
  public szenarioSlopeId = 'szSlope-map';
  public szenarioLUId = 'szLand-map';
  public szenarioOutputId = 'szOutput-map';
  public szenarioMap: L.Map;
  public soilMap: L.Map;
  public slopeMap: L.Map;
  public landUseMap: L.Map;
  public sedOutputMap: L.Map;
  public featureService: esri.FeatureLayerService;
  public featureTSLayer: esri.FeatureLayer;
  public featureHRULayer: esri.FeatureLayer;
  public showSingleMaps: boolean = false;
  public selSzenarioTS: number[] = [1, 5];
  public selSzenarioSUB: number[] = [2, 7];
  public selSzenarioHRU: number[] = [3, 6];
  public selSzen_Id: number = 0;
  public baseLayers: L.Layer[] = [];

  constructor(private mapCache: MapCache) { }
  ngOnDestroy(): void {
    this.mapCache.deleteMap(this.szenario2Id);
    this.mapCache.deleteMap(this.szenarioLUId);
    this.mapCache.deleteMap(this.szenarioOutputId);
    this.mapCache.deleteMap(this.szenarioSlopeId);
    this.mapCache.deleteMap(this.szenarioSoilId);
  }

  ngOnInit() {
   this.createBaseMap();

  }

/**
 * set default BaseMap with view, Options and add to MapCache
 */
  public createBaseMap(){
  this.showBarChart = true;
  this.wmsLayer = L.tileLayer.wms('http://ows.terrestris.de/osm/service?',
    {
      layers: 'OSM-WMS', format: 'image/png', transparent: true, maxZoom: 16, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      className: 'OSM'
    });

  this.szenarioMap = L.map(this.szenario2Id, this.mapOptions).setView([51.128, 7.433], 11);
  L.control.scale().addTo(this.szenarioMap);
  this.szenarioMap.createPane('TopLayer').setAttribute('style', 'z-index: 450');
  this.mapCache.setMap(this.szenario2Id, this.szenarioMap);

  this.addLayer();


 

  this.szenarioMap.invalidateSize();
}

/**
 * add feature Layer to created Basemap
 */
public addLayer(){
  this.szenarioMap.addLayer(L.tileLayer.wms('http://ows.terrestris.de/osm/service?',
  {
    layers: 'OSM-WMS', format: 'image/png', transparent: true, maxZoom: 16, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    className: 'OSM'
  }));

this.featureHRULayer = (esri.featureLayer({
  url: "https://services9.arcgis.com/GVrcJ5O2vy6xbu2e/ArcGIS/rest/services/SWATimClient/FeatureServer/"+this.selSzenarioSUB[this.selSzen_Id],
  onEachFeature: (feature, layer) => {
    layer.bindPopup(function (l) {
      return L.Util.template('<p>Subbasin Nummer {sub_yearavg_csv_SUB}</p>', feature.properties);
    }).on('click', this.plotSubbasinInfo, this);

  }
})).addTo(this.szenarioMap);

this.featureTSLayer = esri.featureLayer({
  url: "https://services9.arcgis.com/GVrcJ5O2vy6xbu2e/ArcGIS/rest/services/SWATimClient/FeatureServer/" + this.selSzenarioTS[this.selSzen_Id],
  fields: ["OBJECTID", "rsv_yearavg_csv_SED_OUT", "rsv_yearavg_csv_SED_IN", "rsv_yearavg_csv_SED_CONC",
    "rsv_yearavg_csv_Name", "rsv_yearavg_csv_ResID"], onEachFeature: (feature, layer) => {

      layer.bindPopup(function (l) {
        return L.Util.template('<p>Sediment-Austrag <strong>{rsv_yearavg_csv_SED_OUT}</strong> an der  {rsv_yearavg_csv_Name}-Talsperre.</p>', feature.properties);
      });

    }, pane: 'TopLayer'
}).addTo(this.szenarioMap);
this.featureTSLayer.bringToFront();
}

/**
 * create Subbasin Maps based on information
 * @param e selected subbasin
 */
  public plotSubbasinInfo(e) {
    let t = e.target;

    this.showSingleMaps = true;
    if (!this.mapCache.hasMap(this.szenarioSlopeId)) {


      this.slopeMap = L.map(this.szenarioSlopeId, this.mapOptions).setView([51.128, 7.43], 13);
      this.soilMap = L.map(this.szenarioSoilId, this.mapOptions).setView([51.128, 7.433], 13);
      this.sedOutputMap = L.map(this.szenarioOutputId, this.mapOptions).setView([51.128, 7.433], 13);
      this.landUseMap = L.map(this.szenarioLUId, this.mapOptions).setView([51.128, 7.433], 13);

      this.mapCache.setMap(this.szenarioSlopeId, this.slopeMap);
      this.mapCache.setMap(this.szenarioSoilId, this.soilMap);
      this.mapCache.setMap(this.szenarioOutputId, this.sedOutputMap);
      this.mapCache.setMap(this.szenarioLUId, this.landUseMap);

      this.slopeMap.addLayer(this.wmsLayer);
      this.soilMap.addLayer(L.tileLayer.wms('http://ows.terrestris.de/osm/service?',
        {
          layers: 'OSM-WMS', format: 'image/png', transparent: true, maxZoom: 16, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }));
      this.sedOutputMap.addLayer(L.tileLayer.wms('http://ows.terrestris.de/osm/service?',
        {
          layers: 'OSM-WMS', format: 'image/png', transparent: true, maxZoom: 16, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }));
      this.landUseMap.addLayer(L.tileLayer.wms('http://ows.terrestris.de/osm/service?',
        {
          layers: 'OSM-WMS', format: 'image/png', transparent: true, maxZoom: 16, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }));

      this.baseLayers.push(esri.tiledMapLayer({
        url: 'https://tiles.arcgis.com/tiles/GVrcJ5O2vy6xbu2e/arcgis/rest/services/SWATimClient_SubbasinInfo/MapServer',
      }));
      this.baseLayers.push(esri.featureLayer({
        url: 'https://services9.arcgis.com/GVrcJ5O2vy6xbu2e/ArcGIS/rest/services/SWATimClient/FeatureServer'}));
   
    }
    else {
      // remove selected feature layers and add new ones as well as baselayer
      //Land use detail view
      this.landUseMap.eachLayer(layer => {
        layer.remove();
      });
      this.landUseMap.addLayer(L.tileLayer.wms('http://ows.terrestris.de/osm/service?',
        {
          layers: 'OSM-WMS', format: 'image/png', transparent: true, maxZoom: 16, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }));

      // soil type detail view
      this.soilMap.eachLayer(layer => {
        layer.remove();
      });
      this.soilMap.addLayer(L.tileLayer.wms('http://ows.terrestris.de/osm/service?',
        {
          layers: 'OSM-WMS', format: 'image/png', transparent: true, maxZoom: 16, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',

        }));

      // slope detail view
      this.slopeMap.eachLayer(layer => {
        layer.remove();
      });
      this.slopeMap.addLayer(L.tileLayer.wms('http://ows.terrestris.de/osm/service?',
        {
          layers: 'OSM-WMS', format: 'image/png', transparent: true, maxZoom: 16, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',

        }));


      //sediment Output detail view
      this.sedOutputMap.eachLayer(layer => {
        layer.remove();
      });
      this.sedOutputMap.addLayer(L.tileLayer.wms('http://ows.terrestris.de/osm/service?',
        {
          layers: 'OSM-WMS', format: 'image/png', transparent: true, maxZoom: 16, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',

        }));
    }

    //add new layers based on chosen subbasin

    this.landUseMap.addLayer(esri.featureLayer({
      url: 'https://services9.arcgis.com/GVrcJ5O2vy6xbu2e/ArcGIS/rest/services/SWATimClient_SubbasinInfo/FeatureServer/63',
      where: 'Subbasin=' + t.feature.id,  onEachFeature: (feature, layer) => {

        layer.bindPopup(function (l) {
          return L.Util.template('<p>Landnutzungsklasse <strong>{Name}</strong>.</p>', feature.properties);
        });

      }
    })).flyToBounds(t._bounds);

    this.soilMap.addLayer(esri.featureLayer({
      url: 'https://services9.arcgis.com/GVrcJ5O2vy6xbu2e/ArcGIS/rest/services/SWATimClient_SubbasinInfo/FeatureServer/64',
      where: 'Subbasin=' + t.feature.id,  onEachFeature: (feature, layer) => {

        layer.bindPopup(function (l) {
          return L.Util.template('<p>Bodentyp <strong>{TYP_TEXT}</strong> mit der Art <strong>{ART_TEXT}</strong>.</p>', feature.properties);
        });

      }
    })).flyToBounds(t._bounds);

    this.slopeMap.addLayer(esri.tiledMapLayer({
      url: 'https://tiles.arcgis.com/tiles/GVrcJ5O2vy6xbu2e/arcgis/rest/services/SWATimClient_SubbasinInfo/MapServer',
      opacity: 0.8, minNativeZoom: 12, bounds: t._bounds, maxNativeZoom: 17, subdomains: '1'

    })).flyToBounds(t._bounds);

  


    this.sedOutputMap.addLayer(esri.featureLayer({
      url: 'https://services9.arcgis.com/GVrcJ5O2vy6xbu2e/ArcGIS/rest/services/SWATimClient/FeatureServer/'+ this.selSzenarioHRU[this.selSzen_Id],
      // fields: ['hru_yearavg_csv_N_STRS','OBJECTID','hru_yearavg_csv_P_STRS','hru_yearavg_csv_BIOM','hru_yearavg_csv_SYLD'],
      where: 'hru_yearavg_csv_SUBBASIN=' + t.feature.id,  onEachFeature: (feature, layer) => {

        layer.bindPopup(function (l) {
          return L.Util.template('<p>Sedimentaustrag von <strong>{hru_yearavg_csv_SYLD} [t/ha/a]</strong>.</p>', feature.properties);
        });

      }
    })).flyToBounds(t._bounds);

 
  }
  onSubmit(customerData: number){
    this.selSzen_Id = customerData;
    this.showSingleMaps = false;
    this.szenarioMap.eachLayer(layer => {
      layer.remove();
    });
    this.landUseMap.eachLayer(layer => {
      layer.remove();
    });
    this.soilMap.eachLayer(layer => {
      layer.remove();
    });
    this.sedOutputMap.eachLayer(layer => {
      layer.remove();
    });
    this.slopeMap.eachLayer(layer => {
      layer.remove();
    });
    this.addLayer();

  }
}
