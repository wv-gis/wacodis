import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MapCache } from '@helgoland/map';
import * as esri from 'esri-leaflet';
import { legendParam } from '../../legend/extended/extended-ol-layer-legend-url/extended-ol-layer-legend-url.component';

@Component({
  selector: 'wv-layer-card',
  templateUrl: './layer-card.component.html',
  styleUrls: ['./layer-card.component.css']
})
/**
 * Wrapper Class for time selection of layer
 * @Input baseLayers:  list of layers shown in map
 * @Input mapId:  corresponding mapId of layers
 * @Input defTimeIndex: default Time Index
 * @Output timeIndex: selected time Index as intern number of service
 * @Output curTimeIndex: current selected time as Date
 */
export class LayerCardComponent implements OnInit {
  @Input() baselayers: L.TileLayer[]|esri.ImageMapLayer[];
  @Input() mapId: string;
  @Input() defTimeIndex: number = 1;
  @Output() timeIndex: EventEmitter<number> = new EventEmitter<number>();
  @Output() curTimeIndex: EventEmitter<Date> = new EventEmitter<Date>();

  public legendUrl: string;
  public legendUrls: legendParam[];
  public selectedIndex: number = 1;
  constructor(private mapCache: MapCache) { }

  ngOnInit() {
    this.timeIndex.emit(this.defTimeIndex+1);
  }
  public getLegendUrl(url?: string, urls?: string[]) {
    this.legendUrls = [{ url: url, label: "", layer: url.split('layer=')[1] }];
  }
  public getLegendUrls(urls: legendParam[]) {
    this.legendUrls = urls;
  }
 
/**
 * remove layer from layer list and map
 * @param i number of layer within the list
 */
  public removeLayer(i: number) {
    const layer = this.baselayers.splice(i, 1);
    this.mapCache.getMap(this.mapId).removeLayer(layer[0]);
  }
  /**
   * set selected Index based on Input id
   * @param dat id of selected Time Range
   */
  public getSelectedTime(dat: number) {
    // this.selectedTime = dat;
    this.selectedIndex = dat+1;
    this.timeIndex.emit(this.selectedIndex);
  }
  /**
   * emit the selected Date to set time range of service
   * @param dat selected Date
   */
  public setCurrentTime(dat: Date){
    this.curTimeIndex.emit(dat);
  }
}
