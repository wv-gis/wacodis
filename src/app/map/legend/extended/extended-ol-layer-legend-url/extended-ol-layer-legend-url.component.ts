import { Component, Output, EventEmitter, Input } from '@angular/core';
import { OlLayerLegendUrlComponent, WmsCapabilitiesService } from '@helgoland/open-layers';
// import { ImageWMS } from 'ol/source';
// import ImageArcGISRest from 'ol/source/ImageArcGISRest';
import * as esri from "esri-leaflet";
import L from 'leaflet';
import { HttpClient } from '@angular/common/http';

export interface legendParam {
  url: string;
  label: string;
  layer: string;
}

export interface TilelegendResp {
  layers: [{
    layerId: number,
    layerName: string,
    layerType: string,
    minScale: number,
    maxScale: number,
    legend: [{
      label: string,
      url: string,
      imageData: string,
      contentType: string,
      height: number,
      width: number
    }]
  }]
}

@Component({
  selector: 'wv-extended-ol-layer-legend-url',
  templateUrl: './extended-ol-layer-legend-url.component.html',
  styleUrls: ['./extended-ol-layer-legend-url.component.css']
})
export class ExtendedOlLayerLegendUrlComponent {//extends OlLayerLegendUrlComponent {

  @Output()
  legendUrls: EventEmitter<legendParam[]> = new EventEmitter();
  @Output() legendUrl: EventEmitter<string> = new EventEmitter();
  @Input() layer: any;
  @Input() id?: number;

  public url: string;
  public legurl: string = '';
  public urls: legendParam[];
  public imageUrl: string;
  constructor(private wmsCap: WmsCapabilitiesService, private http: HttpClient) {
    // super(wmsCap);
  }

  public deliverLegendUrl() {
    // super.deliverLegendUrl();
    // const source = this.layer.getSource();
    // this.layer.getExtent();
    // if (source instanceof ImageWMS) {
    //   const url = source.getUrl();
    //   const layerid = source.getParams()['layers'] || source.getParams()['LAYERS'];
    //   this.wmsCap.getLegendUrl(layerid, url).subscribe(res => this.legendUrl.emit(res));
    // }

    if ((this.layer != undefined)) {
      if (this.layer.options.url) {
        this.imageUrl = this.layer.options.url;


        // else if (source instanceof ImageArcGISRest) {
        if (this.layer instanceof esri.ImageMapLayer) {
          // const layerid = source.getParams()['layers'] || source.getParams()['LAYERS'];
          this.layer.metadata((error, metadata) => {
            let legendurl = this.imageUrl + "legend?bandIds=&renderingRule=rasterfunction:" + metadata["rasterFunctionInfos"][0].name + "&f=pjson";
            let legendResp: legendParam[] = [];
            esri.imageMapLayer({ url: legendurl }).metadata((error, legendData) => {
              legendData["layers"][0].legend.forEach((dat, i, arr) => {
                if (arr[i].label.split('-').length > 1)
                  legendResp.push({ url: "data:image/png;base64," + arr[i].imageData, label: arr[i].label, layer: metadata["description"] });

              });
              this.legendUrls.emit(legendResp);
              this.urls = legendResp;
            });
          });
        }
        else {
          if (this.layer instanceof esri.TiledMapLayer) {
            let legendurl = this.imageUrl + "legend?f=pjson";
            let legendResp: legendParam[] = [];

            let resp = this.http.get(legendurl).subscribe((ob: TilelegendResp) => {
              ob["layers"][this.id - 1].legend.forEach((dat, i, ar) => {
                legendResp.push({
                  url: "data:image/png;base64," + ar[i].imageData,
                  label: ar[i].label,
                  layer: ob["layers"][this.id - 1].layerName
                });
              });

              this.legendUrls.emit(legendResp);
              this.urls = legendResp;
            });
          }

          else {
            esri.featureLayer({
              url: 'https://services9.arcgis.com/GVrcJ5O2vy6xbu2e/ArcGIS/rest/services/SWATimClient/FeatureServer/' + this.id
            }).metadata((err, meta) => {
              let featureResp: legendParam[] = [];
  
              const arr = new Uint8ClampedArray(1600);
              const canvas = document.createElement('canvas')  ;
              canvas.width = 20;
              canvas.height = 20;
              const ctx = canvas.getContext('2d');
              let imageData: ImageData[] = [];
              for (let i = 0; i < meta.drawingInfo.renderer.classBreakInfos.length; i++) {
                             // Iterate through every pixel
                for (let k = 0; k < arr.length; k += 4) {
                  arr[k + 0] = meta.drawingInfo.renderer.classBreakInfos[i].symbol.color[0]   // R value
                  arr[k + 1] = meta.drawingInfo.renderer.classBreakInfos[i].symbol.color[1];  // G value
                  arr[k + 2] = meta.drawingInfo.renderer.classBreakInfos[i].symbol.color[2];    // B value
                  arr[k + 3] = meta.drawingInfo.renderer.classBreakInfos[i].symbol.color[3];  // A value
                }

                // Initialize a new ImageData object
                imageData.push(new ImageData(arr, 20, 20));
                ctx.putImageData(imageData[i],0,0);
              ctx.scale(0.5,0.5)
                featureResp.push({
                  url: canvas.toDataURL('image/png'),
                  label: meta.drawingInfo.renderer.classBreakInfos[i].label,
                  layer: meta.drawingInfo.renderer.classBreakInfos[i].description
                });

              }
              this.legendUrls.emit(featureResp);
              this.urls = featureResp;
            });
          }

        }
      } else if (this.layer instanceof L.TimeDimension.Layer.WMS) {
        this.url = this.layer.options.getCapabilitiesUrl;
        const layerid = this.layer.options.getCapabilitiesLayerName;
        this.wmsCap.getLegendUrl(layerid, this.url).subscribe(res => {
          this.legendUrl.emit(res);
          this.legurl = res;
          this.urls = [{ url: res, label: "", layer: res.split('layer=')[1] }]
        });
      }
      else {
        if (this.layer._url) {
          this.url = this.layer._url;

          if (this.layer instanceof L.TileLayer.WMS) {
            const layerid = this.layer.wmsParams.layers;
            this.wmsCap.getLegendUrl(layerid, this.url).subscribe(res => {
              this.legendUrl.emit(res);
              this.legurl = res;
              this.urls = [{ url: res, label: "", layer: res.split('layer=')[1] }]
            });
          }
        }
        else { }
      }
    }


  }
}
