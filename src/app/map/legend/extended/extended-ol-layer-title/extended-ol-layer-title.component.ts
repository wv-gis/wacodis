import { Component, OnInit, Input } from '@angular/core';
import { OlLayerTitleComponent, WmsCapabilitiesService } from '@helgoland/open-layers';
import {ImageWMS, ImageArcGISRest} from 'ol/source';
import * as esri from "esri-leaflet";
import L from 'leaflet';

@Component({
  selector: 'wv-extended-ol-layer-title',
  templateUrl: './extended-ol-layer-title.component.html',
  styleUrls: ['./extended-ol-layer-title.component.css']
})
export class ExtendedOlLayerTitleComponent implements OnInit {

   @Input() layer:any | esri.ImageMapLayer;

  public title: string;

  constructor(private  wmsCap: WmsCapabilitiesService) {

   }

  ngOnInit() {
   
    // const imageSource = this.layer.getSource();
    // if(imageSource instanceof ImageWMS){
    //   const imageUrl = imageSource.getUrl();
    //   const layerId = imageSource.getParams()['layers'] || imageSource.getParams()['LAYERS'];
    //   this.wmsCap.getTitle(layerId, imageUrl).subscribe(res => {       
    //     this.title = res;
    //   });
    // }
    // else if(imageSource instanceof ImageArcGISRest){
    //   const restUrl = imageSource.getUrl();
    //   esri.imageMapLayer({url: restUrl}).metadata((error, metadata)=>{
    //     if(error){
    //       console.log('Error on Image Service request')
    //     }else{
    //       if(metadata["name"])
    //       this.title = metadata["name"].split("/")[1];
    //     }
       
    //   });
    // }
        // let a;
     
         if(this.layer instanceof esri.ImageMapLayer){
          const restUrl = this.layer.options.alt;
          this.layer.metadata((error, metadata)=>{
            if(error){
              console.log('Error on Image Service request')
            }else{
              if(metadata["name"])
              this.title = metadata["name"].split("/")[1];
            }          
          });
        }
        else{
          
          const wmsUrl = this.layer._url;
          if(this.layer instanceof L.TileLayer.WMS){
            const layerName = this.layer.wmsParams.layers;
            this.wmsCap.getTitle(layerName, wmsUrl).subscribe(res => {       
              this.title = res;
            });
          }
          
         }
  }
}
