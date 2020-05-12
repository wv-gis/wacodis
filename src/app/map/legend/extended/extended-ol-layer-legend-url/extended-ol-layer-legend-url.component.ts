import { Component, Output, EventEmitter, Input} from '@angular/core';
import { OlLayerLegendUrlComponent, WmsCapabilitiesService } from '@helgoland/open-layers';
// import { ImageWMS } from 'ol/source';
// import ImageArcGISRest from 'ol/source/ImageArcGISRest';
import * as esri from "esri-leaflet";
import L from 'leaflet';

export interface legendParam{
  url: string;
  label: string;
  layer: string;
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

  public url: string;
  public legurl: string='';
  public urls: legendParam[];
  public imageUrl: string;
  constructor(private wmsCap: WmsCapabilitiesService) {
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
 
    if(this.layer.options.url){
      this.imageUrl = this.layer.options.url;
    
    
    // else if (source instanceof ImageArcGISRest) {
      if(this.layer instanceof esri.ImageMapLayer){    
      // const layerid = source.getParams()['layers'] || source.getParams()['LAYERS'];
     this.layer.metadata((error,metadata)=>{
      let legendurl = this.imageUrl + "legend?bandIds=&renderingRule=rasterfunction:"+ metadata["rasterFunctionInfos"][0].name +"&f=pjson";
      let legendResp: legendParam[] = [];
      esri.imageMapLayer({url: legendurl}).metadata((error,legendData)=>{
       legendData["layers"][0].legend.forEach((dat,i,arr)=>{
         if(arr[i].label.split('-').length > 1)
          legendResp.push({url: "data:image/png;base64," + arr[i].imageData, label: arr[i].label, layer:metadata["description"] }) ;
      
        });
        this.legendUrls.emit(legendResp);
        this.urls = legendResp;
      });
     });    
    }
  } else if(this.layer instanceof L.TimeDimension.Layer.WMS){
    this.url = this.layer.options.getCapabilitiesUrl;
    const layerid = this.layer.options.getCapabilitiesLayerName;
      this.wmsCap.getLegendUrl(layerid, this.url).subscribe(res => {this.legendUrl.emit(res); 
        this.legurl = res;
        this.urls =[{ url: res, label: "", layer: res.split('layer=')[1] }]
      });
  }
    else{
      if(this.layer._url){
        this.url = this.layer._url;
   
        if(this.layer instanceof L.TileLayer.WMS){
          const layerid = this.layer.wmsParams.layers;
            this.wmsCap.getLegendUrl(layerid, this.url).subscribe(res => {this.legendUrl.emit(res); 
              this.legurl = res;
              this.urls =[{ url: res, label: "", layer: res.split('layer=')[1] }]});
        }
      }
     
    }
  }
}
