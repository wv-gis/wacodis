import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as esri from 'esri-leaflet';
import { GeoSearchOptions, LayerOptions, MapCache } from '@helgoland/map';
import { SettingsService, Settings, HelgolandPlatform, HelgolandParameterFilter } from '@helgoland/core';
import * as L from 'leaflet';
import * as geojson from 'geojson';


export interface WFSObject {
  crs: L.CRS,
  bbox: L.LatLngBounds,
  features: GeoJSON.Feature<geojson.Geometry, { [name: string]: any; }>[],
  numberMatched: number,
  numberReturned: number,
  timeStamp: string,
  totalFeatures: number,
  type: geojson.GeoJsonTypes,
}


const WvG_URL = 'http://fluggs.wupperverband.de/secman_wss_v2/service/WMS_WV_Oberflaechengewaesser_EZG/guest?';
const wacodisUrl = "https://gis.wacodis.demo.52north.org:6443/arcgis/rest/services/WaCoDiS";

@Component({
  selector: 'wv-selection-map',
  templateUrl: './selection-map.component.html',
  styleUrls: ['./selection-map.component.css']
})
/**
 * Component to depict all imageServices 
 */
export class SelectionMapComponent implements OnInit, AfterViewInit {


  public searchOptions: GeoSearchOptions = { countrycodes: [] };

  public providerUrl: string = 'https://www.fluggs.de/sos2-intern-gis/api/v1/';//"http://www.fluggs.de/sos2/api/v1/";

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
  public stationFilter: HelgolandParameterFilter = {
    // phenomenon: '8'
  };
  public statusIntervals = false;
  public mapOptions: L.MapOptions = { dragging: true, zoomControl: false };

  constructor(private settingsService: SettingsService<Settings>, private mapCache: MapCache) {
    if (this.settingsService.getSettings().datasetApis) {
      this.providerUrl = this.settingsService.getSettings().defaultService.apiUrl;
    }
  }

  /**
   * add Layer of WV area to map
   */
  ngAfterViewInit(): void {
    this.mapCache.getMap(this.mapId).addLayer(
      L.tileLayer.wms(WvG_URL, {
        layers: '0', format: 'image/png', transparent: true, maxZoom: 16, attribution: '&copy; Wupperverband'
      })
    );

  }

  /**
   * set Basemap and its layers to show
   */
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


    esri.imageMapLayer({ url: wacodisUrl }).metadata((error, metadata) => {
      if (error) {
        console.log("Error with image service: " + error)
      } else {
        metadata["services"].forEach(element => {
          if (element["type"] == 'ImageServer') {

            this.baselayers.push(
              (esri.imageMapLayer({
                url: wacodisUrl + "/" + element["name"].split("/")[1] + "/" + element["type"],
                maxZoom: 16, opacity: 0, alt: element["name"].split("/")[1], bandIds: "1"
              }))
            );

          }

        });
        this.baselayers.forEach((blayer, i, arr) => {
          this.mapCache.getMap(this.mapId).addLayer(blayer);
          if (blayer instanceof esri.ImageMapLayer) {
            if (blayer.options.alt == 'EO_WACODIS_DAT_VEGETATION_DENSITY_LAIService') {

              blayer.setRenderingRule(
                {
                  "rasterFunction": "Mask",
                  "rasterFunctionArguments": {
                    "NoDataValues": ["2.2250738585072014e-308"],
                    "IncludedRanges": [0, 1],
                    "NoDataInterpretation": 0
                  }, "variableName": "Raster"
                }
              );

            }else  if (blayer.options.alt == 'EO_WACODIS_DAT_INTRA_LAND_COVER_CLASSIFICATIONService'){

              blayer.setRenderingRule(
                {
                  "rasterFunction" : "Colormap",
                  "rasterFunctionArguments" : {
                    "Colormap" : [
                    [1, 255, 255, 0],
                    [2, 252, 200, 12],
                    [3, 50, 220, 255],
                    [4, 50, 220, 255],
                    [5, 153, 153, 153],
                    [6, 12, 252, 32],
                    [7, 12, 252, 32],
                    [8, 102, 63, 0],
                    [9, 252, 12, 12],
                    [10, 252, 12, 12],
                    [11, 229, 127, 255],
                    [12, 101, 178, 62],
                    [13, 62, 178, 72],
                    [14, 57, 127, 63],
                    [15, 178, 178, 62],
                    [16, 229, 160, 57],
                    [17, 255, 127, 208]              
                  ]
                },
                "variableName" : "Raster"
                }
              
            );
            }


          }
        });
        L.control.scale().addTo(this.mapCache.getMap(this.mapId));
      }
    });
  //   let diffLayer = esri.imageMapLayer({
  //     url: 'https://gis.wacodis.demo.52north.org:6443/arcgis/rest/services/WaCoDiS/EO_WACODIS_DAT_INTRA_LAND_COVER_CLASSIFICATIONService/ImageServer',
  //     maxZoom: 16, opacity: 1, alt: 'DiffLandUse',bandIds: "1"
  //   });
  //   diffLayer.setRenderingRule(
  //     {
  //       "rasterFunction" : "Colormap",
  //       "rasterFunctionArguments" : {
  //         "Colormap" : [
  //         [1, 255, 255, 0],
  //         [2, 252, 200, 12],
  //         [3, 50, 220, 255],
  //         [4, 50, 220, 255],
  //         [5, 153, 153, 153],
  //         [6, 12, 252, 32],
  //         [7, 12, 252, 32],
  //         [8, 102, 63, 0],
  //         [9, 252, 12, 12],
  //         [10, 252, 12, 12],
  //         [11, 229, 127, 255],
  //         [12, 101, 178, 62],
  //         [13, 62, 178, 72],
  //         [14, 57, 127, 63],
  //         [15, 178, 178, 62],
  //         [16, 229, 160, 57],
  //         [17, 255, 127, 208]              
  //       ]
  //     },
  //     "variableName" : "Raster"
  //     }
    
  // );
// this.baselayers.push(diffLayer);
// this.mapCache.getMap(this.mapId).addLayer(diffLayer);
  }

  /**
   * when station is selected in the map open an alert to show the label of the selected station
   * @param station selected station
   */
  public onStationSelected(station: HelgolandPlatform) {
  alert(station.label);
  console.log(station);

}

}
