import { Component, OnInit , AfterViewInit} from '@angular/core';
// declare var require: any;
// require('leaflet-panel-layers');
import * as L from 'leaflet';
import * as esri from 'esri-leaflet';
import { LayerOptions, GeoSearchOptions, MapCache } from '@helgoland/map';
import { ParameterFilter, Station, Phenomenon, SettingsService, Settings } from '@helgoland/core';
import { settings } from 'src/environments/environment';
import { settingsPromise } from 'src/environments/environment.prod';
import { RequestTokenService } from 'src/app/services/request-token.service';
// import { ImageMapLayer } from 'esri-leaflet';

L.Marker.prototype.options.icon = L.icon({
  iconUrl: 'assets/images/map-marker-alt-solid.svg',
  iconAnchor: [12, 41],
  iconSize: [25, 41],
});

const senLayer = 'https://sentinel.arcgis.com/arcgis/rest/services/Sentinel2/ImageServer';
const WvG_URL = 'http://fluggs.wupperverband.de/secman_wss_v2/service/WMS_WV_Oberflaechengewaesser_EZG/guest?';


@Component({
  selector: 'wv-selection-map',
  templateUrl: './selection-map.component.html',
  styleUrls: ['./selection-map.component.css']
})
export class SelectionMapComponent implements OnInit, AfterViewInit {
  public baseMaps: Map<string, LayerOptions> = new Map<string, LayerOptions>();
  public overlayMaps: Map<string, LayerOptions> = new Map<string, LayerOptions>();
  public stationMarker: L.CircleMarker;
  public zoomControlOptions: L.Control.ZoomOptions = { position: 'bottomleft' };
  public layerControlOptions: L.Control.LayersOptions = { position: 'bottomleft' };
  public mapOptions: L.MapOptions = { dragging: true, zoomControl: true, boxZoom: false };
  public fitBounds: L.LatLngBoundsExpression = [[50.985, 6.924], [51.319, 7.607]];;
  public searchOptions: GeoSearchOptions = { countrycodes: [] };

  public providerUrl: string = 'https://www.fluggs.de/sos2-intern-gis/api/v1/'//"http://www.fluggs.de/sos2/api/v1/";
  public label = 'Wupperverband Zeitreihen Dienst';
  public avoidZoomToSelection = false;
  public cluster = true;
  public loadingStations: boolean;
  public stationFilter: ParameterFilter = {};
  public statusIntervals: boolean = true;
  public panelControlOptions: L.PanelOptions = { title: 'LayerTree' };
  // public baselayers: L.PanelBaseLayer[] = [];
  // public overlays: L.PanelBaseLayer[] = [];
  public stationPopup: L.Popup;
  public control: L.Control = new L.Control();
  public token: string = '';
  public sentinelLayer: esri.ImageMapLayer;

