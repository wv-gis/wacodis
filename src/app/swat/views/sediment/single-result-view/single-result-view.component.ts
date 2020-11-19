import { Component, OnInit, OnDestroy } from '@angular/core';
import * as L from "leaflet";
import { MapCache } from '@helgoland/map';
import * as esri from "esri-leaflet";
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
declare var require;
require('esri-leaflet-renderers');
require('leaflet.sync');

const materialParam: string[] = ["OBJECTID", "rsv_yearavg_csv_ORGN_OUT", "rsv_yearavg_csv_ORGN_IN", "rsv_yearavg_csv_NO3_IN", "rsv_yearavg_csv_NO2_IN", "rsv_yearavg_csv_NO3_OUT",
  "rsv_yearavg_csv_NO2_OUT", "rsv_yearavg_csv_NH3_IN", "rsv_yearavg_csv_NH3_OUT",
  "rsv_yearavg_csv_Name", "rsv_yearavg_csv_ResID"];
const sedimentParam: string[] = ["OBJECTID", "rsv_yearavg_csv_SED_OUT", "rsv_yearavg_csv_SED_IN", "rsv_yearavg_csv_SED_CONC",
  "rsv_yearavg_csv_Name", "rsv_yearavg_csv_ResID"];

@Component({
  selector: 'wv-single-result-view',
  templateUrl: './single-result-view.component.html',
  styleUrls: ['./single-result-view.component.css']
})
/**
 * component to depict the model outputs for sediment values for single analysis
 */
export class SingleResultViewComponent implements OnInit, OnDestroy {

  public mapOptions: L.TimeDimensionMapOptions = {
    dragging: true, zoomControl: true, boxZoom: false, timeDimension: true, timeDimensionControl: false,
    timeDimensionControlOptions: { timeZones: ['Local'], position: 'bottomleft' }
  };
  public wmsLayer: any;
  public featureTSLayerUrl = "https://services9.arcgis.com/GVrcJ5O2vy6xbu2e/arcgis/rest/services/SWATimClient/FeatureServer";
  public groupLayerUrl = "https://tiles.arcgis.com/tiles/GVrcJ5O2vy6xbu2e/arcgis/rest/services/SWATimClient/MapServer";

  public showBarChart: boolean = false;
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
  public selSzenarioTS: number[] = [];//[70, 137, 204, 271, 339, 406, 472, 539];
  public selSzenarioSUB: number[] = [];//[71, 138, 205, 272, 338, 405, 473, 540];
  public selSzenarioHRU: number[] = [];//[69, 136, 203, 270, 337, 404, 471, 538];

  public selSzenarioTSN: number[] = [];
  public selSzenarioSUBN: number[] = [];
  public selSzenarioHRUN: number[] = [];
  public selSzenarioLU: number[] = [];
  sublayerIDs: number[] = [];
  szenarioIds: number[] = [63, 72, 81, 90, 99, 108, 117, 126];
  public selSzen_Id: number = 0;
  public selSzenario: string[] = [];
  public baseLayers: L.Layer[] = [];
  public params: string[];
  public barId: number;
  public param: string = '';
  scenDescript = "";

  constructor(private mapCache: MapCache, private router: ActivatedRoute, private http: HttpClient) {

  }
  ngOnDestroy(): void {
    this.mapCache.deleteMap(this.szenario2Id);
    this.mapCache.deleteMap(this.szenarioLUId);
    this.mapCache.deleteMap(this.szenarioOutputId);
    this.mapCache.deleteMap(this.szenarioSlopeId);
    this.mapCache.deleteMap(this.szenarioSoilId);

  }

  ngOnInit() {

    this.router.url.subscribe((obs) => {
      switch (obs[0].path) {
        case 'substrance-entries-sediment': {
          this.params = sedimentParam;
          this.barId = 0;
          this.param = 'Sedimente';
          break;
        }
        case 'substrance-entries-nitrogen': {
          this.params = materialParam;
          this.barId = 1;
          this.param = 'Stickstoff';
          break;
        }
      }
    }, error => console.log(error));

    this.http.get(this.groupLayerUrl + '/?f=json').subscribe((ob: any) => this.setLayerSzenarioIds(ob), err => console.log(err), () => this.createBaseMap());


  }

  setLayerSzenarioIds(ob: any) {
    this.szenarioIds.forEach((szen, i, arr) => {
      this.selSzenario.push(ob['layers'][szen].name);
      this.sublayerIDs = ob['layers'][szen].subLayerIds;
      this.sublayerIDs.forEach((layer, i, arr) => {
        if (ob['layers'][layer].name.startsWith('hru')) {
          if (ob['layers'][layer].name.endsWith('Sed')) {
            this.selSzenarioHRU.push(layer);
          } else {
            this.selSzenarioHRUN.push(layer);
          }

        } else if (ob['layers'][layer].name.startsWith('sub')) {
          if (ob['layers'][layer].name.endsWith('Sed')) {
            this.selSzenarioSUB.push(layer);
          } else {
            this.selSzenarioSUBN.push(layer);
          }

        } else if (ob['layers'][layer].name.startsWith('rsv')) {
          if (ob['layers'][layer].name.endsWith('Sed')) {
            this.selSzenarioTS.push(layer);
          }
          else {
            this.selSzenarioTSN.push(layer);
          }
        }
        else if (ob['layers'][layer].name.startsWith('Landuse')) {
          this.selSzenarioLU.push(layer);
        }
      }

      );
    
    });
  }
  /**
   * set default BaseMap with view, Options and add to MapCache
   */
  public createBaseMap() {
 
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
    this.showBarChart = true;
  }

