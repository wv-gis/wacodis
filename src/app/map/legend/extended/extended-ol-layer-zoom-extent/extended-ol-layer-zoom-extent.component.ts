import { Component, OnInit, Input } from '@angular/core';
import { WmsCapabilitiesService } from '@helgoland/open-layers';
import * as esri from "esri-leaflet";
import { MapCache } from '@helgoland/map';
import L, { LatLngBoundsExpression, LatLngBounds } from 'leaflet';

@Component({
  selector: 'wv-extended-ol-layer-zoom-extent',
  templateUrl: './extended-ol-layer-zoom-extent.component.html',
  styleUrls: ['./extended-ol-layer-zoom-extent.component.css']
})
export class ExtendedOlLayerZoomExtentComponent implements OnInit {

  @Input() layer: any | esri.ImageMapLayer;

  /**
   * corresponding map id
   */
  @Input() mapId: string;

  private imageurl: string;
  private imageid: string;
  private imageExtent: LatLngBoundsExpression;
  private imageCrs: string;
  private imageView: L.LatLngBounds;
  private latValues: number[] = [];
  private lonValues: number[] = [];
  private minLat: number;
  private minLon: number;
  private maxLat: number;
  private maxLon: number;

  constructor(private wmsCap: WmsCapabilitiesService,
    private mapCache: MapCache) {
  
  }

  /**
   * receive and set the depending Bounbds of the Layer by using the method for the specific type and setting the bounds of the map
   * to the corresponding LayerBounds Full Extent
   */
  ngOnInit() {

    if (this.layer._url) {
      this.imageurl = this.layer._url;

      if (this.layer instanceof L.TileLayer) {
        if (this.layer.options.bounds) {
          this.imageExtent = this.layer.options.bounds;
        } else {
          if (this.layer instanceof L.TileLayer.WMS) {
            let epsgCode;
            epsgCode = this.layer.options.crs;
            this.imageid = this.layer.wmsParams.layers;
            this.wmsCap.getExtent(this.imageid, this.imageurl, epsgCode).subscribe(res => {
              this.imageExtent = new L.LatLngBounds([res.extent[1], res.extent[0]], [res.extent[3], res.extent[2]]);
              this.imageCrs = res.crs;
            });
          }
        }

      }
    } else if (this.layer.options.url) {
      this.imageurl = this.layer.options.url;
      if (this.layer instanceof esri.ImageMapLayer) {
        esri.imageService({ url: this.imageurl }).query().returnGeometry(true).run((error, featureCollection, feature) => {
          if (error) {
            console.log('Error on imageService Query');
          } else {
            if (featureCollection.features) {
              for (let i in featureCollection.features) {
                for (let p = 0; p < featureCollection.features[i]["geometry"]["coordinates"][0].length; p++) {
                  this.latValues.push(featureCollection.features[i]["geometry"]["coordinates"][0][p][1]);
                  this.lonValues.push(featureCollection.features[i]["geometry"]["coordinates"][0][p][0]);
                }
              }
              this.latValues.sort((a, b) => { return a - b });
              this.lonValues.sort((a, b) => { return a - b });

              this.maxLon = this.lonValues[this.lonValues.length - 1];
              this.minLon = this.lonValues[0];
              this.maxLat = this.latValues[this.latValues.length - 1];
              this.minLat = this.latValues[0];

              this.imageExtent = new LatLngBounds([this.minLat, this.minLon], [this.maxLat, this.maxLon]);

              this.imageCrs = "EPSG:" + feature["spatialReference"]["wkid"];
            }
          }
        });
        // });
      }
    }
    else if (this.layer._baseLayer) {
      this.imageurl = this.layer._baseLayer._url;

      if (this.layer instanceof L.TimeDimension.Layer.WMS) {
        let epsgCode;
        epsgCode = this.layer.options.crs;
        if (epsgCode !== L.CRS.EPSG4326) {
          epsgCode = L.CRS.EPSG4326.code;
        }
        this.imageid = this.layer.options.getCapabilitiesLayerName;
        this.wmsCap.getExtent(this.imageid, this.imageurl, epsgCode).subscribe(res => {

          this.imageCrs = res.crs;
          this.imageExtent = new L.LatLngBounds([res.extent[1], res.extent[0]], [res.extent[3], res.extent[2]]);
          });
      }
     }
 
  }

/**
 * zoom to Extent of selected Layer
 */
  public zoomToExtent() {
    if (this.imageExtent) {
      if (!this.imageCrs) {
        this.mapCache.getMap(this.mapId).fitBounds(this.imageExtent);
      } else {

        this.mapCache.getMap(this.mapId).fitBounds(this.imageExtent);
      }
    }
  }
}
