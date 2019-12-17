import { Component, OnInit, Input } from '@angular/core';
import { OlLayerTimeSelectorComponent, WmsCapabilitiesService } from '@helgoland/open-layers';
import {ImageWMS, ImageArcGISRest} from 'ol/source';
import Layer from 'ol/layer/Layer';
import * as esri from "esri-leaflet";

@Component({
  selector: 'wv-extended-ol-layer-time-selector',
  templateUrl: './extended-ol-layer-time-selector.component.html',
  styleUrls: ['./extended-ol-layer-time-selector.component.css']
})
export class ExtendedOlLayerTimeSelectorComponent extends OlLayerTimeSelectorComponent implements OnInit {

  @Input() layer: Layer;
  public timeAttribute = true;

  constructor(private wmsCap: WmsCapabilitiesService) {
    super(wmsCap); 
  }

  ngOnInit() {
    super.ngOnInit();

    const imageSource = this.layer.getSource();
    if(imageSource instanceof ImageWMS){
      // this.loading = true;

      this.url = imageSource.getUrl();
      this.layerid = imageSource.getParams()['layers'] || imageSource.getParams()['LAYERS'];
      this.wmsCaps.getTimeDimensionArray(this.layerid, this.url)
        .subscribe(
          res => this.timeDimensions = res,
          error => { this.timeAttribute = false },
          () => this.loading = false
        );
        if(this.timeAttribute){}
        // this.determineCurrentTimeParameter();
    }
    else if(imageSource instanceof ImageArcGISRest){
      //  this.loading = true;
  
      this.url = imageSource.getUrl();
      esri.imageMapLayer({url: this.url}).metadata((error, metadata)=>{
        if(error){
          console.log('Error on Image Service request');
          this.timeAttribute = false ;
        }else{
          // console.log(metadata["timeInfo"].timeExtent);
          this.timeDimensions =[new Date(metadata["timeInfo"].timeExtent[0]), new Date(metadata["timeInfo"].timeExtent[1])]
          this.currentTime =new Date (metadata["timeInfo"].timeExtent[0]);
        }
        this.loading = false
      });
   
      // this.timeAttribute = false;
      // this.determineCurrentTimeParameter();
    }

  }

}
