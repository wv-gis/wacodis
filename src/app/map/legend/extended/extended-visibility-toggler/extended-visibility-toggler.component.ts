import { Component, OnInit, Input } from '@angular/core';
import * as esri  from 'esri-leaflet';
import * as L from 'leaflet'; 

@Component({
  selector: 'wv-extended-visibility-toggler',
  templateUrl: './extended-visibility-toggler.component.html',
  styleUrls: ['./extended-visibility-toggler.component.css']
})
export class ExtendedVisibilityTogglerComponent implements OnInit {
  @Input() layer: any | esri.ImageMapLayer;

  protected visible: boolean= false;

  constructor() { }
 

  public toggleVisibility() {
    if(this.layer instanceof L.TileLayer.WMS){
      if(this.layer.options.opacity == 0){
        this.layer.setOpacity(1);
      }else{
        this.layer.setOpacity(0);
      }
    }else if(this.layer instanceof esri.ImageMapLayer){
      if(this.layer.options.opacity == 0){
        this.layer.setOpacity(1);
      }else{
        this.layer.setOpacity(0);
      }
    }
    
  }
  ngOnInit() {
  }

}
