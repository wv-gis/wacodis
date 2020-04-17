import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MapCache } from '@helgoland/map';
import * as esri from 'esri-leaflet';
import { legendParam } from '../../legend/extended/extended-ol-layer-legend-url/extended-ol-layer-legend-url.component';

@Component({
  selector: 'wv-layer-card',
  templateUrl: './layer-card.component.html',
  styleUrls: ['./layer-card.component.css']
})
export class LayerCardComponent implements OnInit {
  @Input() baselayers: L.TileLayer[]|esri.ImageMapLayer[];
  @Input() mapId: string;
  @Output() timeIndex: EventEmitter<number> = new EventEmitter();

  public legendUrl: string;
  public legendUrls: legendParam[];
  public selectedIndex: number = 1;
  constructor(private mapCache: MapCache) { }

  ngOnInit() {
  }
  public getLegendUrl(url?: string, urls?: string[]) {
    this.legendUrls = [{ url: url, label: "", layer: url.split('layer=')[1] }];
  }
  public getLegendUrls(urls: legendParam[]) {
    this.legendUrls = urls;
  }
 

  public removeLayer(i: number) {
    const layer = this.baselayers.splice(i, 1);
    this.mapCache.getMap(this.mapId).removeLayer(layer[0]);
  }
  public getSelectedTime(dat: number) {
    // this.selectedTime = dat;
    this.selectedIndex = dat+1;
    this.timeIndex.emit(this.selectedIndex);
  }
}
