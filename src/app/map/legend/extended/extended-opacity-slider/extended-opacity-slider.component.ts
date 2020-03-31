import { Component, OnInit, DoCheck, Input } from '@angular/core';
import * as L from 'leaflet';
import * as esri from 'esri-leaflet';

@Component({
  selector: 'wv-extended-opacity-slider',
  templateUrl: './extended-opacity-slider.component.html',
  styleUrls: ['./extended-opacity-slider.component.css']
})
export class ExtendedOpacitySliderComponent implements OnInit,DoCheck {

  @Input() layer: any |esri.ImageMapLayer;

  public opacity: number;

  constructor() { }

  ngOnInit(): void {
    if(this.layer instanceof L.TileLayer || this.layer instanceof esri.ImageMapLayer)
    this.opacity = this.layer.options.opacity * 100;
  }

  ngDoCheck() {
    if(this.layer instanceof L.TileLayer || this.layer instanceof esri.ImageMapLayer){
    const o = this.layer.options.opacity * 100;
    if (this.layer && o !== this.opacity) {
      this.opacity = o;
    }
  }
  }

  setOpacity(o: number) {
    this.opacity = o;
    if (this.layer) {
      this.layer.setOpacity(this.opacity / 100);
    }
  }

}