  /**
   * add feature Layer to created Basemap
   */
  public addLayer() {
    this.szenarioMap.addLayer(L.tileLayer.wms('http://ows.terrestris.de/osm/service?',
      {
        layers: 'OSM-WMS', format: 'image/png', transparent: true, maxZoom: 16, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        className: 'OSM'
      }));

    if (this.param == 'Sedimente') {
      this.featureHRULayer = (esri.featureLayer({
        url: "https://services9.arcgis.com/GVrcJ5O2vy6xbu2e/arcgis/rest/services/SWATimClient/FeatureServer/" + this.selSzenarioSUB[this.selSzen_Id],
        onEachFeature: (feature, layer) => {
          layer.bindPopup(function (l) {
            return L.Util.template('<p>Subbasin Nummer {sub_yearavg_csv_SUB} mit flächenhaftem Sedimentaustrag von {sub_yearavg_csv_SYLD} t/ha pro Jahr</p>', feature.properties);

          }).on('click', this.plotSubbasinInfo, this);
        }, ignoreRenderer: false, style: function (feature) {
          return { fillOpacity: 0.8 };
        }
      })).addTo(this.szenarioMap);

      this.featureTSLayer = esri.featureLayer({
        url: "https://services9.arcgis.com/GVrcJ5O2vy6xbu2e/arcgis/rest/services/SWATimClient/FeatureServer/" + this.selSzenarioTS[this.selSzen_Id],
        fields: this.params, onEachFeature: (feature, layer) => {

          layer.bindPopup(function (l) {

            return L.Util.template('<p>Sediment Konzentration <strong>{rsv_yearavg_csv_SED_CONC}</strong> [mg/L] pro Zeitschritt in der  {rsv_yearavg_csv_Name}-Talsperre.</p>',
              feature.properties);
          });

        }, pane: 'TopLayer'
      }).addTo(this.szenarioMap);

    } else {

      this.featureHRULayer = (esri.featureLayer({
        url: "https://services9.arcgis.com/GVrcJ5O2vy6xbu2e/arcgis/rest/services/SWATimClient/FeatureServer/" + this.selSzenarioSUBN[this.selSzen_Id],
        onEachFeature: (feature, layer) => {
          layer.bindPopup(function (l) {

            return L.Util.template('<p>Subbasin Nummer {sub_yearavg_csv_SUB} mit flächenhaftem NO3-Austrag von {sub_yearavg_csv_NO3kgNpHa} kg/ha pro Jahr</p>', feature.properties);

          }).on('click', this.plotSubbasinInfo, this);
        }, ignoreRenderer: false, style: function (feature) {

          return { fillOpacity: 0.8 };
        }
      })).addTo(this.szenarioMap);

      this.featureTSLayer = esri.featureLayer({
        url: "https://services9.arcgis.com/GVrcJ5O2vy6xbu2e/arcgis/rest/services/SWATimClient/FeatureServer/" + this.selSzenarioTSN[this.selSzen_Id],
        fields: this.params, onEachFeature: (feature, layer) => {

          layer.bindPopup(function (l) {

            return L.Util.template('<p>Organischer Stickstoff-Austrag <strong>{rsv_yearavg_csv_ORGN_OUT}</strong> [kg/m³]  pro Jahr an der  {rsv_yearavg_csv_Name}-Talsperre.</p>',
              feature.properties);

          });

        }, pane: 'TopLayer'
      }).addTo(this.szenarioMap);
    }


    this.baseLayers.push(esri.featureLayer({
      url: 'https://tiles.arcgis.com/tiles/GVrcJ5O2vy6xbu2e/arcgis/rest/services/SWATimClient_SubbasinInfo/MapServer',// oder MapServer
    }));
    this.baseLayers.push(esri.featureLayer({
      url: 'https://services9.arcgis.com/GVrcJ5O2vy6xbu2e/arcgis/rest/services/SWATimClient/FeatureServer'
    }));
    this.baseLayers.push(esri.dynamicMapLayer({
      url: "https://gis.wacodis.demo.52north.org:6443/arcgis/rest/services/WaCoDiS/SWATimClient_Slope/MapServer"
    }));

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

      this.slopeMap.sync(this.soilMap);
      this.slopeMap.sync(this.landUseMap);
      this.slopeMap.sync(this.sedOutputMap);
      this.sedOutputMap.sync(this.slopeMap);
      this.sedOutputMap.sync(this.landUseMap);
      this.sedOutputMap.sync(this.soilMap);
      this.landUseMap.sync(this.soilMap);
      this.landUseMap.sync(this.sedOutputMap);
      this.landUseMap.sync(this.slopeMap);
      this.soilMap.sync(this.slopeMap);
      this.soilMap.sync(this.sedOutputMap);
      this.soilMap.sync(this.landUseMap);

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
      url: 'https://services9.arcgis.com/GVrcJ5O2vy6xbu2e/arcgis/rest/services/SWATimClient/FeatureServer/' + (this.selSzenarioLU[this.selSzen_Id]),
      where: 'Subbasin=' + t.feature.id, onEachFeature: (feature, layer) => {

        layer.bindPopup(function (l) {
          return L.Util.template('<p>Landnutzungsklasse: <strong>{Name}</strong>.</p>', feature.properties);
        });

      }
    })).fitBounds(t._bounds);

    this.soilMap.addLayer(esri.featureLayer({
      url: 'https://services9.arcgis.com/GVrcJ5O2vy6xbu2e/ArcGIS/rest/services/SWATimClient_SubbasinInfo/FeatureServer/64',
      where: 'Subbasin=' + t.feature.id, onEachFeature: (feature, layer) => {

        layer.bindPopup(function (l) {
          return L.Util.template('<p>Bodentyp <strong>{TYP_TEXT}</strong> mit der Art <strong>{ART_TEXT}</strong>.</p>', feature.properties);
        });

      }
    })).fitBounds(t._bounds);

    this.slopeMap.addLayer(esri.dynamicMapLayer({
      url: "https://gis.wacodis.demo.52north.org:6443/arcgis/rest/services/WaCoDiS/SWATimClient_Slope/MapServer",
      layers: [t.feature.id]
    }).bindPopup((e, featureCol, res) => {
      let prop = featureCol.features[0].properties.OID;
      let val;
      switch (prop) {
        case '1': {
          val = '0-3%';
          return val ? val : false;

        }
        case '2': {
          val = '3-12%';
          return val ? val : false;

        }
        case '3': {
          val = '>12%';
          return val ? val : false;
        }
      }

    })).fitBounds(t._bounds);


    if (this.param == "Sedimente") {
      this.sedOutputMap.addLayer(esri.featureLayer({
        url: 'https://services9.arcgis.com/GVrcJ5O2vy6xbu2e/arcgis/rest/services/SWATimClient/FeatureServer/' + this.selSzenarioHRU[this.selSzen_Id],
        where: 'hru_yearavg_csv_SUBBASIN=' + t.feature.id, onEachFeature: (feature, layer) => {
          layer.bindPopup(function (l) {
            return L.Util.template('<p>Sedimentaustrag von <strong>{hru_yearavg_csv_SYLD} [t/ha/a]</strong>.</p>',
              feature.properties);
          });
        }
      })).fitBounds(t._bounds);
    }
    else {
      this.sedOutputMap.addLayer(esri.featureLayer({
        url: 'https://services9.arcgis.com/GVrcJ5O2vy6xbu2e/arcgis/rest/services/SWATimClient/FeatureServer/' + this.selSzenarioHRUN[this.selSzen_Id],
        where: 'hru_yearavg_csv_SUBBASIN=' + t.feature.id, onEachFeature: (feature, layer) => {
          layer.bindPopup(function (l) {
            return L.Util.template('<p>Stoffaustrag von <strong>{hru_yearavg_csv_NO3kgNpHa} [kg NO3-N / ha]</strong>.</p>',
              feature.properties);
          });
        }
      })).fitBounds(t._bounds);
    }

  }

  /**
   * 
   * @param customerData 
   */
  onSubmit(customerData: number) {
    this.selSzen_Id = customerData;
    this.showSingleMaps = false;
    this.szenarioMap.eachLayer(layer => {
      layer.remove();
    });
    if (this.mapCache.hasMap(this.szenarioSlopeId)) {

      this.landUseMap.remove();
      this.soilMap.remove();
      this.sedOutputMap.remove();
      this.slopeMap.remove();
      this.mapCache.deleteMap(this.szenarioSlopeId);
      this.mapCache.deleteMap(this.szenarioSoilId);
      this.mapCache.deleteMap(this.szenarioLUId);
      this.mapCache.deleteMap(this.szenarioOutputId);

      this.slopeMap.unsync(this.soilMap);
      this.slopeMap.unsync(this.landUseMap);
      this.slopeMap.unsync(this.sedOutputMap);
      this.sedOutputMap.unsync(this.slopeMap);
      this.sedOutputMap.unsync(this.landUseMap);
      this.sedOutputMap.unsync(this.soilMap);
      this.landUseMap.unsync(this.soilMap);
      this.landUseMap.unsync(this.sedOutputMap);
      this.landUseMap.unsync(this.slopeMap);
      this.soilMap.unsync(this.slopeMap);
      this.soilMap.unsync(this.sedOutputMap);
      this.soilMap.unsync(this.landUseMap);
    }

    this.addLayer();
    this.http.get(this.groupLayerUrl + '/' + this.szenarioIds[customerData] + '/?f=json').subscribe(resp => {
      this.scenDescript = resp["description"];
    });

  }
}
