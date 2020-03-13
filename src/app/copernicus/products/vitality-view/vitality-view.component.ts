import { Component, OnInit } from '@angular/core';
import { OlMapService } from '@helgoland/open-layers';
import { RequestTokenService } from 'src/app/services/request-token.service';
import BaseLayer from 'ol/layer/Base';
import Layer from 'ol/layer/Layer';
import { OSM, ImageArcGISRest, ImageWMS } from 'ol/source';
import Map from 'ol/Map.js';
import { Tile } from 'ol/layer';
import { ScaleLine } from 'ol/control';
import ImageLayer from 'ol/layer/Image';
import * as esri from 'esri-leaflet';

const vitalityService = 'https://www.wms.nrw.de/umwelt/waldNRW';
const WvG_URL = 'http://fluggs.wupperverband.de/secman_wss_v2/service/WMS_WV_Oberflaechengewaesser_EZG/guest?';

@Component({
  selector: 'wv-vitality-view',
  templateUrl: './vitality-view.component.html',
  styleUrls: ['./vitality-view.component.css']
})
export class VitalityViewComponent implements OnInit {

  public showZoomControl = true;
  public showAttributionControl = true;
  public map: Map;

  public baselayers: BaseLayer[] = [];
  public overviewMapLayers: Layer[] = [new Tile({
    source: new OSM()
  })];
  public zoom = 14;
  public lat = 51.07;
  public lon = 7.21;

  public token: string = '';
  public sentinelLayer: esri.ImageMapLayer;
  public mapId = 'vitality-map';


  constructor(private mapService: OlMapService, private requestTokenSrvc: RequestTokenService) { }

  ngOnInit() {
    this.mapService.getMap(this.mapId).subscribe((map) => {
      map.getLayers().clear();
      map.addControl(new ScaleLine({units: "metric"}));
      map.addLayer(new Tile({
        source: new OSM(),
      }));

      map.addLayer(new ImageLayer({
        visible: true,
        opacity: 0.8,
        source: new ImageWMS({
          url: WvG_URL,
          params: {
            'LAYERS': '0',
          },
        })
      }));

    });

    this.baselayers.push(
      new ImageLayer({
        visible: false,
        source: new ImageWMS({
          attributions: "Datenlizenz Deutschland – Namensnennung – Version 2.0",
          params: {
            'LAYERS': 'nadelwald_2017_sep2108',
          },
          url: vitalityService
        })
      })
    );

    this.baselayers.push(
      new ImageLayer({
        visible: false,
        source: new ImageWMS({
          attributions: "Datenlizenz Deutschland – Namensnennung – Version 2.0",
          params: {
            'LAYERS': 'nadelwald_2017_jun2019',
          },
          url: vitalityService
        })
      })
    );
    this.baselayers.push(
      new ImageLayer({
        visible: true,
        source: new ImageWMS({
          attributions: "Datenlizenz Deutschland – Namensnennung – Version 2.0",
          params: {
            'LAYERS': 'nadelwald_2017_aug2019',
          },
          url: vitalityService
        })
      })
    );

    this.baselayers.push(
      new ImageLayer({
        visible: false,
        source: new ImageWMS({
          attributions: "Datenlizenz Deutschland – Namensnennung – Version 2.0",
          params: {
            'LAYERS': 'windwurfschadflaechen_kyrill',
          },
          url: vitalityService
        })
      })
    );

   
  }
}