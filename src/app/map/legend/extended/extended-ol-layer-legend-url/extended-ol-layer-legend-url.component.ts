import { Component, Output, EventEmitter} from '@angular/core';
import { OlLayerLegendUrlComponent, WmsCapabilitiesService } from '@helgoland/open-layers';
import { ImageWMS } from 'ol/source';
import ImageArcGISRest from 'ol/source/ImageArcGISRest';
import * as esri from "esri-leaflet";

export interface legendParam{
  url: string;
  label: string;
}

@Component({
  selector: 'wv-extended-ol-layer-legend-url',
  templateUrl: './extended-ol-layer-legend-url.component.html',
  styleUrls: ['./extended-ol-layer-legend-url.component.css']
})
export class ExtendedOlLayerLegendUrlComponent extends OlLayerLegendUrlComponent {

  @Output()
  legendUrls: EventEmitter<legendParam[]> = new EventEmitter();

  constructor(private wmsCap: WmsCapabilitiesService) {
    super(wmsCap);
  }

  public deliverLegendUrl() {
    super.deliverLegendUrl();
    const source = this.layer.getSource();
    this.layer.getExtent();
    if (source instanceof ImageWMS) {
      const url = source.getUrl();
      const layerid = source.getParams()['layers'] || source.getParams()['LAYERS'];
      this.wmsCap.getLegendUrl(layerid, url).subscribe(res => this.legendUrl.emit(res));
    }
    else if (source instanceof ImageArcGISRest) {
      const url = source.getUrl();
      const layerid = source.getParams()['layers'] || source.getParams()['LAYERS'];

     esri.imageMapLayer({url: url}).metadata((error,metadata)=>{
      let legendurl = url + "/legend?bandIds=&renderingRule=rasterfunction:"+ metadata["rasterFunctionInfos"][0].name +"&f=pjson";
      let legendResp: legendParam[] = [];
      esri.imageMapLayer({url: legendurl}).metadata((error,legendData)=>{
       legendData["layers"][0].legend.forEach((dat,i,arr)=>{
         if(i<22)
          legendResp.push({url: "data:image/png;base64," + arr[i].imageData, label: arr[i].label}) ;
        });
        this.legendUrls.emit(legendResp);
      });
     });    
    }
  }
}
