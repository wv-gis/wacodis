import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MapCache, LayerOptions, GeoSearchOptions } from '@helgoland/map';
import * as L from 'leaflet';
import { ParameterFilter, Phenomenon, Station, DatasetApi, Service } from '@helgoland/core';


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

  public providerUrl = 'http://www.fluggs.de/sos2/api/v1/';
  public label = 'Wupperverband Zeitreihen Dienst';
  public avoidZoomToSelection = false;
  public cluster = true;
  public loadingStations: boolean;
  public stationFilter: ParameterFilter = {
    // phenomenon: '8'
  };
  public statusIntervals: boolean = true;
  public searchOptions: GeoSearchOptions = { countrycodes: [] };
  public stationPopup: L.Popup;
  public isVisible: true;


  constructor(private mapCache: MapCache) { }

  ngAfterViewInit(): void {
    this.mapCache.getMap('map').on('zoomend', (event) => {
      const map: L.Map = event.target;
      console.log(map.getBounds());

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
  }

  public onStationSelected(station: Station) {
    console.log('Clicked station: ' + station.properties.label);
    if (!station.properties.timeseries) {
      this.stationPopup = L.popup().setLatLng([station.geometry.coordinates[1], station.geometry.coordinates[0]])
        .setContent(`<div> ID:  ${station.properties.id} </div><div> ${station.properties.label} </div>`)
        .openOn(this.mapCache.getMap('map'));
      console.log('No timeseries');
    }
    else {
      this.stationPopup = L.popup().setLatLng([station.geometry.coordinates[1], station.geometry.coordinates[0]])
        .setContent(`<div> ID:  ${station.properties.id} </div><div> ${station.properties.label} </div><div> LetzterWert: ${station.properties.timeseries} </div>`)
        .openOn(this.mapCache.getMap('map'));
    }
  }

  public onSelectPhenomenon(phenomenon: Phenomenon) {
    console.log('Select: ' + phenomenon.label + ' with ID: ' + phenomenon.id);
    this.stationFilter = {
      phenomenon: phenomenon.id
    };
    // console.log(this.providerUrl);
  }

  public setProviderUrl(url: Service) {
    this.providerUrl = url.apiUrl;
    if (this.stationFilter) {
      this.stationFilter = {};
    }
    this.label = url.label;
    console.log("SelectedProvider: " + url.apiUrl);
  }
  removeStationFilter() {
    this.stationFilter = {};
  }
}
