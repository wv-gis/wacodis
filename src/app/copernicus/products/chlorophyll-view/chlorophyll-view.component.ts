import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Timespan } from '@helgoland/core';
import * as L from 'leaflet';
import * as esri from 'esri-leaflet';
import { LayerOptions, MapCache } from '@helgoland/map';

const watermask_Srvc = "https://services9.arcgis.com/GVrcJ5O2vy6xbu2e/arcgis/rest/services/watermask_S1_2019_06_2019_11/FeatureServer"

const WvG_URL = 'http://fluggs.wupperverband.de/secman_wss_v2/service/WMS_WV_Oberflaechengewaesser_EZG/guest?';
@Component({
  selector: 'wv-chlorophyll-view',
  templateUrl: './chlorophyll-view.component.html',
  styleUrls: ['./chlorophyll-view.component.css']
})
/**
 * component for depiction of Chlorophyll with Isoplethen diagram and RasterImage Results
 */
export class ChlorophyllViewComponent implements OnInit,AfterViewInit {
  public samplingStationLabels = [];
  public dam_label = 'Dhünn-Talsperre';
  public samplingIds: string[] = [];
  public defaultDate: Date = new Date(new Date().getFullYear() - 1, 0, 1);
  public timeSpan = new Timespan(new Date(2017, 12, 1).getTime(), new Date(2018, 11, 28).getTime());
  public samplingId = '3142';

  public mapOptions: L.MapOptions = { dragging: true, zoomControl: false };
  sceneNum: number;
  public dyn: esri.DynamicMapLayer;
  selectedPics: string[] = [];
  public baselayers: L.Layer[] = [];
  public map: L.Map;
  public mapId = 'chloro-map';
  public baseMaps: Map<string, LayerOptions> = new Map<string, LayerOptions>();
  public showZoomControl = true;

  constructor(private mapCache: MapCache) {
  
  }

   /**
   * add Layers and Scale to Map after Initialization
   */
  ngAfterViewInit(): void {
    this.baselayers.forEach((blayer, i, arr) => {
      this.mapCache.getMap(this.mapId).addLayer(blayer);
    });
    this.mapCache.getMap(this.mapId).addLayer(L.tileLayer.wms(
      WvG_URL,
      {
        layers: '0', format: 'image/png', transparent: true, maxZoom: 16, attribution: '&copy; Wupperverband>',
        className: 'WV_GB'
      }
    ));

  }

  /**
   * create Basemap
   */
  ngOnInit() {
    this.map = L.map(this.mapId, this.mapOptions).setView([51.07, 7.22], 13);


    L.control.scale().addTo(this.map);
    this.mapCache.setMap(this.mapId, this.map);
   

    this.map.addLayer(
      L.tileLayer.wms(
        'http://ows.terrestris.de/osm/service?',
        {
          layers: 'OSM-WMS', format: 'image/png', transparent: true, maxZoom: 16, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          className: 'OSM'
        }
      )
    );

    this.dyn = esri.dynamicMapLayer({
      url: "https://gis.wacodis.demo.52north.org:6443/arcgis/rest/services/WaCoDiS/EO_WaCoDiS_Chlorophyll_2020/MapServer", layers: [1], opacity: 1,
      className: 'Chloro'
    });
    this.dyn.metadata((err, dat) => {
      this.sceneNum = dat["layers"].length - 1;
      let array = dat["layers"];
      array.forEach((element, i, arr) => {
        if (i == 0) {

        } else {
          this.selectedPics.push(element.name);
        }

      });

    });

    this.baselayers.push(this.dyn);


  }
  /**
   * 
   * @param date selected date of layer in mainMap
   * date to visualize for diagram text
   */
  public onSubmitOne(date: number) {
    // this.currentSelectedTimeL = date;

    this.baselayers.forEach((lay,i,arr)=>{
      lay.remove();
    });
    this.baselayers.push(esri.dynamicMapLayer({
      url: "https://gis.wacodis.demo.52north.org:6443/arcgis/rest/services/WaCoDiS/EO_WaCoDiS_Chlorophyll_2020/MapServer", layers: [date], opacity: 1,
       className: 'Chloro' 
    }));

    this.baselayers.forEach((lay, i, arr) => {
      this.mapCache.getMap(this.mapId).addLayer(lay);
    });
  }
  /**
   * change Date to selected date
   * @param fromDate 
   */
  public changeFromDate(fromDate: Date) {
    this.defaultDate = fromDate;
  }
  /**
   * change label and id to selected station based on index
   * @param stat 
   * @param index 
   */
  public changeSamplingStation(stat: string, index: number) {
    this.dam_label = this.samplingStationLabels[index];
    this.samplingId = this.samplingIds[index];
    // this.selectMeasureParam = this.measureParams[index];
  }
}
