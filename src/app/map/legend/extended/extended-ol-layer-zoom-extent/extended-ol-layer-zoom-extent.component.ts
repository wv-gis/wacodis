import { Component, OnInit, Input } from '@angular/core';
import { OlLayerZoomExtentComponent, OlMapService, WmsCapabilitiesService } from '@helgoland/open-layers';
import { Required } from '@helgoland/core';
import BaseLayer from 'ol/layer/Base';
import { View } from 'ol';
import Layer from 'ol/layer/Layer';
import ImageWMS from 'ol/source/ImageWMS';
import ImageArcGISRest from 'ol/source/ImageArcGISRest';
import * as esri from "esri-leaflet";
import { transformExtent } from 'ol/proj';

@Component({
  selector: 'wv-extended-ol-layer-zoom-extent',
  templateUrl: './extended-ol-layer-zoom-extent.component.html',
  styleUrls: ['./extended-ol-layer-zoom-extent.component.css']
})
export class ExtendedOlLayerZoomExtentComponent extends OlLayerZoomExtentComponent implements OnInit {
  @Required @Input() layer: BaseLayer;
  @Required @Input() mapId: string;

  private imageurl: string;
  private imageid: string;
  private imageExtent: number[];
  private imageCrs: string;
  private imageView: View;
  private latValues: number[] = [];
  private lonValues: number[] = [];
  private minLat: number;
  private minLon: number;
  private maxLat: number;
  private maxLon: number;

  constructor(private wmsCap: WmsCapabilitiesService,
    private mapService: OlMapService) {
    super(wmsCap, mapService);
  }

  ngOnInit() {
    super.ngOnInit();

    if (this.layer.getExtent()) {
      this.imageExtent = this.layer.getExtent();
    } else if (this.layer instanceof Layer) {
      const imageSource = this.layer.getSource();
      this.layer.getExtent();

      if (imageSource instanceof ImageWMS) {
        this.imageurl = imageSource.getUrl();
        this.mapService.getMap(this.mapId).subscribe(map => {
          this.imageView = map.getView();
          const epsgCode = this.imageView.getProjection().getCode();
          this.imageid = imageSource.getParams()['layers'] || imageSource.getParams()['LAYERS'];
          this.wmsCap.getExtent(this.imageid, this.imageurl, epsgCode).subscribe(res => {
            this.imageExtent = res.extent;
            this.imageCrs = res.crs;
          });
        });
      } else if (imageSource instanceof ImageArcGISRest) {
        this.imageurl = imageSource.getUrl();
        this.mapService.getMap(this.mapId).subscribe(map => {

          this.imageView = map.getView();

          esri.imageService({ url: this.imageurl }).query().returnGeometry(true).run((error, featureCollection, feature) => {

            if (error) {
              console.log('Error on imageService Query');
            } else {
              for (let i in featureCollection.features) {
                for (let p = 0; p < featureCollection.features[i]["geometry"]["coordinates"][0].length; p++) {
                  this.latValues.push(featureCollection.features[i]["geometry"]["coordinates"][0][p][1]);
                  this.lonValues.push(featureCollection.features[i]["geometry"]["coordinates"][0][p][0]);
                }
                this.latValues.sort((a, b) => { return a - b });
                this.lonValues.sort((a, b) => { return a - b });

                this.maxLon = this.lonValues[this.lonValues.length - 1];
                this.minLon = this.lonValues[0];
                this.maxLat = this.latValues[this.lonValues.length - 1];
                this.minLat = this.latValues[0];

                this.imageExtent = [this.minLon, this.minLat, this.maxLon, this.maxLat];
                this.imageCrs = "EPSG:"+ feature["spatialReference"]["wkid"];
              }
            }
          });   
        });
      }
    }
  }

  public zoomToExtent() {
    super.zoomToExtent();
    if (this.imageExtent) {
      if (!this.imageCrs) {
        this.imageView.fit(this.imageExtent);
      } else {
        const transformation = transformExtent(this.imageExtent, this.imageCrs, this.imageView.getProjection().getCode());
        this.imageView.fit(transformation);
      }
    }
  }
}
