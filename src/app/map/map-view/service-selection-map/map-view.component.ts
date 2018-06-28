import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MapCache, LayerOptions, GeoSearchOptions } from '@helgoland/map';
import * as L from 'leaflet';
import { ParameterFilter, Phenomenon, Station, DatasetApi, Service } from '@helgoland/core';
import { ExtendedSettingsService } from '../../../settings/settings.service';


L.Marker.prototype.options.icon = L.icon({
  iconUrl: 'http://openstationmap.org/0.2.0/client/leaflet/images/marker-icon.png',
  iconAnchor: [12, 41],
  iconSize: [25, 41],
});


const WvG_URL = 'http://fluggs.wupperverband.de/secman_wss_v2/service/WMS_WV_Oberflaechengewaesser_EZG/guest?';
@Component({
  selector: 'wv-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit, AfterViewInit {

  public baseMaps: Map<string, LayerOptions> = new Map<string, LayerOptions>();
  public overlayMaps: Map<string, LayerOptions> = new Map<string, LayerOptions>();
  public stationMarker: L.CircleMarker;
  public zoomControlOptions: L.Control.ZoomOptions = { position: 'bottomleft' };
  public layerControlOptions: L.Control.LayersOptions = { position: 'bottomleft' };
  public mapOptions: L.MapOptions = { dragging: true, zoomControl: true, boxZoom: false };
  public fitBounds: L.LatLngBoundsExpression = [[50.985, 6.924], [51.319, 7.607]];

  public providerUrl = '';
  public label = 'Wupperverband Zeitreihen Dienst';
  public avoidZoomToSelection = false;
  public cluster = true;
  public loadingStations: boolean;
  public stationFilter: ParameterFilter = {};
  public statusIntervals: boolean = true;
  public searchOptions: GeoSearchOptions = { countrycodes: [] };
  public stationPopup: L.Popup;
  public serviceProvider: Service;
  public imageUrl = 'http://sentinel-s2-l1c.s3-website.eu-central-1.amazonaws.com/tiles/32/U/LB/2018/6/4/0/preview.jpg';


  constructor(private mapCache: MapCache, private settings: ExtendedSettingsService) {
    // if(settings.getSettings().datasetApis){
    //   this.providerUrl = settings.getSettings().datasetApis[0].url;
    // }
    // else{
    //   this.providerUrl = 'http://www.fluggs.de/sos2/api/v1/';
    // }
    
   }

  ngAfterViewInit(): void {
    this.mapCache.getMap('map').on('zoomend', (event) => {
      const map: L.Map = event.target;

    });
  }


  ngOnInit() {
    this.baseMaps.set('map',
      {
        label: 'Open Street Map', visible: true, layer: L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png',
          { maxZoom: 18, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' })
      });

    this.overlayMaps.set('WvG',
      {
        label: "Wupperverbandsgebiet", visible: false,
        layer: L.tileLayer.wms(WvG_URL, { layers: '0', format: 'image/png', transparent: true })
      });

    this.overlayMaps.set('Sentinel0406',
      {
        label: "Sentinel Raster", visible: false,
        layer: L.imageOverlay(this.imageUrl, [[50.429727,5.81551], [51.366602, 7.45059]])
      });
  }



  public onStationSelected(station: Station) {
    if (!station.properties.timeseries) {
      this.stationPopup = L.popup().setLatLng([station.geometry.coordinates[1], station.geometry.coordinates[0]])
        .setContent(`<div> ID:  ${station.properties.id} </div><div> ${station.properties.label} </div>`)
        .openOn(this.mapCache.getMap('map'));
    }
    else {
      this.stationPopup = L.popup().setLatLng([station.geometry.coordinates[1], station.geometry.coordinates[0]])
        .setContent(`<div> ID:  ${station.properties.id} </div><div> ${station.properties.label} </div><div> LetzterWert: ${station.properties.timeseries} </div>`)
        .openOn(this.mapCache.getMap('map'));
    }
  }

  public onSelectPhenomenon(phenomenon: Phenomenon) {
    this.stationFilter = {
      phenomenon: phenomenon.id
    };
  }

  public setProviderUrl(url: Service) {
    this.providerUrl = url.apiUrl;
    this.serviceProvider = url;
    console.log('Test');
    if (this.stationFilter.phenomenon !== undefined) {
      this.stationFilter = {};
    }
    this.label = url.label;
  }

  private removeStationFilter() {
    this.stationFilter = {};
  }
}
