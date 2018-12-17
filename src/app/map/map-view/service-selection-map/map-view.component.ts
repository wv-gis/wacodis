import { Component, OnInit, AfterViewInit, Input, OnChanges, SimpleChanges, OnDestroy, AfterViewChecked } from '@angular/core';
import { MapCache, LayerOptions, GeoSearchOptions } from '@helgoland/map';
import * as L from 'leaflet';
import { ParameterFilter, Phenomenon, Station, DatasetApi, Service } from '@helgoland/core';
import { ExtendedSettingsService } from '../../../settings/settings.service';
import { ListSelectorService } from '@helgoland/selector';
import { SelectedUrlService } from '../../../services/selected-url.service';
import { Subscription, timer } from 'rxjs';
import '../../../../../node_modules/leaflet-side-by-side/index.js';
import { RestApiService } from '../../../services/rest-api.service';
import * as esri from "esri-leaflet";
// require ('./leaflet-sbs-range.css');
require('./split_layout.css')

L.Marker.prototype.options.icon = L.icon({
  iconUrl: 'assets/images/map-marker-alt-solid.svg',//'http://openstationmap.org/0.2.0/client/leaflet/images/marker-icon.png',
  iconAnchor: [12, 41],
  iconSize: [25, 41],
});

const senLayer = 'https://sentinel.arcgis.com/arcgis/rest/services/Sentinel2/ImageServer';
const WvG_URL = 'http://fluggs.wupperverband.de/secman_wss_v2/service/WMS_WV_Oberflaechengewaesser_EZG/guest?';
@Component({
  selector: 'wv-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css'],
  // providers: [SelectedUrlService]
})
export class MapViewComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy, OnChanges {


  public baseMaps: Map<string, LayerOptions> = new Map<string, LayerOptions>();
  public overlayMaps: Map<string, LayerOptions> = new Map<string, LayerOptions>();
  public stationMarker: L.CircleMarker;
  public zoomControlOptions: L.Control.ZoomOptions = { position: 'bottomleft' };
  public layerControlOptions: L.Control.LayersOptions = { position: 'bottomleft' };
  public mapOptions: L.MapOptions = { dragging: true, zoomControl: true, boxZoom: false };
  public fitBounds: L.LatLngBoundsExpression = [[50.985, 6.924], [51.319, 7.607]];

  public providerUrl: string;
  public label = 'Wupperverband Zeitreihen Dienst';
  public avoidZoomToSelection = false;
  public cluster = true;
  public loadingStations: boolean;
  public stationFilter: ParameterFilter = {};
  public statusIntervals: boolean = true;
  public searchOptions: GeoSearchOptions = { countrycodes: [] };
  public stationPopup: L.Popup;
  public serviceProvider: Service;
  public subscription: Subscription;
  public token: string;
  public imageAccess: Object;
  public sentinelLayer: esri.ImageMapLayer;
  public control: L.Control;

  constructor(private mapCache: MapCache, private settings: ExtendedSettingsService, private selectedService: SelectedUrlService, private resApiService: RestApiService) {

    this.subscription = selectedService.service$.subscribe((res) => {
      this.providerUrl = res.apiUrl;
      this.serviceProvider = res;
      console.log(this.serviceProvider);
      if (this.stationFilter.phenomenon !== undefined) {
        this.stationFilter = {};
      }
    });
    
  }
  ngOnChanges(simpleChanges) {
    console.log('Change in Map View Component')

  }
  ngAfterViewInit(): void {
    this.mapCache.getMap('map').on('zoomend', (event) => {
      const map: L.Map = event.target;
      this.mapCache.getMap('map').fitBounds(map.getBounds());

    });

    let overlays = {
      'DWD Prognose': this.overlayMaps.get('DWD').layer,
      'Wupperverbandsgebiet': this.overlayMaps.get('WvG').layer,
      'Terrain': this.baseMaps.get('Ter').layer
    };
    this.control = L.control.layers(null, overlays, this.layerControlOptions);
    this.control.addTo(this.mapCache.getMap('map'));

  }

  ngAfterViewChecked(): void {



    // console.log(this.overlayMaps.get('DWD').visible);
    // if(this.overlayMaps.get('DWD').visible){
    //   console.log('test');
    //   this.controlLegend.getContainer().innerHTML=`<div> <img src="https://maps.dwd.de/geoserver/dwd/wms?version=1.1.0&request=GetLegendGraphic&layer=dwd:FX-Produkt&format=image/png"></img></div>`;
    // }
  }



  ngOnInit() {

    this.addSentinelLayer('https://sentinel.arcgis.com/arcgis/rest/services/Sentinel2/ImageServer');

    this.baseMaps.set('map',
      {
        label: 'Open Street Map', visible: true, layer: L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png',
          { maxZoom: 16, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>', className: 'Open Street Map' })
      });
    this.baseMaps.set('Ter', {
      label: 'Terrain', visible: true, layer: L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png', {
        maxZoom: 16, attribution: '&copy; <a href="http://maps.stamen.com">Stamen Tiles Design</a>', className: 'Terrain'
      })
    });
    this.overlayMaps.set('WvG',
      {
        label: "Wupperverbandsgebiet", visible: false,
        layer: L.tileLayer.wms(WvG_URL, { layers: '0', format: 'image/png', transparent: true, attribution: '', pane: 'overlayPane', className: 'Verbandsgebiet' })
      });

    this.overlayMaps.set('DWD',
      {
        label: "DWD Daten", visible: false,
        layer: L.tileLayer.wms('https://maps.dwd.de/geoserver/dwd/wms?', {
          layers: 'dwd:Warnungen_Gemeinden_vereinigt, dwd:FX-Produkt', format: 'image/png', transparent: true,
          attribution: '&copy; <a href="https://maps.dwd.de">DWD Geoserver</a>', pane: 'overlayPane', updateInterval: 300000, className: 'DWD'
        })
      });

  }

  public addSentinelLayer(url: string) {

    this.sentinelLayer = esri.imageMapLayer({
      url: url, position: 'pane', maxZoom: 16, pane: 'tilePane'
    })

    if (!this.resApiService.getToken()) {
      this.resApiService.requestToken().subscribe((res) => {

        this.imageAccess = res;
        this.token = this.imageAccess['access_token'];
        this.sentinelLayer.authenticate(this.token);
        this.sentinelLayer.setBandIds('4,3,2');
        this.overlayMaps.set('EsriSen', {
          label: 'Esri Sentinel Service', visible: false, layer: this.sentinelLayer
        });

        this.resApiService.setToken(this.token);
      });
    }
    else {
      this.sentinelLayer.authenticate(this.resApiService.getToken())
      this.overlayMaps.set('EsriSen', {
        label: 'Esri Sentinel Service', visible: false, layer: this.sentinelLayer
      });
    }
  }
  public onStationSelected(station: Station) {
    const point = station.geometry as GeoJSON.Point;
    this.stationPopup = L.popup().setLatLng([point.coordinates[1], point.coordinates[0]])
      .setContent(`<div> ID:  ${station.properties.id} </div><div> ${station.properties.label} </div>`)
      .openOn(this.mapCache.getMap('map'));

  }

  public onSelectPhenomenon(phenomenon: Phenomenon) {
    this.stationFilter = {
      phenomenon: phenomenon.id
    };
  }


  removeStationFilter() {
    this.stationFilter = {};
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