  constructor(private mapCache: MapCache, private settingsService: SettingsService<Settings>, private requestTokenSrvc: RequestTokenService) {
    if (this.settingsService.getSettings().datasetApis) {
      this.providerUrl = this.settingsService.getSettings().datasetApis[0].url;
      // console.log(this.providerUrl);
    }
  }
  ngAfterViewInit() {
//  L.control.layers({ "Terrain": this.baseMaps.get('Ter').layer, "OSM": this.baseMaps.get('map').layer },
//       { "DWD Warnungen/Radar": this.overlayMaps.get('DWD').layer, 'Wupperverbandsgebiet': this.overlayMaps.get('WvG').layer,
//         'Landbedeckung2': this.overlayMaps.get('Landbedeckung2').layer, 'Feldbloecke': this.overlayMaps.get('Feldbloecke').layer },
//       this.layerControlOptions);


    // PanelBaseLayer
    // this.baselayers.push( L.panelBaseLayer({ name: 'BaseMaps', layer: this.baseMaps.get('Ter').layer }));
    // this.overlays.push(L.panelBaseLayer({ name: 'Overlays', layer: this.overlayMaps.get('DWD').layer }));

    // L.control.panelLayers(this.baselayers, this.overlays, this.panelControlOptions).addTo(this.mapCache.getMap('map'));
    //   var baseLayers = [
    //     {
    //       active: true,
    //       name: "OpenStreetMap",
    //       layer: this.overlayMaps.get('DWD').layer,

    //     }
    //   ];
    //   var overLayers = [
    //     {
    //       name: "Drinking Water",
    //       icon: '<i class="icon icon-water"></i>',
    //       layer: this.overlayMaps.get('DWD').layer
    //     },
    //     {
    //       active: true,
    //       name: "Parking",
    //       icon: '<i class="icon icon-parking"></i>',
    //       layer: this.baseMaps.get('Ter').layer
    //     }
    //   ];
    //   this.mapCache.getMap('map').addControl(new L.Control.PanelLayers(baseLayers, overLayers, this.panelControlOptions));
    //   L.control.panelLayers(
    //     [
    //         {
    //             name: "Open Street Map",
    //             layer: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    //         },
    //         {
    //             group: "Walking layers",
    //             layers: [
    //                 {
    //                     name: "Open Cycle Map",
    //                     layer: L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png')
    //                 },
    //                 {
    //                     name: "Hiking",
    //                     layer: L.tileLayer("http://toolserver.org/tiles/hikebike/{z}/{x}/{y}.png")
    //                 }
    //             ]
    //         },
    //         {
    //             group: "Road layers",
    //             layers: [
    //                 {
    //                     name: "Transports",
    //                     layer: L.tileLayer("http://{s}.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png")
    //                 }
    //             ]
    //         }
    //     ],null,
    //     {collapsibleGroups: true}
    // ).addTo(this.mapCache.getMap('map'));
  }
  ngOnInit() {
    // https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png
   
//     this.baseMaps.set('map',
//       {
//         label: 'Open Street Map', visible: true, layer: L.tileLayer.wms('http://ows.terrestris.de/osm/service?',
//           { layers: 'OSM-WMS',format: 'image/png',transparent: true, maxZoom: 16, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>', className: 'Open Street Map' })
//       });
//     this.baseMaps.set('Ter', {
//       label: 'Terrain', visible: false, layer: L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png', {
//         maxZoom: 16, attribution: '&copy; <a href="http://maps.stamen.com">Stamen Tiles Design</a>', className: 'Terrain'
//       })
//     });
//     this.control.setPosition('topright');

//     this.overlayMaps.set('DWD',
//       {
//         label: "DWD Daten", visible: false,
//         layer: L.tileLayer.wms('https://maps.dwd.de/geoserver/dwd/wms?', {
//           layers: 'dwd:Warnungen_Gemeinden_vereinigt, dwd:FX-Produkt', format: 'image/png', transparent: true,
//           attribution: '&copy; <a href="https://maps.dwd.de">DWD Geoserver</a>', pane: 'overlayPane', updateInterval: 300000, className: 'DWD'
//         })
//       });
//     this.overlayMaps.set('WvG',
//       {
//         label: "Wupperverbandsgebiet", visible: false,
//         layer: L.tileLayer.wms(WvG_URL, { layers: '0', format: 'image/png', transparent: true, attribution: '', pane: 'overlayPane', className: 'Verbandsgebiet' })
//       });
//         this.sentinelLayer = esri.imageMapLayer({ 
//           url: senLayer, from: new Date(new Date().getTime() - 360000000), to: new Date(), bandIds: ('4,3,2') });
//      console.log(this.sentinelLayer);
//        this.requestTokenSrvc.requestToken().subscribe((res)=>{
//          this.token = res['access_token'];
//          console.log(this.token);
//         this.sentinelLayer.authenticate(this.token);

//        });
//        this.overlayMaps.set('Esri', {
//         label: 'Sentinel', visible: false, layer: this.sentinelLayer
//       });

//     this.overlayMaps.set('Landbedeckung2', {
//       label: 'Landbedeckung2', visible: false,
//       layer: L.imageOverlay(
//         'https://wacodis.maps.arcgis.com/sharing/rest/content/items/846c30b6a1874841ac9d5f6954f19aad/data',[[51.299046, 6.949204],[51.046668,7.615934]] ,{opacity: 0.6})
 
//     });
//     this.overlayMaps.set('Feldbloecke', {
//       label: 'Feldbloecke', visible: false,
//       layer: esri.featureLayer({url:'http://www.gis.nrw.de/arcgis/rest/services/gd/erosion/MapServer/0/'})
//  //layer: fbf:DGL (Dauergrünland),fbf:FB_AKT (Feldblöcke), http://www.landwirtschaftskammer.de/gwms/?
//     });
    // this.overlayMaps.set('ArcGIS Test',{ label: 'ArcGIS Test', visible: true, layer: esri.featureLayer({url: 'https://services-tlstest.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer',useCors: true})});
  }

  public onStationSelected(station: Station) {
    const point = station.geometry as GeoJSON.Point;
    // this.stationPopup = L.popup().setLatLng([point.coordinates[1], point.coordinates[0]])
    //   .setContent(`<div> ID:  ${station.properties.id} </div><div> ${station.properties.label} </div>`)
    //   .openOn(this.mapCache.getMap('map'));

  }
public changePic(){
document.getElementById('prototypePic').setAttribute('src','assets/images/Kartenansicht.png')
}
  public onSelectPhenomenon(phenomenon: Phenomenon) {
    this.stationFilter = {
      phenomenon: phenomenon.id
    };
  }


  removeStationFilter() {
    this.stationFilter = {};
  }

  changeProvider(url: string) {
    this.providerUrl = url;
    // this.fitBounds = [[, ],[, ]];

    console.log(this.fitBounds);
  }
}
