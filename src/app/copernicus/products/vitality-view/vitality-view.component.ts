declare var require;
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { OlMapService } from '@helgoland/open-layers';

import * as L from 'leaflet';
require('leaflet-timedimension');
import { MapCache, LayerOptions } from '@helgoland/map';
import { ActivatedRoute } from '@angular/router';
import { D3PlotOptions } from '@helgoland/d3';
import { Timespan, DatasetOptions } from '@helgoland/core';

const vitalityService = 'https://www.wms.nrw.de/umwelt/waldNRW';
@Component({
  selector: 'wv-vitality-view',
  templateUrl: './vitality-view.component.html',
  styleUrls: ['./vitality-view.component.css']
})

/**
 * component for visualization of Vitality data results with map and diagrams
 */
export class VitalityViewComponent implements OnInit, AfterViewInit {


  public datasetIdsMultiple = ['https://www.fluggs.de/sos2/api/v1/__63', 'https://www.fluggs.de/sos2/api/v1/__72'];
  public d3Colors= ['#123456', '#FF0000'];
  // The timespan
  public timespan = new Timespan(new Date().getTime() - 100000000, new Date().getTime());
  // These are the plotting options.
  public diagramOptionsD3: D3PlotOptions = {
    togglePanZoom: true,
    showReferenceValues: false,
    generalizeAllways: true
  };
  // 'selectedIds' determines the graphs that are visualized with a larger stroke-width. 
  public selectedIds: string[] = [];
  public datasetOptionsMultiple: Map<string, DatasetOptions> = new Map();
  public showZoomControl = true;
  public showAttributionControl = true;

  public baselayers: L.Layer[] = [];
  public categoryVal = ["no Data", "unverändert", "gering", "mittel",
    "stark", "Zuwachs gering", "Zuwachs mittel", "Zuwachs stark"];
  public colors = ["rgb(0,0,0)", "rgb(255,215,0)", "rgb(184,134,11)", "rgb(65,105,225)", "rgb(30,144,255)",
    "rgb(190,190,190)", "rgb(192,255,62)",
  ];
  public lat = 51.07;
  public lon = 7.21;
  public mainMap: L.Map;
  public mapId = 'vitality-map';
  public zoomControlOptions: L.Control.ZoomOptions = { position: 'topleft' };
  public avoidZoomToSelection = false;
  public layerControlOptions: L.Control.LayersOptions = { position: 'bottomleft' };
  public selPE: number;
  public selectedTime: number = 1;
  public currentSelectedTimeL: Date = new Date();
  public showDiagram: boolean = false;
  public mapBounds: L.LatLngBounds;
  public service: string;
  public mapOptions: L.TimeDimensionMapOptions = {
    dragging: true, zoomControl: true,
    timeDimension: true, timeDimensionControl: true,
    timeDimensionControlOptions: { timeZones: ['Local'] }
  };
  public providerUrl: string = 'https://www.fluggs.de/sos2-intern-gis/api/v1/';


  constructor( private activatedRoute: ActivatedRoute, private mapCache: MapCache) {
    this.service = vitalityService;
    this.datasetIdsMultiple.forEach((entry, i) => {
      this.datasetOptionsMultiple.set(entry, new DatasetOptions(entry, this.colors[i]));
  });
  }

  /**
   * add Layers and Listener to Map
   */
  ngAfterViewInit(): void {
    this.baselayers.forEach((lay, i, arr) => {
      this.mapCache.getMap(this.mapId).addLayer(lay);
    });

    this.mainMap.on('moveend', this.changeBounds, this);
  }

