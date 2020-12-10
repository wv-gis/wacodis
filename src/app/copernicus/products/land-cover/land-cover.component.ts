declare var require;
import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as esri from 'esri-leaflet';
import * as L from 'leaflet';
import { MapCache } from '@helgoland/map';
require('leaflet-timedimension');
require('leaflet.sync');
import { ActivatedRoute } from '@angular/router';


const intraLandService = 'https://gis.wacodis.demo.52north.org:6443/arcgis/rest/services/WaCoDiS/WACODIS_LAND_COVER_CLASSIFICATION/ImageServer';
const maskService = 'https://fluggs.wupperverband.de/arcgis/rest/services/offen/Schablonen/MapServer';

@Component({
  selector: 'wv-land-cover',
  templateUrl: './land-cover.component.html',
  styleUrls: ['./land-cover.component.css']
})

/**
 * ComponentDashboard for Visualisation of LandCover Satellite Product
 * supports  2 different types of diagrams, syncedmaps and legendCard
 * the product Service and maskLayer must be defined
 */
export class LandCoverComponent implements OnInit, AfterViewInit {

  public showZoomControl = true;
  public showAttributionControl = true;
  public syncMap: L.Map;

  public baselayers: L.Layer[] = [];
  public syncBaselayers: L.Layer[] = [];

  public sentinelLayer: esri.ImageMapLayer;
  public syncSentinelLayer: esri.ImageMapLayer;
  public mapId = 'landcover-map';
  public syncMapId = 'landcover-sync-map';
  public chartId = 'chartPie';
  public syncChartId = 'syncChartPie'

  public selectedTime: number = 1;
  public selectedSyncTime: number = 1;
  public currentSelectedTimeL: Date = new Date();
  public currentSelectedTimeR: Date = new Date();

  public syncmapOptions: L.MapOptions = { dragging: true, zoomControl: true, boxZoom: false };
  public mapOptions: L.TimeDimensionMapOptions = {
    dragging: true, zoomControl: true, boxZoom: false, timeDimension: true, timeDimensionControl: false,
    timeDimensionControlOptions: { timeZones: ['Local'], position: 'bottomleft' }
  };
  public wmsLayer: any;
  public mainMap: L.Map;
  public showDiagram: boolean = false;
  public loading: boolean = false;
  public defTimeL = 2;
  public defTimeR = 5;
  public mapBounds: L.LatLngBounds;
  public selPE = ['wv', 'uW', 'oW', 'dH'];
  public selPE_name = ['nutzerspezifisch', 'PE untere Wupper', ' PE obere Wupper', 'PE Dhuenn'];
  public selPE_id: number;
  public maskLayer: esri.DynamicMapLayer;
  public syncMaskLayer: esri.DynamicMapLayer;
  public polyBounds: L.LatLng[];
  public service: string;
  public view: L.LatLng;
  public categoryVal = ["no Data", "Acker - Mais", "Acker - sonstige Ackerfrucht", "Gewaesser", "unbekanntGF",
    "Siedlung - Gewerbe", "Gruenland - unbestimmt", "Gruenland - Gestruepp",
    "Offenboden", "Siedlung geschlossen", "Siedlung offen", "Verkehrsflaeche", "Laubbaeume",
    "unbekanntM", "Nadelbaeume", "Acker - Raps", "Acker - unbewachsen", "Acker - Zwischenfrucht",
    "unbekanntA", "unbekanntAs", "Acker-sonstiges-Offenboden", "Acker-Mais-Offenboden",
    "Acker-Mais-Zwischenfrucht", "Acker-Raps-Offenboden", "Acker-Raps-Zwischenfrucht"];
  public colors = ["rgb(0,0,0)", "rgb(255,215,0)", "rgb(184,134,11)", "rgb(65,105,225)", "rgb(30,144,255)", "rgb(190,190,190)", "rgb(192,255,62)",
    "rgb(189,183,107)", "rgb(139,69,19)", "rgb(205,92,92)", "rgb(250,128,144)", "rgb(186,85,211)", "rgb(60,179,113)", "rgb(0,0,0)", "rgb(49,139,87)",
    "rgb(255,255,0)", "rgb(205,133,63)", "rgb(210,180,140)", "rgb(0,0,0)", "rgb(0,0,0)", "rgb(255,218,185)", "rgb(255,250,205)",
    "rgb(255,246,143)", "rgb(205,205,0)", "rgb(238,238,0)"];

  constructor(private activatedRoute: ActivatedRoute, private mapCache: MapCache) {
    this.service = intraLandService;

  }

  ngAfterViewInit(): void {
    //on Bounds change reload the diagrams
    this.mainMap.on('moveend', this.changeBounds, this);

  }

  ngOnInit() {

    this.activatedRoute.params.subscribe(params => {
      if (!this.mainMap && this.selPE.indexOf(params['id'])!=-1){
        this.selPE_id= this.selPE.indexOf(params['id']);
        this.queryMapBoundary(this.selPE.indexOf(params['id']));
      }   
      else if(this.selPE.indexOf(params['id'])!=-1&& this.mainMap){
        this.selPE_id= this.selPE.indexOf(params['id']);
        this.updateMap(this.selPE.indexOf(params['id']));
      }
      else{
       this.selPE_id=0;
        this.createMap();
      }
    });
  }

