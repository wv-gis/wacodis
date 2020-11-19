import { Component, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { WmsCapabilitiesService } from '@helgoland/open-layers';
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
export class ExtendedOlLayerLegendUrlComponent implements OnChanges {

  @Output()
  legendUrls: EventEmitter<legendParam[]> = new EventEmitter();
  @Output() legendUrl: EventEmitter<string> = new EventEmitter();
  @Input() layer: any; // selected ServiceLayer
  @Input() id?: number; // selected Layer of the service 

  public url: string;
  public legurl: string = '';
  public urls: legendParam[];
  public imageUrl: string;
  constructor(private wmsCap: WmsCapabilitiesService, private http: HttpClient) {
    // super(wmsCap);
  }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    if(!changes.id.firstChange){
      this.deliverLegendUrl();
    }
  }//extends OlLayerLegendUrlComponent {



  /**
   * legend Url creation based on Layer type
   */
  public deliverLegendUrl() {
    if ((this.layer != undefined)) {
   
      if (this.layer.options.url) {
        this.imageUrl = this.layer.options.url;

        //if (source instanceof ImageMapLayer) receive legend Url for specific rusterfunction {
        if (this.layer instanceof esri.ImageMapLayer) {

          this.layer.metadata((error, metadata) => {
            let legendurl = this.imageUrl + "legend?bandIds=&renderingRule=rasterfunction:" + metadata["rasterFunctionInfos"][0].name + "&f=pjson";
            let legendResp: legendParam[] = [];
            esri.imageMapLayer({ url: legendurl }).metadata((error, legendData) => {
              legendData["layers"][0].legend.forEach((dat, i, arr) => {
                if (arr[i].label.split(' ').length > 1) {
                  legendResp.push({ url: "data:image/png;base64," + arr[i].imageData, label: arr[i].label, layer: metadata["description"] });

                } else {
                }

              });
              this.legendUrls.emit(legendResp);
              this.urls = legendResp;
            });
          });
        }
        else {
          //if (source instanceof TiledMapLayer) receive legend Url for Layer
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
          else if (this.layer instanceof esri.DynamicMapLayer) {
            let legendurl = this.imageUrl + "legend?dynamicLayers=" + this.id + "&f=pjson";
      
            let legendResp: legendParam[] = [];

            let resp = this.http.get(legendurl).subscribe((ob: TilelegendResp) => {
              ob["layers"][this.id].legend.forEach((dat, i, ar) => {
                legendResp.push({
                  url: "data:image/png;base64," + ar[i].imageData,
                  label: ar[i].label,
                  layer: ob["layers"][this.id].layerName
                });
              });

              this.legendUrls.emit(legendResp);
              this.urls = legendResp;
            });
          }
          else {
            //if (source instanceof FeatureLayer) create LegendUrl Parameters by Renderer Specification of Service
            if (this.layer instanceof esri.FeatureLayer) {
             
              esri.featureLayer({
                url: this.imageUrl + this.id
              }).metadata((err, meta) => {
                let featureResp: legendParam[] = [];
             
                // set size of pixel and canvas 
                const arr = new Uint8ClampedArray(1600);
                const canvas = document.createElement('canvas');
                canvas.width = 20;
                canvas.height = 20;
                const ctx = canvas.getContext('2d');
                let imageData: ImageData[] = [];
             
                if(meta.drawingInfo.renderer.type == "uniqueValue"){
                  for (let i = 0; i < meta.drawingInfo.renderer.uniqueValueInfos.length; i++) {
                    // Iterate through every pixel
                    for (let k = 0; k < arr.length; k += 4) {
                      arr[k + 0] = meta.drawingInfo.renderer.uniqueValueInfos[i].symbol.color[0]   // R value
                      arr[k + 1] = meta.drawingInfo.renderer.uniqueValueInfos[i].symbol.color[1];  // G value
                      arr[k + 2] = meta.drawingInfo.renderer.uniqueValueInfos[i].symbol.color[2];    // B value
                      arr[k + 3] = meta.drawingInfo.renderer.uniqueValueInfos[i].symbol.color[3];  // A value
                    }
  
                    // Initialize a new ImageData object
                    imageData.push(new ImageData(arr, 20, 20));
                    ctx.putImageData(imageData[i], 0, 0);
                    ctx.scale(0.5, 0.5);
                    // set canvas specification as DataUrl 
                    featureResp.push({
                      url: canvas.toDataURL('image/png'),
                      label: meta.drawingInfo.renderer.uniqueValueInfos[i].label,
                      layer: meta.drawingInfo.renderer.uniqueValueInfos[i].description
                    });
  
                  }
                }else if(meta.drawingInfo.renderer.type == "simple"){
                  for (let k = 0; k < arr.length; k += 4) {
                    arr[k + 0] = meta.drawingInfo.renderer.symbol.color[0]   // R value
                    arr[k + 1] = meta.drawingInfo.renderer.symbol.color[1];  // G value
                    arr[k + 2] = meta.drawingInfo.renderer.symbol.color[2];    // B value
                    arr[k + 3] = meta.drawingInfo.renderer.symbol.color[3];  // A value
                  }

                  // Initialize a new ImageData object
                  imageData.push(new ImageData(arr, 20, 20));
                  ctx.putImageData(imageData[0], 0, 0);
                  ctx.scale(0.5, 0.5);
                  // set canvas specification as DataUrl 
                  featureResp.push({
                    url: canvas.toDataURL('image/png'),
                    label: meta.drawingInfo.renderer.label,
                    layer: meta.drawingInfo.renderer.description
                  });

                }
                if(meta.drawingInfo.renderer.type == "classBreaks"){
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
                    ctx.putImageData(imageData[i], 0, 0);
                    ctx.scale(0.5, 0.5);
                    // set canvas specification as DataUrl 
                    featureResp.push({
                      url: canvas.toDataURL('image/png'),
                      label: meta.drawingInfo.renderer.classBreakInfos[i].label,
                      layer: meta.drawingInfo.renderer.classBreakInfos[i].description
                    });
  
                  }
                }
             
                this.legendUrls.emit(featureResp);
                this.urls = featureResp;
              });
            }

          }

        }
      } //if (source instanceof TimeDimension WMS) receive legend Url from Capabilities 
      else if (this.layer instanceof L.TimeDimension.Layer.WMS) {
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
          //if (source instanceof TileLayer WMS) receive legend Url from Capabilities 
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
