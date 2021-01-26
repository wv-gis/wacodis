import { Component, OnInit } from '@angular/core';
import * as L from "leaflet";
import { MapCache } from '@helgoland/map';
import * as esri from "esri-leaflet";
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
declare var require;
require('esri-leaflet-renderers');
require('leaflet.sync');

const sedParam: string[] = ["OBJECTID", "rsv_yearavg_csv_SED_OUT", "rsv_yearavg_csv_SED_IN", "rsv_yearavg_csv_SED_CONC",
  "rsv_yearavg_csv_Name", "rsv_yearavg_csv_ResID"];

const nitroParam: string[] = ["OBJECTID", "rsv_yearavg_csv_ORGN_OUT", "rsv_yearavg_csv_ORGN_IN", "rsv_yearavg_csv_ORGP_IN",
  "rsv_yearavg_csv_ORGP_OUT", "rsv_yearavg_csv_RES_ORGP", "rsv_yearavg_csv_NO3_IN", "rsv_yearavg_csv_NO3_OUT",
  "rsv_yearavg_csv_RES_NO3", "rsv_yearavg_csv_NO2_IN", "rsv_yearavg_csv_NO2_OUT", "rsv_yearavg_csv_RES_NO2",
  "rsv_yearavg_csv_NH3_IN", "rsv_yearavg_csv_NH3_OUT", "rsv_yearavg_csv_RES_NH3",
  "rsv_yearavg_csv_Name", "rsv_yearavg_csv_ResID"];



