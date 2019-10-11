import { Component, OnInit, Input } from '@angular/core';
import { OlLayerTitleComponent, WmsCapabilitiesService } from '@helgoland/open-layers';
import {ImageWMS, ImageArcGISRest} from 'ol/source'
import { Required } from '@helgoland/core';
import Layer from "ol/layer/Layer"

@Component({
  selector: 'wv-extended-ol-layer-title',
  templateUrl: './extended-ol-layer-title.component.html',
  styleUrls: ['./extended-ol-layer-title.component.css']
})
export class ExtendedOlLayerTitleComponent extends OlLayerTitleComponent implements OnInit {
  @Required @Input() layer: Layer;
  public title: string;
  
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
      if(restUrl.includes('WaCoDiS'))
      this.title = restUrl.split('WaCoDiS/')[1].split('/')[0];
    }
  }

}
