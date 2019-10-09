import { Component, OnInit} from '@angular/core';
import * as esri from 'esri-leaflet';
import { LayerOptions, GeoSearchOptions, MapCache } from '@helgoland/map';
import { ParameterFilter, Station, Phenomenon, SettingsService, Settings } from '@helgoland/core';
import { settings } from 'src/environments/environment';
import { settingsPromise } from 'src/environments/environment.prod';
import { RequestTokenService } from 'src/app/services/request-token.service';
import BaseLayer from 'ol/layer/Base';
import Layer from 'ol/layer';
import TileLayer from 'ol/layer/Tile';
import { OlMapService } from '@helgoland/open-layers';
import {OSM, TileWMS} from 'ol/source';




const senLayer = 'https://sentinel.arcgis.com/arcgis/rest/services/Sentinel2/ImageServer';
const WvG_URL = 'http://fluggs.wupperverband.de/secman_wss_v2/service/WMS_WV_Oberflaechengewaesser_EZG/guest?';


@Component({
  selector: 'wv-selection-map',
  templateUrl: './selection-map.component.html',
  styleUrls: ['./selection-map.component.css']
})
export class SelectionMapComponent implements OnInit{
 
 
  public searchOptions: GeoSearchOptions = { countrycodes: [] };

  public providerUrl: string = 'https://www.fluggs.de/sos2-intern-gis/api/v1/';//"http://www.fluggs.de/sos2/api/v1/";
  public label = 'Wupperverband Zeitreihen Dienst';
  public showZoomControl = false;
  public showAttributionControl = false;

  public baselayers: BaseLayer[] = [];
  public overviewMapLayers: Layer[] = [new TileLayer({source: new OSM()})];
  public zoom = 6;
  public lat = 51.2;
  public lon = 9.12;

  public token: string = '';
  public sentinelLayer: esri.ImageMapLayer;
  public mapId = 'test-map';

  constructor(private mapService: OlMapService, private settingsService: SettingsService<Settings>, private requestTokenSrvc: RequestTokenService) {
    if (this.settingsService.getSettings().datasetApis) {
      this.providerUrl = this.settingsService.getSettings().datasetApis[0].url;
    }
  }


  ngOnInit() {

    this.baselayers.push(new TileLayer({
      visible: true,
      source: new TileWMS({
        url: 'https://maps.dwd.de/geoserver/ows',
        params: {
          'LAYERS': 'dwd:RX-Produkt',
        }
      })
    }));

    this.baselayers.push(new TileLayer({
      visible: false,
      source: new TileWMS({
        url: 'https://maps.dwd.de/geoserver/ows',
        params: {
          'LAYERS': 'dwd:FX-Produkt',
        }
      })
    }));

    
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

  public stationSelected(station: Station) {
    alert(station.properties.label);
    console.log(station);

  }
  public toggleVisibility(layer: BaseLayer ) {
  
    layer.setVisible(!layer.getVisible());
  }


  public removeLayer(i: number) {
    const layer = this.baselayers.splice(i,1);
    this.mapService.getMap(this.mapId).subscribe(map => map.removeLayer(layer[0]));
  }

 public getLegendUrl(url: string) {
   alert(url);
    console.log(url);

  }

  public changePic(){
    document.getElementById('prototypePic').setAttribute('src','assets/images/Kartenansicht.png')
    }
      public onSelectPhenomenon(phenomenon: Phenomenon) {
        // this.stationFilter = {
        //   phenomenon: phenomenon.id
        // };
      }
}
