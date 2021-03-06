import { Component, OnInit, Input } from '@angular/core';
import { OlLayerTitleComponent, WmsCapabilitiesService } from '@helgoland/open-layers';
// import {ImageWMS, ImageArcGISRest} from 'ol/source';
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

   /**
    * receive and set the title of the selected Layer/Service Type
    */
  ngOnInit() {
   
     
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
       else if(this.layer instanceof  L.TimeDimension.Layer.WMS){      
          const twmsUrl = this.layer.options.getCapabilitiesUrl;
          const layerName = this.layer.options.getCapabilitiesLayerName;
          this.wmsCap.getTitle(layerName, twmsUrl).subscribe(res => {       
            this.title = res;
          });
        }
        else if(this.layer._url){       
          const wmsUrl = this.layer._url;
        
          if(this.layer instanceof L.TileLayer.WMS ){
            const layerName = this.layer.wmsParams.layers;
            this.wmsCap.getTitle(layerName, wmsUrl).subscribe(res => {       
              this.title = res;
            });
          }
         
          
         }else{
           
         }
  }
}
