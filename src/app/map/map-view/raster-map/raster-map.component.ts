import { Component, OnInit } from '@angular/core';
import { LayerOptions, MapCache } from '@helgoland/map';
import * as L from 'leaflet';

@Component({
  selector: 'wv-raster-map',
  templateUrl: './raster-map.component.html',
  styleUrls: ['./raster-map.component.css']
})
export class RasterMapComponent implements OnInit {

  public baseMaps: Map<string, LayerOptions> = new Map<string, LayerOptions>();
  public overlayMaps: Map<string, LayerOptions> = new Map<string, LayerOptions>();
  public stationMarker: L.CircleMarker;
  public zoomControlOptions: L.Control.ZoomOptions = { position: 'bottomleft' };
  public layerControlOptions: L.Control.LayersOptions = { position: 'bottomleft' };
  public mapOptions: L.MapOptions = { dragging: true, zoomControl: true, boxZoom: false };
  public fitBounds: L.LatLngBoundsExpression = [[50.985, 6.924], [51.319, 7.607]];
  
  constructor(private mapCache: MapCache) { }

  ngOnInit() {
    this.baseMaps.set('map',
      {
        label: 'Open Street Map', visible: true, layer: L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png',
          { maxZoom: 18, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' })
      });
      this.baseMaps.set('secMap',{
        label: 'OpenStreetMap', visible: true, layer: L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png',
        {maxZoom: 18, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'})
      });
  }

}
