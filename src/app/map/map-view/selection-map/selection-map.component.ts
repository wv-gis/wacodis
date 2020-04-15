import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as esri from 'esri-leaflet';
import { GeoSearchOptions, LayerOptions, MapCache } from '@helgoland/map';
import { Station, Phenomenon, SettingsService, Settings, ParameterFilter } from '@helgoland/core';
// import { RequestTokenService } from 'src/app/services/request-token.service';
// import BaseLayer from 'ol/layer/Base';
// import Layer from 'ol/layer/Layer';
// import TileLayer from 'ol/layer/Tile';
import { OlMapService } from '@helgoland/open-layers';
// import { OSM, TileWMS, ImageArcGISRest } from 'ol/source';
// import ImageLayer from 'ol/layer/Image';
// import Map from 'ol/Map.js';
// import { ScaleLine } from 'ol/control';
// import { Tile } from 'ol/layer';
// import ImageWMS from 'ol/source/ImageWMS';

import * as L from 'leaflet';


const senLayer = 'https://sentinel.arcgis.com/arcgis/rest/services/Sentinel2/ImageServer';
const WvG_URL = 'http://fluggs.wupperverband.de/secman_wss_v2/service/WMS_WV_Oberflaechengewaesser_EZG/guest?';
const wacodisUrl = "https://gis.wacodis.demo.52north.org:6443/arcgis/rest/services/WaCoDiS";

@Component({
  selector: 'wv-selection-map',
  templateUrl: './selection-map.component.html',
  styleUrls: ['./selection-map.component.css']
})
export class SelectionMapComponent implements OnInit,AfterViewInit {


  public searchOptions: GeoSearchOptions = { countrycodes: [] };

  public providerUrl: string = 'https://www.fluggs.de/sos2-intern-gis/api/v1/';//"http://www.fluggs.de/sos2/api/v1/";
  // public label = 'Wupperverband Zeitreihen Dienst';
  // public showZoomControl = true;
  // public showAttributionControl = true;
  public map: L.Map;

  // public baselayers: BaseLayer[] = [];
  // public overviewMapLayers: Layer[] = [new Tile({
  //   source: new OSM()
  // })];
  // public zoom = 11;
  // public lat = 51.15;
  // public lon = 7.22;

  public token: string = '';
  public sentinelLayer: esri.ImageMapLayer;
  public mapId = 'test-map';
  public fitBounds: L.LatLngBoundsExpression = [[50.985, 6.924], [51.319, 7.607]];
  public zoomControlOptions: L.Control.ZoomOptions = { position: 'topleft' };
  public avoidZoomToSelection = false;
  public baseMaps: Map<string, LayerOptions> = new Map<string, LayerOptions>();
  public overlayMaps: Map<string, LayerOptions> = new Map<string, LayerOptions>();
  public layerControlOptions: L.Control.LayersOptions = { position: 'bottomleft' };
  public cluster = true;
  public loadingStations: boolean;
  public baselayers: L.Layer[] = [];
  public stationFilter: ParameterFilter = {
    // phenomenon: '8'
  };
  public statusIntervals = false;
  public mapOptions: L.MapOptions = { dragging: true, zoomControl: false };

  constructor(private mapService: OlMapService, private settingsService: SettingsService<Settings>, private mapCache: MapCache) {
    if (this.settingsService.getSettings().datasetApis) {
      this.providerUrl = this.settingsService.getSettings().defaultService.apiUrl;
    }
  }
  ngAfterViewInit(): void {
   this.mapCache.getMap(this.mapId).addLayer(
     L.tileLayer.wms(WvG_URL,{
       layers: '0', format: 'image/png', transparent: true, maxZoom: 16, attribution: '&copy; Wupperverband'
     })
   );
  }