  /**
   * create default Map and Layers
   */
  ngOnInit() {
    //   this.wmsLayer = L.tileLayer.wms('http://ows.terrestris.de/osm/service?',
    //   {
    //     layers: 'OSM-WMS', format: 'image/png', transparent: true, maxZoom: 16, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    //     className: 'OSM'
    //   });


    this.mainMap = L.map(this.mapId, this.mapOptions).setView([51.07, 7.21], 13);

    this.mainMap.timeDimension.setCurrentTime(new Date().getTime());

    L.control.scale().addTo(this.mainMap);
    this.mapCache.setMap(this.mapId, this.mainMap);
    this.mapBounds = this.mainMap.getBounds();

    this.mainMap.addLayer(L.tileLayer.wms(
      'http://ows.terrestris.de/osm/service?',
      {
        layers: 'OSM-WMS', format: 'image/png', transparent: true, maxZoom: 16, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        className: 'OSM'
      }
    ));
    this.baselayers.push(L.tileLayer.wms(vitalityService,
      {
        layers: 'nadelwald_06_207_09_2018', format: 'image/png', transparent: true, maxZoom: 16, minZoom: 11, attribution: 'Datenlizenz Deutschland – Namensnennung – Version 2.0',
        className: 'nadel_2017_2018'
      })
    );


    this.baselayers.push(L.tileLayer.wms(vitalityService,
      {
        layers: 'nadelwald_06_2017_06_2019', format: 'image/png', transparent: true, maxZoom: 16, minZoom: 11, attribution: 'Datenlizenz Deutschland – Namensnennung – Version 2.0',
        className: 'nadelwald_06_2017_06_2019', opacity: 0
      })
    );

    this.baselayers.push(L.tileLayer.wms(vitalityService,
      {
        layers: 'nadelwald_06_2017_08_2019', format: 'image/png', transparent: true, maxZoom: 16, minZoom: 11, attribution: 'Datenlizenz Deutschland – Namensnennung – Version 2.0',
        className: 'nadelwald_06_2017_08_2019', opacity: 0
      })
    );

    this.baselayers.push(L.tileLayer.wms(vitalityService,
      {
        layers: 'waldtypen_real', format: 'image/png', transparent: true, maxZoom: 16, minZoom: 11, attribution: 'Datenlizenz Deutschland – Namensnennung – Version 2.0',
        className: 'waldtypen_real', opacity: 0
      })
    );
    let testTimeLayer = L.timeDimension.layer.wms(L.tileLayer.wms("https://maps.dwd.de/geoserver/ows",
      {
        layers: 'dwd:RX-Produkt', format: 'image/png', transparent: true
      }), {
      updateTimeDimension: true, getCapabilitiesLayerName: 'dwd:RX-Produkt', getCapabilitiesUrl: "https://maps.dwd.de/geoserver/ows"
    });
    this.baselayers.push(testTimeLayer);

    //   let secTimeLayer = L.timeDimension.layer.wms(L.tileLayer.wms("https://gis.wacodis.demo.52north.org:6443/arcgis/services/WaCoDiS/EO_WACODIS_DAT_INTRA_LAND_COVER_CLASSIFICATION_Service/ImageServer/WMSServer",
    //   {
    //     layers: 'EO_WACODIS_DAT_INTRA_LAND_COVER_CLASSIFICATION_Service:None', format: 'image/png', transparent: true
    //   }),{ updateTimeDimensionMode: 'union',setDefaultTime: true,
    //    updateTimeDimension: true, getCapabilitiesLayerName: 'EO_WACODIS_DAT_INTRA_LAND_COVER_CLASSIFICATION_Service:None', getCapabilitiesUrl: "https://maps.dwd.de/geoserver/ows" });
    // this.baselayers.push(secTimeLayer);

  }

  /**
    * set MapBounds depending on scroll and drag Movements
    */
  public changeBounds() {
    this.mapBounds = this.mainMap.getBounds();
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
   * @param date selected date of layer in mainMap
   * date to visualize for diagram text
   */
  public setSelectedCurrentTimeLeft(date: Date) {
    this.currentSelectedTimeL = date;
  }
// changes the timespan of the graph 
  public timespanChanged(timespan: Timespan) {
    this.timespan = timespan;
}
}