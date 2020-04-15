import { Component, OnInit, Input } from '@angular/core';
import { OlLayerZoomExtentComponent, OlMapService, WmsCapabilitiesService } from '@helgoland/open-layers';
// import BaseLayer from 'ol/layer/Base';
// import { View } from 'ol';
// import Layer from 'ol/layer/Layer';
// import ImageWMS from 'ol/source/ImageWMS';
// import ImageArcGISRest from 'ol/source/ImageArcGISRest';
import * as esri from "esri-leaflet";
// import { transformExtent } from 'ol/proj';
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
    // super(wmsCap, mapService);
  }

  ngOnInit() {
    // super.ngOnInit();
    // else
    //  if (this.layer instanceof Layer) {
    //   const imageSource = this.layer.getSource();

    if (this.layer._url) {
      this.imageurl = this.layer._url;

      if (this.layer instanceof L.TileLayer) {
        if(this.layer.options.bounds){
          this.imageExtent= this.layer.options.bounds;
        }else{
          if (this.layer instanceof L.TileLayer.WMS) {
            let epsgCode;
              if( this.mapCache.getMap(this.mapId)){
                epsgCode = this.mapCache.getMap(this.mapId).options.crs.code;
              }
            else{
              epsgCode = this.layer.options.crs;
            }
            // this.imageid = imageSource.getParams()['layers'] || imageSource.getParams()['LAYERS'];
            this.imageid = this.layer.wmsParams.layers;
            this.wmsCap.getExtent(this.imageid, this.imageurl, epsgCode).subscribe(res => {
              this.imageExtent = new L.LatLngBounds([res.extent[1],res.extent[0]],[res.extent[3],res.extent[2]]);
              this.imageCrs = res.crs;
            });
          }
        }
        // this.imageurl = imageSource.getUrl();
        // this.mapService.getMap(this.mapId).subscribe(map => {
        // this.imageView = this.mapCache.getMap(this.mapId).getBounds();
      
        // });
      }
    } else if (this.layer.options.url) {
      this.imageurl = this.layer.options.url;
      if (this.layer instanceof esri.ImageMapLayer) {       
        // this.mapService.getMap(this.mapId).subscribe(map => {    
        // this.imageView = this.mapCache.getMap(this.mapId).getBounds();

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

                this.imageExtent = new LatLngBounds([ this.minLat,this.minLon],[ this.maxLat,this.maxLon]);
             
                this.imageCrs = "EPSG:" + feature["spatialReference"]["wkid"];
             }

          }
        });
        // });
      }
    }
  }


  public zoomToExtent() {
    // super.zoomToExtent();
    if (this.imageExtent) {
      if (!this.imageCrs) {
       this.mapCache.getMap(this.mapId).fitBounds(this.imageExtent);
      } else {
        // const transformation = transformExtent(this.imageExtent, this.imageCrs, this.mapCache.getMap(this.mapId).options.crs.code);     
        // this.mapCache.getMap(this.mapId).fitBounds(
        //   [[this.mapCache.getMap(this.mapId).project([this.imageExtent[0], this.imageExtent[1]], this.mapCache.getMap(this.mapId).getZoom()).x,
        //   this.mapCache.getMap(this.mapId).project([this.imageExtent[0], this.imageExtent[1]], this.mapCache.getMap(this.mapId).getZoom()).y], [
        //     this.mapCache.getMap(this.mapId).project([this.imageExtent[2], this.imageExtent[3]], this.mapCache.getMap(this.mapId).getZoom()).x,
        //     this.mapCache.getMap(this.mapId).project([this.imageExtent[2], this.imageExtent[3]], this.mapCache.getMap(this.mapId).getZoom()).y
        //   ]]);
      
        this.mapCache.getMap(this.mapId).fitBounds(this.imageExtent);
      }
    }
  }
}