@Component({
  selector: 'wv-scenario-comparison-view',
  templateUrl: './scenario-comparison-view.component.html',
  styleUrls: ['./scenario-comparison-view.component.css']
})
/**
 * component to depict the model outputs for sediment values for sceanrio comparison
 */
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

  public szenarioTS_ID: number[] = [];
  public szenarioSub_ID: number[] = [];
  public selSzenarioTSN_ID: number[] = [];
  public selSzenarioSUBN_ID: number[] = [];
  sublayerIDs: number[] = [];
  szenarioIds: number[] = [63, 72, 81, 90,135, 99, 108, 117, 126];
  public selSzenario: string[] = [];
  public selSzenario_id_l = 0;
  public selSzenario_id_r = 1;
  public showBarChart: boolean = false;
  public featureTSLayerUrl = "https://services9.arcgis.com/GVrcJ5O2vy6xbu2e/arcgis/rest/services/SWATimClient/FeatureServer/";
  public groupLayerUrl = "https://tiles.arcgis.com/tiles/GVrcJ5O2vy6xbu2e/arcgis/rest/services/SWATimClient/MapServer";
  public params: string[];
  public param: string;
  public idInfo: number;
  public baseLayers: L.Layer[] = [];
  scenDescript = "Alles Ackerland wird zu intensiv (4 Mahden) genutztem Grünland.";

  constructor(private mapCache: MapCache, private router: ActivatedRoute, private http: HttpClient) { }

  /**
   * initialize the view depending on route url and set corresponding values
   * request the scanrio Ids of the service and create Base Map
   */
  ngOnInit() {

    this.router.url.subscribe((obs) => {
      switch (obs[0].path) {
        case 'substrance-entries-sediment': {
          this.params = sedParam;
          this.param = 'Sedimente';
          this.idInfo = 0;
          break;
        }
        case 'substrance-entries-nitrogen': {
          this.params = nitroParam;
          this.param = 'Stickstoff';
          this.idInfo = 1;
          break;
        }
      }
    });


    this.http.get(this.groupLayerUrl + '/?f=json').subscribe((ob: any) => {
      this.setLayerSzenarioIds(ob)
    }, err => console.log(err), () => this.createBaseMap());


  }
  /**
   * receive grouplayer names and sublayer IDs to add corresponding information of layers to the view
   * @param ob json response
   */
  setLayerSzenarioIds(ob: any) {
    this.szenarioIds.forEach((szen, i, arr) => {
      this.selSzenario.push(ob['layers'][szen].name);
      this.sublayerIDs = ob['layers'][szen].subLayerIds;
      this.sublayerIDs.forEach((layer, i, arr) => {
        if (ob['layers'][layer].name.startsWith('sub')) {
          if (ob['layers'][layer].name.endsWith('Sed')) {
            this.szenarioSub_ID.push(layer);
          } else {
            this.selSzenarioSUBN_ID.push(layer);
          }

        } else if (ob['layers'][layer].name.startsWith('rsv')) {
          if (ob['layers'][layer].name.endsWith('Sed')) {
            this.szenarioTS_ID.push(layer);
          }
          else {
            this.selSzenarioTSN_ID.push(layer);
          }
        }

      }

      );

    });
  }

  /**
   * set Base Map Layers and scale for both scenario maps
   */
  createBaseMap() {
    this.showBarChart = true;


    this.mainMap = L.map(this.mapId, this.mapOptions).setView([51.128, 7.433], 11);
    this.szenarioMap = L.map(this.szenario2Id, this.mapOptions).setView([51.128, 7.433], 11);

    L.control.scale().addTo(this.mainMap);
    L.control.scale().addTo(this.szenarioMap);

    this.mapCache.setMap(this.mapId, this.mainMap);
    this.mapCache.setMap(this.szenario2Id, this.szenarioMap);



    this.mainMap.createPane('FirstLayer');
    this.szenarioMap.createPane('TopLayer');
    this.addLayerMainMap();
    this.addLayerSzenarioMap();

  }

  /**
   * add scenario feature layers to left map and sync maps
   */
  addLayerMainMap() {
    this.wmsLayer = L.tileLayer.wms('http://ows.terrestris.de/osm/service?',
      {
        layers: 'OSM-WMS', format: 'image/png', transparent: true, maxZoom: 16, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        className: 'OSM'
      });
    this.mainMap.addLayer(this.wmsLayer);

    if (this.param == 'Sedimente') {
      this.mainMap.addLayer(esri.featureLayer({
        url: this.featureTSLayerUrl + this.szenarioSub_ID[this.selSzenario_id_l]
      }));

      this.mainMap.addLayer(esri.featureLayer({
        url: this.featureTSLayerUrl + this.szenarioTS_ID[this.selSzenario_id_l],
        fields: this.params, pane: 'FirstLayer'
      }));
    } else {
      this.mainMap.addLayer(esri.featureLayer({
        url: this.featureTSLayerUrl + this.selSzenarioSUBN_ID[this.selSzenario_id_l]
      }));

      this.mainMap.addLayer(esri.featureLayer({
        url: this.featureTSLayerUrl + this.selSzenarioTSN_ID[this.selSzenario_id_l],
        fields: this.params, pane: 'FirstLayer'
      }));
    }


    this.mainMap.sync(this.szenarioMap);
    this.mainMap.invalidateSize();

  }
  /**
   *  add scenario feature layers to right map and sync maps
   */
  addLayerSzenarioMap() {


    this.szenarioMap.addLayer(L.tileLayer.wms('http://ows.terrestris.de/osm/service?',
      {
        layers: 'OSM-WMS', format: 'image/png', transparent: true, maxZoom: 16, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        className: 'OSM2'
      }));

    if (this.param == 'Sedimente') {
      this.szenarioMap.addLayer(esri.featureLayer({
        url: this.featureTSLayerUrl + this.szenarioSub_ID[this.selSzenario_id_r]
      }));
      this.szenarioMap.addLayer(esri.featureLayer({
        url: this.featureTSLayerUrl + this.szenarioTS_ID[this.selSzenario_id_r],
        fields: this.params, pane: 'TopLayer'
      }));
    } else {
      this.szenarioMap.addLayer(esri.featureLayer({
        url: this.featureTSLayerUrl + this.selSzenarioSUBN_ID[this.selSzenario_id_r]
      }));
      this.szenarioMap.addLayer(esri.featureLayer({
        url: this.featureTSLayerUrl + this.selSzenarioTSN_ID[this.selSzenario_id_r],
        fields: this.params, pane: 'TopLayer'
      }));
    }

    this.baseLayers.push(esri.featureLayer({
      url: this.featureTSLayerUrl
    }));
    this.szenarioMap.sync(this.mainMap);
    this.szenarioMap.invalidateSize();
  }

  /**
   * on selected scenario on left side change featureLayer in map
   * @param selSzenario 
   */
  onSubmitOne(selSzenario: number) {
    this.selSzenario_id_l = selSzenario;
    this.mainMap.eachLayer(layer => {
      layer.remove();
    });
    this.mainMap.unsync(this.szenarioMap);
    this.addLayerMainMap();
  }
  /**
   *  on selected scenario on right side change featureLayer in map
   * @param selSzenario 
   */
  onSubmitTwo(selSzenario: number) {
    this.selSzenario_id_r = selSzenario;
    this.szenarioMap.eachLayer(layer => {
      layer.remove();
    });
    this.szenarioMap.unsync(this.mainMap);
    this.addLayerSzenarioMap();

    this.http.get(this.groupLayerUrl + '/' + this.szenarioIds[selSzenario] + '/?f=json').subscribe(resp => {
      this.scenDescript = resp["description"];
    });
  }
}
