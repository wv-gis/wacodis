import { Component, OnInit, AfterViewInit } from '@angular/core';
import { OlMapService } from '@helgoland/open-layers';
import { RequestTokenService } from 'src/app/services/request-token.service';
import BaseLayer from 'ol/layer/Base';
// import Layer from 'ol/layer/Layer';
import { OSM, ImageArcGISRest, ImageWMS } from 'ol/source';
// import Map from 'ol/Map.js';
// import { Tile } from 'ol/layer';
import { ScaleLine } from 'ol/control';
import ImageLayer from 'ol/layer/Image';
import * as esri from 'esri-leaflet';
import * as L from 'leaflet';
import { MapCache, LayerOptions } from '@helgoland/map';
import { ParameterFilter } from '@helgoland/core';

const vitalityService = 'https://www.wms.nrw.de/umwelt/waldNRW';
const WvG_URL = 'http://fluggs.wupperverband.de/secman_wss_v2/service/WMS_WV_Oberflaechengewaesser_EZG/guest?';

@Component({
  selector: 'wv-vitality-view',
  templateUrl: './vitality-view.component.html',
  styleUrls: ['./vitality-view.component.css']
})
export class VitalityViewComponent implements OnInit,AfterViewInit {

  public showZoomControl = true;
  public showAttributionControl = true;
  public map: L.Map;

  public baselayers: L.Layer[] = [];
  // public overviewMapLayers: Layer[] = [new Tile({
  //   source: new OSM()
  // })];
  public zoom = 14;
  public lat = 51.07;
  public lon = 7.21;

  public token: string = '';
  public sentinelLayer: esri.ImageMapLayer;
  public mapId = 'vitality-map';
  public fitBounds: L.LatLngBoundsExpression = [[50.985, 6.924], [51.319, 7.607]];
  public zoomControlOptions: L.Control.ZoomOptions = { position: 'topleft' };
  public avoidZoomToSelection = false;
  public baseMaps: Map<string, LayerOptions> = new Map<string, LayerOptions>();
  public overlayMaps: Map<string, LayerOptions> = new Map<string, LayerOptions>();
  public layerControlOptions: L.Control.LayersOptions = { position: 'bottomleft' };
  public cluster = true;
  public loadingStations: boolean;
  public stationFilter: ParameterFilter = {
    // phenomenon: '8'
  };
  public statusIntervals = false;
  public mapOptions: L.MapOptions = { dragging: true, zoomControl: false };
  public providerUrl: string = 'https://www.fluggs.de/sos2-intern-gis/api/v1/';
  constructor(private mapService: OlMapService, private requestTokenSrvc: RequestTokenService, private mapCache: MapCache) { }
  ngAfterViewInit(): void {
    this.baselayers.forEach((lay,i,arr)=>{
      this.mapCache.getMap(this.mapId).addLayer(lay);
    });
  }

  ngOnInit() {
  //   this.wmsLayer = L.tileLayer.wms('http://ows.terrestris.de/osm/service?',
  //   {
  //     layers: 'OSM-WMS', format: 'image/png', transparent: true, maxZoom: 16, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  //     className: 'OSM'
  //   });

  // this.mainMap = L.map(this.mapId, this.mapOptions).setView([51.161, 7.482], 10);

  // this.mainMap.addLayer(this.wmsLayer);
  // L.control.scale().addTo(this.mainMap);
  // this.mapCache.setMap(this.mapId,this.mainMap);
  this.baseMaps.set(this.mapId,
    {
        label: 'OSM-WMS', // will be shown in layer control
        visible: true, // is layer by default visible
        layer: L.tileLayer.wms(
          'http://ows.terrestris.de/osm/service?',
            {
              layers: 'OSM-WMS', format: 'image/png', transparent: true, maxZoom: 16, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
              className: 'OSM'
            }
        )
    }
);
    // var mousePosition = [];
   this.baselayers.push( L.tileLayer.wms(vitalityService,
    {
      layers: 'nadelwald_06_207_09_2018', format: 'image/png', transparent: true, maxZoom: 16, attribution: 'Datenlizenz Deutschland – Namensnennung – Version 2.0',
      className: 'nadel_2017_2018'
    })
    );

   
   
    // this.mapService.getMap(this.mapId).subscribe((map) => {
    //   map.getLayers().clear();
    //   map.addControl(new ScaleLine({units: "metric"}));
    //   map.addLayer(new Tile({
    //     source: new OSM(),
    //   }));

    //   map.addLayer(new ImageLayer({
    //     visible: true,
    //     opacity: 0.8,
    //     source: new ImageWMS({
    //       url: WvG_URL,
    //       params: {
    //         'LAYERS': '0',
    //       },
    //     })
    //   }));

    // });

    // this.baselayers.push(
    //   new ImageLayer({
    //     visible: false,
    //     source: new ImageWMS({
    //       attributions: "Datenlizenz Deutschland – Namensnennung – Version 2.0",
    //       params: {
    //         'LAYERS': 'nadelwald_06_207_09_2018',
    //       },
    //       url: vitalityService
    //     })
    //   })
    // );

    // this.baselayers.push(
    //   new ImageLayer({
    //     visible: false,
    //     source: new ImageWMS({
    //       attributions: "Datenlizenz Deutschland – Namensnennung – Version 2.0",
    //       params: {
    //         'LAYERS': 'nadelwald_06_2017_06_2019',
    //       },
    //       url: vitalityService
    //     })
    //   })
    // );
    // this.baselayers.push(
    //   new ImageLayer({
    //     visible: true,
    //     source: new ImageWMS({
    //       attributions: "Datenlizenz Deutschland – Namensnennung – Version 2.0",
    //       params: {
    //         'LAYERS': 'nadelwald_06_2017_08_2019',
    //       },
    //       url: vitalityService
    //     })
    //   })
    // );

    // this.baselayers.push(
    //   new ImageLayer({
    //     visible: false,
    //     source: new ImageWMS({
    //       attributions: "Datenlizenz Deutschland – Namensnennung – Version 2.0",
    //       params: {
    //         'LAYERS': 'windwurfschadflaechen_kyrill',
    //       },
    //       url: vitalityService
    //     })
    //   })
    // );
    
    // this.baselayers.push(
    //   new ImageLayer({
    //     visible: false,
    //     source: new ImageWMS({
    //       attributions: "Datenlizenz Deutschland – Namensnennung – Version 2.0",
    //       params: {
    //         'LAYERS': 'waldtypen_real',
    //       },
    //       url: vitalityService
    //     })
    //   })
    // );

   
  }
}