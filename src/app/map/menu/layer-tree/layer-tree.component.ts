import { Component, OnInit } from '@angular/core';
import { MapCache } from '@helgoland/map';

@Component({
  selector: 'wv-layer-tree',
  templateUrl: './layer-tree.component.html',
  styleUrls: ['./layer-tree.component.css']
})
export class LayerTreeComponent implements OnInit {
  public isActive = true;
  constructor(private mapCache: MapCache) { }

  ngOnInit() {
  }
  public change() {

    if (document.getElementById('mainMap') !== undefined) {
      if (this.isActive) {
        document.getElementById('mainMap').setAttribute('style', ' right: 0px;');
      }
      else {
        document.getElementById('mainMap').setAttribute('style', 'right: 400px;');
      }
    }
    this.mapCache.getMap('map').invalidateSize();
    this.mapCache.getMap('map').setView(this.mapCache.getMap('map').getCenter(), this.mapCache.getMap('map').getZoom());
    return this.isActive = !this.isActive;
  }
}
