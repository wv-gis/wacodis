declare var require;
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {  WmsCapabilitiesService } from '@helgoland/open-layers';
import * as esri from "esri-leaflet";
import * as L from 'leaflet';
import { MapCache } from '@helgoland/map';
require('leaflet-timedimension');

@Component({
  selector: 'wv-extended-ol-layer-time-selector',
  templateUrl: './extended-ol-layer-time-selector.component.html',
  styleUrls: ['./extended-ol-layer-time-selector.component.css']
})
export class ExtendedOlLayerTimeSelectorComponent implements OnInit { 

  @Input() layer: any | esri.ImageMapLayer; // selected Layer/Service
  @Input() mapId?: string;
  @Input() defTimeIndex: number = 1;
  @Output() selIndexTime: EventEmitter<number> = new EventEmitter<number>(); // selected Index of Layer
  @Output() currentIndexTime: EventEmitter<Date> = new EventEmitter<Date>(); // current selected time Index
 
  public timeAttribute = true;
  public currentTime: Date;
  public timeDimensions: Date[];
  public loading: boolean;
  protected layerSource: L.TileLayer.WMS;
  protected layerid: string;
  protected url: string;


  constructor(private wmsCap: WmsCapabilitiesService, private mapCache: MapCache) {
    // super(wmsCap);
  }
/**
 * get all time stamps and set the selected time Index of the different Layer types
 */
  ngOnInit() {
  
    if (this.layer._url) {
      this.url = this.layer._url;

      if (this.layer instanceof L.TileLayer.WMS) {
        this.loading = true;
        this.layerid = this.layer.wmsParams.layers;
        this.wmsCap.getTimeDimensionArray(this.layerid, this.url)
          .subscribe(
            res => this.timeDimensions = res,
            error => { this.timeAttribute = false },
            () => {
              this.loading = false;
              this.timeAttribute = true;
              this.currentIndexTime.emit(this.currentTime);
            });

        if (!this.timeDimensions) { this.timeAttribute = false, this.loading = false }
       
      }
    } else if (this.layer.options.url) {
      this.url = this.layer.options.url;
      if (this.layer instanceof esri.ImageMapLayer) {    
        this.loading = true;
         esri.imageService({ url: this.url }).query().where("1=1").fields(["startTime", "endTime", "OBJECTID"]).returnGeometry(true).run((error, featureCollection, feature) => {
          if (error) {
            console.log('Error on Image Service request');
            this.timeAttribute = false;
          } else {
            let times: Date[] = [];
            if (feature["features"]) {
              feature["features"].forEach((element, i, arr) => {
                times.push(new Date(element["attributes"].startTime));
              });
            }
            this.timeDimensions = times;
            if (this.timeDimensions && this.defTimeIndex< this.timeDimensions.length) {
              this.currentTime = this.timeDimensions[this.defTimeIndex];
              this.extendedDetermineCurrentTimeParameter();
            }else if(!this.timeDimensions){
              this.timeAttribute = false;
            }
            else {
              this.currentTime = this.timeDimensions[this.timeDimensions.length-1];
              this.extendedDetermineCurrentTimeParameter();
            }
          }
   
          this.loading = false;
        });
      }
    }
    else if (this.layer instanceof L.TimeDimension.Layer.WMS) {
      this.loading = true;
      this.url = this.layer.options.getCapabilitiesUrl;
      this.layerid = this.layer.options.getCapabilitiesLayerName;
      this.wmsCap.getTimeDimensionArray(this.layerid, this.url)
        .subscribe(
          res => { this.timeDimensions = res; this.timeAttribute = true; },
          error => { this.timeAttribute = false },
          () => this.loading = false
        );

      if (!this.timeDimensions) { this.timeAttribute = false, this.loading = false }
      this.extendedDetermineCurrentTimeParameter();
    }
    else{
      
    }
  }

  /**
   * change the time range of the layer depending on selected time
   * @param time selected time Range
   */
  public onSelection(time: Date) {
    this.playTime(time);
  }

  public playTime(time: Date) {
    this.currentTime = time;
    if (this.layer instanceof L.TileLayer.WMS) {
      // Do nothing
    }
    else if (this.layer instanceof L.TimeDimension.Layer) {
      this.mapCache.getMap(this.mapId).timeDimension.setCurrentTimeIndex(this.timeDimensions.indexOf(this.currentTime));
      this.selIndexTime.emit(this.timeDimensions.indexOf(this.currentTime));
      this.currentIndexTime.emit(this.currentTime);
    }
    else if (this.layer instanceof esri.ImageMapLayer) {
      this.layer.setTimeRange(new Date((new Date(time.getFullYear(), time.getMonth(), time.getDate()).getTime() - 86400000))
        , new Date(time.getFullYear(), time.getMonth(), time.getDate() + 2))
      this.selIndexTime.emit(this.timeDimensions.indexOf(time));
      this.currentIndexTime.emit(this.currentTime);
    }
  }
  public compareFn(option1: Date, option2: Date) {
    return option1 && option2 && option1.getTime() === option2.getTime();
  }

  public extendedDetermineCurrentTimeParameter() {

    if (this.layer instanceof esri.ImageMapLayer) {
 
      this.layer.setTimeRange(new Date((new Date(this.currentTime.getFullYear(), this.currentTime.getMonth(),
       this.currentTime.getDate()).getTime() - 86400000)),
      new Date(this.currentTime.getFullYear(), this.currentTime.getMonth(), this.currentTime.getDate() + 2))
      this.currentIndexTime.emit(this.currentTime);
    }
    else {
      this.wmsCap.getDefaultTimeDimension(this.layerid, this.url).subscribe(time => {
        this.currentTime = time;
        this.currentIndexTime.emit(this.currentTime);
      });

    }
  
  }
}
