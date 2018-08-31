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


L.Marker.prototype.options.icon = L.icon({
  iconUrl: 'http://openstationmap.org/0.2.0/client/leaflet/images/marker-icon.png',
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
export class MapViewComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {


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
  public range;
  public imageAccess: Object;
  public controlLegend: L.Control;
  public container: HTMLElement;
  public divider;
  public mapWasDragEnabled: boolean;
  public mapWasTapEnabled: boolean;
  public sentinelLayer: esri.ImageMapLayer;

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

  ngAfterViewInit(): void {
    this.mapCache.getMap('map').on('zoomend', (event) => {
      const map: L.Map = event.target;
      this.mapCache.getMap('map').fitBounds(map.getBounds());

    });
    // this.controlLegend = L.control.layers(null,this.overlayMaps.get('DWD').layer[0], this.layerControlOptions);
    // document.getElementById('splitter').addEventListener('click', this.addSplitScreen());
    // this.mapCache.getMap('map').addControl(this.controlLegend);
   this.createRange();
    // this.addSplitScreen();
  }
  createRange() {
    this.container = L.DomUtil.create('div', 'leaflet-sps', this.mapCache.getMap('map').getContainer().children['1']);
    this.container.style.marginTop = '40%';
    //setdivider symbol
    this.divider = L.DomUtil.create('i', 'fas fa-circle leaflet-sps-divider', this.container)
    this.divider.style.size = '3x';
    this.divider.style.position = 'absolute';
    this.divider.style.zIndex = 902;

    //define range slider options
    this.range = L.DomUtil.create('input', 'leaflet-sps-range', this.container);
    this.range.id = 'range';
    this.range.type = 'range';
    this.range.min = 0;
    this.range.max = 1;
    this.range.value = 0.5;
    this.range.step = 'any';
    this.range.style.paddingLeft = this.range.style.paddingRight = 0 + 'px';
    this.range.style.width = '100%';
  }

  addSplitScreen(){
    let nw = this.mapCache.getMap('map').containerPointToLayerPoint([0, 0]);
    let se = this.mapCache.getMap('map').containerPointToLayerPoint(this.mapCache.getMap('map').getSize());
    // let clipX = nw.x + (se.x - nw.x) * this.range.value;
    let clipX = nw.x + ((this.mapCache.getMap('map').getSize().x * this.range.value) + (0.5 - this.range.value) * 42);
    let dividerX = ((this.mapCache.getMap('map').getSize().x * this.range.value) + (0.5 - this.range.value) * 42);
    this.divider.style.left = dividerX + 'px';

    for (let i = 0; i < this.mapCache.getMap('map').getPanes()['tilePane'].getElementsByClassName('leaflet-layer').length; i++) {
      if (i == 0)
        this.mapCache.getMap('map').getPanes()['tilePane'].getElementsByClassName('leaflet-layer')
          .item(i).setAttribute('style', 'clip: rect(' + [nw.y, se.x, se.y, clipX].join('px,') + 'px);');
      else {
        if (i < 2) {
          this.mapCache.getMap('map').getPanes()['tilePane'].getElementsByClassName('leaflet-layer')
            .item(i).setAttribute('style', 'clip: rect(' + [nw.y, clipX, se.y, nw.x].join('px,') + 'px);');
        }
        else {

        }
      }
    }
    
  }
  ngAfterViewChecked(): void {
    this.range = document.getElementById('range');
    this.range['oninput' in this.range ? 'input' : 'change'] = this.addSplitScreen();
    this.mapCache.getMap('map').on('move', this.addSplitScreen, this)

   L.DomEvent.on(this.range,'mouseover',this.cancelMapDrag, this);
   L.DomEvent.on(this.range, 'mouseout', this.uncancelMapDrag, this) ;
  
    // this.addSplitScreen();
    // console.log(this.overlayMaps.get('DWD').visible);
    // if(this.overlayMaps.get('DWD').visible){
    //   console.log('test');
    //   this.controlLegend.getContainer().innerHTML=`<div> <img src="https://maps.dwd.de/geoserver/dwd/wms?version=1.1.0&request=GetLegendGraphic&layer=dwd:FX-Produkt&format=image/png"></img></div>`;
    // }
  }
 
  cancelMapDrag() {
    this.mapWasDragEnabled = this.mapCache.getMap('map').dragging.enabled()
    if (this.mapCache.getMap('map').tap && this.mapCache.getMap('map').tap.enabled()) {
      this.mapWasTapEnabled = true;    
       this.mapCache.getMap('map').tap.disable();
    }
    else {
      this.mapWasTapEnabled = false
    }
     this.mapCache.getMap('map').dragging.disable();
  }

  uncancelMapDrag(e) { 
    if (this.mapWasDragEnabled) {
     this.mapCache.getMap('map').dragging.enable()
    }
    if (this.mapWasTapEnabled) {
      this.mapCache.getMap('map').tap.enable()
    }
  }

  ngOnInit() {

    this.addSentinelLayer('https://sentinel.arcgis.com/arcgis/rest/services/Sentinel2/ImageServer');

    this.baseMaps.set('map',
      {
        label: 'Open Street Map', visible: true, layer: L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png',
          { maxZoom: 18, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' })
      });
    this.overlayMaps.set('Ter', {
      label: 'Terrain', visible: true, layer: L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png', {
        maxZoom: 18, attribution: '&copy; <a href="http://maps.stamen.com">Stamen Tiles Design</a>'
      })
    });
    this.overlayMaps.set('WvG',
      {
        label: "Wupperverbandsgebiet", visible: false,
        layer: L.tileLayer.wms(WvG_URL, { layers: '0', format: 'image/png', transparent: true, attribution: '', pane: 'overlayPane' })
      });

    this.overlayMaps.set('DWD',
      {
        label: "DWD Daten", visible: false,
        layer: L.tileLayer.wms('https://maps.dwd.de/geoserver/dwd/wms?', {
          layers: 'dwd:Warnungen_Gemeinden_vereinigt, dwd:FX-Produkt', format: 'image/png', transparent: true,
          attribution: '&copy; <a href="https://maps.dwd.de">DWD Geoserver</a>', pane: 'overlayPane', updateInterval: 300000
        })
      });
  }

  public addSentinelLayer(url: string) {

    this.sentinelLayer = esri.imageMapLayer({
      url: url, position: 'pane', maxZoom: 18, pane: 'tilePane'
    })

    if (!this.resApiService.getToken()) {
      this.resApiService.requestToken().subscribe((res) => {

        this.imageAccess = res;
        this.token = this.imageAccess['access_token']; 
        this.sentinelLayer.authenticate(this.token);
        this.sentinelLayer.setBandIds('8,4,3');
        this.baseMaps.set('EsriSen', {
          label: 'Esri Sentinel Service', visible: false, layer: this.sentinelLayer
        });

        this.resApiService.setToken(this.token);
      });
    }
    else {
      this.sentinelLayer.authenticate(this.resApiService.getToken())
      this.baseMaps.set('EsriSen', {
        label: 'Esri Sentinel Service', visible: false, layer: this.sentinelLayer
        //  renderingRule: {
        //   "rasterFunction": "NDVI", "rasterFunctionArguments": {
        //     "VisibleBandID": 2, "InfraredBandID": 1
        //   }, "variableName": "Raster"
        // }
        // })
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
