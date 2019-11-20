import { Component, OnInit } from '@angular/core';
import { OlLayerTitleComponent, WmsCapabilitiesService } from '@helgoland/open-layers';
import {ImageWMS, ImageArcGISRest} from 'ol/source';
import * as esri from "esri-leaflet";

@Component({
  selector: 'wv-extended-ol-layer-title',
  templateUrl: './extended-ol-layer-title.component.html',
  styleUrls: ['./extended-ol-layer-title.component.css']
})
export class ExtendedOlLayerTitleComponent extends OlLayerTitleComponent implements OnInit {

  
  constructor(private  wmsCap: WmsCapabilitiesService) {
    super(wmsCap);

   }

  ngOnInit() {
    super.ngOnInit();
    const imageSource = this.layer.getSource();
    if(imageSource instanceof ImageWMS){
      const imageUrl = imageSource.getUrl();
      const layerId = imageSource.getParams()['layers'] || imageSource.getParams()['LAYERS'];
      this.wmsCap.getTitle(layerId, imageUrl).subscribe(res => {       
        this.title = res;
      });
    }
    else if(imageSource instanceof ImageArcGISRest){
      const restUrl = imageSource.getUrl();

      esri.imageMapLayer({url: restUrl}).metadata((error, metadata)=>{
        if(error){
          console.log('Error on Image Service request')
        }else{
          this.title = metadata["description"];
        }
       
      });
    }
  }
}
