import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { OlLayerTimeSelectorComponent, WmsCapabilitiesService } from '@helgoland/open-layers';
// import { ImageWMS, ImageArcGISRest } from 'ol/source';
// import Layer from 'ol/layer/Layer';
import * as esri from "esri-leaflet";
import * as L from 'leaflet';

@Component({
  selector: 'wv-extended-ol-layer-time-selector',
  templateUrl: './extended-ol-layer-time-selector.component.html',
  styleUrls: ['./extended-ol-layer-time-selector.component.css']
})
export class ExtendedOlLayerTimeSelectorComponent implements OnInit { //extends OlLayerTimeSelectorComponent implements OnInit {

  @Input() layer: any | esri.ImageMapLayer;
  public timeAttribute = true;

  public currentTime: Date;

  public timeDimensions: Date[];

  public loading: boolean;

  protected layerSource: L.TileLayer.WMS;
  protected layerid: string;
  protected url: string;
  // @Output() selTime:  EventEmitter<Date> = new EventEmitter<Date>();
  @Output() selIndexTime: EventEmitter<number> = new EventEmitter<number>();

  constructor(private wmsCap: WmsCapabilitiesService) {
    // super(wmsCap);
  }

  ngOnInit() {
    // super.ngOnInit();

    // const imageSource = this.layer.getSource();
    // if (imageSource instanceof ImageWMS) {
    // this.loading = true;
    if (this.layer._url) {
      this.url = this.layer._url;

      if (this.layer instanceof L.TileLayer.WMS) {
        this.loading = true;
        // this.layerid = imageSource.getParams()['layers'] || imageSource.getParams()['LAYERS'];
        this.layerid = this.layer.wmsParams.layers;
        this.wmsCap.getTimeDimensionArray(this.layerid, this.url)
          .subscribe(
            res => this.timeDimensions = res,
            error => { this.timeAttribute = false },
            () => this.loading = false
          );
        
        if (!this.timeDimensions) { this.timeAttribute = false ,this.loading = false}
        // this.determineCurrentTimeParameter();
      }
    } else if (this.layer.options.url) {
      this.url = this.layer.options.url;
      if (this.layer instanceof esri.ImageMapLayer) {
        // else if (imageSource instanceof ImageArcGISRest) {
        this.loading = true;
        // this.url = imageSource.getUrl();
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
            if (this.timeDimensions) {
              this.currentTime = this.timeDimensions[this.timeDimensions.length - 1];
            }
          }
          // this.selTime.emit(this.currentTime);
          if (this.timeDimensions) {
            this.selIndexTime.emit(this.timeDimensions.indexOf(this.currentTime));
          }
          else {
            this.timeAttribute = false;
          }
          this.loading = false
        });
      }
    }
  }

  public onSelection(time: Date) {
    this.playTime(time);
  }

  public playTime(time: Date) {
    this.currentTime = time;
    // let source = this.layer.getSource();
    // if (this.layerSource) {
      if(this.layer instanceof L.TileLayer.WMS){
      // this.layerSource.updateParams({ time: time.toISOString()});
      // this.layer.wmsParams.time = time.toISOString();
    }
    // else if (source instanceof ImageArcGISRest) {
    else if (this.layer instanceof esri.ImageMapLayer) {
      // source.updateParams({
      //   time: (new Date(time.getFullYear(), time.getMonth(), time.getDate() + 2).getTime() - 2628000000) +
      //     "," + new Date(time.getFullYear(), time.getMonth(), time.getDate() + 2).getTime()
      // });
      this.layer.setTimeRange(new Date((new Date(time.getFullYear(), time.getMonth(), time.getDate() + 2).getTime() - 2628000000))
        , new Date(time.getFullYear(), time.getMonth(), time.getDate() + 2))
      this.selIndexTime.emit(this.timeDimensions.indexOf(time));
    }
  }
  public compareFn(option1: Date, option2: Date) {
    return option1 && option2 && option1.getTime() === option2.getTime();
  }

  public extendedDetermineCurrentTimeParameter() {
    // if (this.layerSource) {
    //   this.determineCurrentTimeParameter();
    // }
    // else {
    // let source = this.layer.getSource();

    // if (source instanceof ImageArcGISRest) {
      if (this.layer instanceof esri.ImageMapLayer) {
      esri.imageService({ url: this.url }).query().where("1=1").fields(["startTime", "endTime", "OBJECTID"]).returnGeometry(true).run((error, featureCollection, feature) => {

        let times: Date[] = [];
        feature["features"].forEach((element, i, arr) => {
          this.currentTime = new Date(arr[i]["attributes"].startTime);
        });
      }, (error) => console.log('Error on Image Service request: ' + error));
    }
    else {
      this.wmsCap.getDefaultTimeDimension(this.layerid, this.url).subscribe(time => this.currentTime = time);
    }
    // }
  }
}