  /**
   * 
   * @param selPE_id : selected ID of planning unit
   * query polygon bounds and update map Bounds and View
   */
  public updateMap(selPE_id: number) {

    esri.mapService({ url: maskService + '/' + selPE_id }).get('query', {
      geometry: {
        "xmin": 355826.312924539,
        "ymin": 5650214.457977539,
        "xmax": 402251.9127736615,
        "ymax": 5686235.283377186,
        "spatialReference": {
          "wkid": 25832
        }
      },
      geometryType: 'esriGeometryEnvelope',
      maxAllowableOffset: 0.002,
      geometryPrecision: 5,
      outSR: 4326
    }, (err, resp) => {
      if (err) {
        console.log(err);
      } else {
        this.polyBounds = resp.features[0].geometry.rings;
      
        this.view = L.polygon(this.polyBounds).getBounds().getCenter();
        this.mainMap.setView([this.view.lng,this.view.lat], 11)
        this.syncMap.setView([this.view.lng,this.view.lat], 11);
        this.mainMap.removeLayer(this.maskLayer);
        this.syncMap.removeLayer(this.syncMaskLayer);

        this.maskLayer = esri.dynamicMapLayer({
          url: maskService, layers: [selPE_id],
          maxZoom: 16, position: 'front', pane: 'imagePane'
        });
        this.syncMaskLayer = esri.dynamicMapLayer({
          url: maskService, layers: [selPE_id],
          maxZoom: 16, position: 'front', pane: 'imagePane'
        });;
        this.mainMap.addLayer(this.maskLayer);
        this.syncMap.addLayer(this.syncMaskLayer);

        this.mainMap.invalidateSize();
        this.syncMap.invalidateSize();
      }
    });

  }

  /**
   * get Polygon Boundary of MaskService and create MainMap and diagrams
   */
  public queryMapBoundary(Pe_id: number) {

    esri.mapService({ url: maskService + '/' + Pe_id }).get('query', {
      geometry: {
        "xmin": 355826.312924539,
        "ymin": 5650214.457977539,
        "xmax": 402251.9127736615,
        "ymax": 5686235.283377186,
        "spatialReference": {
          "wkid": 25832
        }
      },
      geometryType: 'esriGeometryEnvelope',
      maxAllowableOffset: 0.002,
      geometryPrecision: 5,
      outSR: 4326
    }, (err, resp) => {
      if (err) {
        console.log(err);
      } else {
        this.polyBounds =resp.features[0].geometry.rings ;
        this.view = L.polygon(this.polyBounds).getBounds().getCenter();
        this.mainMap.setView([this.view.lng,this.view.lat],11);
        this.syncMap.setView([this.view.lng,this.view.lat],11);

        this.mainMap.invalidateSize();
        this.syncMap.invalidateSize();

        this.showDiagram = !this.showDiagram;
      }
    });
    this.createMap(Pe_id);

  }

  /**
   * 
   * @param maskId : ID of the planning Unit Layer
   * 
   * create Map Component and its Layers
   */
  public createMap(maskId?: number) {
    this.wmsLayer = L.tileLayer.wms('http://ows.terrestris.de/osm/service?',
      {
        layers: 'OSM-WMS', format: 'image/png', transparent: true, maxZoom: 16, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        className: 'OSM'
      });

    this.mainMap = L.map(this.mapId, this.mapOptions).setView([51.178, 7.133], 11);
    this.mapBounds = this.mainMap.getBounds();
    this.mainMap.timeDimension.setCurrentTime(new Date().getTime());
    this.syncMap = L.map(this.syncMapId, this.syncmapOptions).setView([51.178, 7.133], 11);

 

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

    this.sentinelLayer = esri.imageMapLayer({ url: intraLandService, opacity: 0.6, maxZoom: 16 });

    // let testTimeLayer = new ExtendedOlLayerAnimateTimeComponent(esri.imageMapLayer(
    // {
    //   url: intraLandService, opacity: 0.8, maxZoom: 16
    // }),{});

    this.syncSentinelLayer = esri.imageMapLayer({ url: intraLandService, opacity: 0.6, maxZoom: 16 })
    this.syncMap.createPane('imagePane');
    this.mainMap.createPane('imagePane');

    this.mainMap.addLayer(this.sentinelLayer);
    // this.mainMap.addLayer(testTimeLayer);
    this.syncMap.addLayer(this.syncSentinelLayer);

      if(maskId){
        this.maskLayer = esri.dynamicMapLayer({
          url: maskService, layers: [maskId],
          maxZoom: 16, position: 'front', pane: 'imagePane'
        });
        this.syncMaskLayer = esri.dynamicMapLayer({
          url: maskService, layers: [maskId],
          maxZoom: 16, position: 'front', pane: 'imagePane'
        });;
        this.mainMap.addLayer(this.maskLayer);
        this.syncMap.addLayer(this.syncMaskLayer);
      }
 

    this.mainMap.sync(this.syncMap);
    this.syncMap.sync(this.mainMap);

    this.baselayers.push(this.sentinelLayer);
    this.syncBaselayers.push(this.syncSentinelLayer);


    this.mainMap.invalidateSize();
    this.syncMap.invalidateSize();

  }

  /**
   * 
   * @param num 
   * define the selected index of dates of the sentinellayer on Selection
   * in MainMap
   */
  public setSelectedTime(num: number) {
    this.selectedTime = num;
  }
  /**
 * 
 * @param num 
 * define the selected index of dates of the synclayer on Selection
 * in SyncedMap
 */
  public setSelectedSyncTime(num: number) {
    this.selectedSyncTime = num;
  }

  /**
   * 
   * @param date selected date of layer in mainMap
   * date to visualize for diagram text
   */
  public setSelectedCurrentTimeLeft(date: Date) {
    this.currentSelectedTimeL = date;
  }
  /**
 * 
 * @param date selected date of layer in syncedMap
 * date to visualize for diagram text
 */
  public setSelectedCurrentTimeRight(date: Date) {
    this.currentSelectedTimeR = date;
  }

  /**
   * set MapBounds depending on scroll and drag Movements
   */
  public changeBounds() {
    this.mapBounds = this.mainMap.getBounds();
  }

  
}