  ngOnInit() {

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
    // this.mapService.getMap(this.mapId).subscribe((map) => {
    //   map.getLayers().clear();
    //   map.addControl(new ScaleLine({ units: "metric" }));
    //   map.addLayer(new Tile({
    //     source: new OSM()
    //   }));

    //   map.addLayer(new ImageLayer({
    //     visible: true,
    //     opacity: 0.5,
    //     source: new ImageWMS({
    //       url: WvG_URL,
    //       params: {
    //         'LAYERS': '0',
    //       },
    //     })
    //   }));
    // });

    // this.baselayers.push(new TileLayer({
    //   visible: true,
    //   source: new TileWMS({
    //     url: 'https://maps.dwd.de/geoserver/ows',
    //     params: {
    //       'LAYERS': 'dwd:RX-Produkt',
    //     }
    //   })
    // }));

    // this.baselayers.push(new TileLayer({
    //   visible: false,
    //   source: new TileWMS({
    //     url: 'https://maps.dwd.de/geoserver/ows',
    //     params: {
    //       'LAYERS': 'dwd:FX-Produkt',
    //     }
    //   })
    // }));
    // this.baselayers.push(new ImageLayer({
    //   visible: false,
    //   source: new ImageWMS({
    //     url: ' https://www.wms.nrw.de/umwelt/waldNRW',
    //     attributions: "Datenlizenz Deutschland – Namensnennung – Version 2.0",
    //     params: {
    //       'LAYERS': 'waldbedeckung_Sentinel2',
    //     }
    //   })
    // }));


    // let imgSource = new ImageWMS({
    //   params: {
    //     'LAYERS': "EO_WACODIS_DAT_INTRA_LAND_COVER_CLASSIFICATION_Service",
    //   },
    //   url: "https://gis.wacodis.demo.52north.org:6443/arcgis/services/WaCoDiS/EO_WACODIS_DAT_INTRA_LAND_COVER_CLASSIFICATION_Service/ImageServer/WMSServer",
    //   crossOrigin: "anonymous"
    // });


    // this.baselayers.push(new ImageLayer({visible: false, source: imgSource}));

    esri.imageMapLayer({ url: wacodisUrl }).metadata((error, metadata) => {
      if (error) {
        console.log("Error with image service: " + error)
      } else {
        metadata["services"].forEach(element => {
          if (element["type"] == 'ImageServer') {
            // this.baselayers.push(
            //   new ImageLayer({
            //     visible: false,
            //     source: new ImageArcGISRest({
            //       ratio: 1,
            //       params: {
            //         'LAYERS': element["name"].split("/")[1],
            //       },
            //       url: wacodisUrl + "/" + element["name"].split("/")[1] + "/" + element["type"]
            //     })
            //   })
            // );
             this.baselayers.push(
              (esri.imageMapLayer({
                url: wacodisUrl + "/" + element["name"].split("/")[1] + "/" + element["type"],
                maxZoom: 16, opacity: 0, alt: element["name"].split("/")[1]
              }))
            );
         
            // this.overlayMaps.set(element["name"].split("/")[1],
            //   {
            //       label: element["name"].split("/")[1], // will be shown in layer control
            //       visible: true, // is layer by default visible
            //       layer: (esri.imageMapLayer({
            //         url: wacodisUrl + "/" + element["name"].split("/")[1] + "/" + element["type"],
            //         maxZoom: 16, opacity: 0.8, alt: element["name"].split("/")[1]
            //       }))
            //   });
          }

        });
        this.baselayers.forEach((blayer,i,arr)=>{
          this.mapCache.getMap(this.mapId).addLayer(blayer);
        });
        L.control.scale().addTo(this.mapCache.getMap(this.mapId));
      }
    });




    //   this.mapService.getMap(this.mapId).subscribe((map) => {
    //   map.on('singleclick', function(evt) {
    //     document.getElementById('info').innerHTML = '';
    //     var viewResolution = /** @type {number} */ (map.getView().getResolution());
    //     var url = imgSource.getGetFeatureInfoUrl(
    //       evt.coordinate, viewResolution, 'EPSG:25832',
    //       {'INFO_FORMAT': 'text/html'});
    //     if (url) {
    //       fetch(url)
    //         .then(function (response) { return response.text(); })
    //         .then(function (html) {
    //           document.getElementById('info').innerHTML = html;
    //         });
    //     }
    //   });
    // });

  }

  public onStationSelected(station: Station) {
    alert(station.properties.label);
    console.log(station);

  }


  public onSelectPhenomenon(phenomenon: Phenomenon) {
    // this.stationFilter = {
    //   phenomenon: phenomenon.id
    // };
  }


}
