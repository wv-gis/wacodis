import { Component, OnInit } from '@angular/core';
import * as esri from 'esri-leaflet';
import { LayerOptions, GeoSearchOptions, MapCache } from '@helgoland/map';
import { ParameterFilter, Station, Phenomenon, SettingsService, Settings } from '@helgoland/core';
import { settings } from 'src/environments/environment';
import { settingsPromise } from 'src/environments/environment.prod';
import { RequestTokenService } from 'src/app/services/request-token.service';
import BaseLayer from 'ol/layer/Base';
import Layer from 'ol/layer/Layer';
import TileLayer from 'ol/layer/Tile';
import { OlMapService } from '@helgoland/open-layers';
import { OSM, TileWMS, ImageWMS, ImageArcGISRest } from 'ol/source';
import ImageLayer from 'ol/layer/Image';
import Map from 'ol/Map.js';
import { fromLonLat } from 'ol/proj';
import View from 'ol/View';
import { Attribution, Control, Zoom } from 'ol/control';
import XYZ from 'ol/source/XYZ';
import { Tile } from 'ol/layer';





const senLayer = 'https://sentinel.arcgis.com/arcgis/rest/services/Sentinel2/ImageServer';
const landService = "https://gis.wacodis.demo.52north.org:6443/arcgis/rest/services/WaCoDiS/EO_WACODIS_DAT_LANDCOVERService/ImageServer";
const WvG_URL = 'http://fluggs.wupperverband.de/secman_wss_v2/service/WMS_WV_Oberflaechengewaesser_EZG/guest?';


@Component({
  selector: 'wv-selection-map',
  templateUrl: './selection-map.component.html',
  styleUrls: ['./selection-map.component.css']
})
export class SelectionMapComponent implements OnInit {


  public searchOptions: GeoSearchOptions = { countrycodes: [] };

  public providerUrl: string = 'https://www.fluggs.de/sos2-intern-gis/api/v1/';//"http://www.fluggs.de/sos2/api/v1/";
  public label = 'Wupperverband Zeitreihen Dienst';
  public showZoomControl = true;
  public showAttributionControl = true;
  public map: Map;

  public baselayers: BaseLayer[] = [];
  public overviewMapLayers: Layer[] = [new Tile({
    source: new OSM()
  })];
  public zoom = 11;
  public lat = 51.15;
  public lon = 7.22;

  public token: string = '';
  public sentinelLayer: esri.ImageMapLayer;
  public mapId = 'test-map';

  constructor(private mapService: OlMapService, private settingsService: SettingsService<Settings>, private requestTokenSrvc: RequestTokenService) {
    if (this.settingsService.getSettings().datasetApis) {
      this.providerUrl = this.settingsService.getSettings().datasetApis[0].url;
    }
  }


  ngOnInit() {
    this.mapService.getMap(this.mapId).subscribe((map) => {
      map.getLayers().clear();
      map.addLayer(new Tile({
        source: new OSM()
      }));
    });

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
    this.baselayers.push(new ImageLayer({
      visible: false,
      source: new ImageWMS({
        url: ' https://www.wms.nrw.de/umwelt/waldNRW',
        attributions: "Datenlizenz Deutschland – Namensnennung – Version 2.0",
        params: {
          'LAYERS': 'waldbedeckung_Sentinel2',
        }
      })
    }));

    this.baselayers.push(new ImageLayer({
      visible: true,
      opacity: 0.5,
      source: new ImageWMS({
        url: WvG_URL,
        params: {
          'LAYERS': '0',
        },
      })
    }));

    this.baselayers.push(
      new ImageLayer({
        visible: false,
        source: new ImageArcGISRest({
          ratio: 1,
          params: {
            'LAYERS': 'Wacodis/EO_WACODIS_DAT_LANDCOVERService',
          },
          url: landService
        })
      })
    );

    // this.baselayers.push(
    //   new ImageLayer({
    //     visible: false,
    //     source: new ImageArcGISRest({
    //       ratio: 1,
    //       params: {
    //         'LAYERS': '1',
    //       },
    //       url: "https://image.discomap.eea.europa.eu/arcgis/services/RiparianZones/LCLU/MapServer/WMSServer"
    //     })
    //   })
    // );
   
    //Riparian Zones Land Cover Land USe WMS
    // https://image.discomap.eea.europa.eu/arcgis/services/RiparianZones/LCLU/MapServer/WMSServer
    

  
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

  public changePic() {
    document.getElementById('prototypePic').setAttribute('src', 'assets/images/Kartenansicht.png')
  }
  public onSelectPhenomenon(phenomenon: Phenomenon) {
    // this.stationFilter = {
    //   phenomenon: phenomenon.id
    // };
  }

 
}
