import { Component, OnInit, Input } from '@angular/core';
import { WmsCapabilitiesService } from '@helgoland/open-layers';
import * as L from 'leaflet';
import * as esri from 'esri-leaflet';

@Component({
  selector: 'wv-extended-layer-abstract',
  templateUrl: './extended-layer-abstract.component.html',
  styleUrls: ['./extended-layer-abstract.component.css']
})
export class ExtendedLayerAbstractComponent implements OnInit {

  @Input() layer: any | esri.ImageMapLayer;

  public abstract: string;

  constructor(
    private wmsCaps: WmsCapabilitiesService,
  ) { }

  ngOnInit() {
    if (this.layer._url) {
      const url = this.layer._url;

      if (this.layer instanceof L.TileLayer.WMS) {
        const layerid = this.layer.options.layers;
        this.wmsCaps.getAbstract(layerid, url).subscribe(res => this.abstract = res);
      }
    }
   else if (this.layer instanceof esri.ImageMapLayer) {
       
        this.layer.metadata((error, metadata)=>{
          if(error){
            console.log('Error on Image Service request')
          }else{
            if(metadata["description"])
            this.abstract = metadata["description"];
          }          
        });
      }
     else if (this.layer._baseLayer) {
        const url = this.layer._baseLayer._url;
  
        if (this.layer instanceof L.TimeDimension.Layer.WMS) {
          const layerid = this.layer.options.getCapabilitiesLayerName;
          this.wmsCaps.getAbstract(layerid, url).subscribe(res => this.abstract = res);
        }
      }
    else{

    }
  }

}
