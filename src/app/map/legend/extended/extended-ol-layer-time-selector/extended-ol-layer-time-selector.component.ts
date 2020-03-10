import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { OlLayerTimeSelectorComponent, WmsCapabilitiesService } from '@helgoland/open-layers';
import { ImageWMS, ImageArcGISRest } from 'ol/source';
import Layer from 'ol/layer/Layer';
import * as esri from "esri-leaflet";

@Component({
  selector: 'wv-extended-ol-layer-time-selector',
  templateUrl: './extended-ol-layer-time-selector.component.html',
  styleUrls: ['./extended-ol-layer-time-selector.component.css']
})
export class ExtendedOlLayerTimeSelectorComponent extends OlLayerTimeSelectorComponent implements OnInit {

  @Input() layer: Layer;
  public timeAttribute = true;
  // @Output() selTime:  EventEmitter<Date> = new EventEmitter<Date>();
  @Output() selIndexTime:  EventEmitter<number> = new EventEmitter<number>();

  constructor(private wmsCap: WmsCapabilitiesService) {
    super(wmsCap);
  }

  ngOnInit() {
    super.ngOnInit();

    const imageSource = this.layer.getSource();
    if (imageSource instanceof ImageWMS) {
      // this.loading = true;

      this.url = imageSource.getUrl();
      this.layerid = imageSource.getParams()['layers'] || imageSource.getParams()['LAYERS'];
      this.wmsCaps.getTimeDimensionArray(this.layerid, this.url)
        .subscribe(
          res => this.timeDimensions = res,
          error => { this.timeAttribute = false },
          () => this.loading = false
        );
      if (this.timeAttribute) { }
      // this.determineCurrentTimeParameter();
    }
    else if (imageSource instanceof ImageArcGISRest) {
      this.loading = true;
      this.url = imageSource.getUrl();
      esri.imageService({ url: this.url }).query().where("1=1").fields(["startTime", "endTime", "OBJECTID"]).returnGeometry(true).run((error, featureCollection, feature) => {
        if (error) {
          console.log('Error on Image Service request');
          this.timeAttribute = false;
        } else {
          let times: Date[] = [];
          feature["features"].forEach((element, i, arr) => {
            times.push(new Date(element["attributes"].startTime));
            
          });
          this.timeDimensions = times;
          this.currentTime = this.timeDimensions[this.timeDimensions.length-1];
        }
        // this.selTime.emit(this.currentTime);
        this.selIndexTime.emit(this.timeDimensions.indexOf(this.currentTime));
        this.loading = false
      });
    }
  }

  public onSelection(time: Date) {
    this.playTime(time);
  }

  public playTime(time: Date) {
    this.currentTime = time;
    let source = this.layer.getSource();
    if (this.layerSource) {
      this.layerSource.updateParams({ time: time.toISOString() });
    }
    else if (source instanceof ImageArcGISRest) {
      source.updateParams({time: (new Date(time.getFullYear(), time.getMonth(),time.getDate()+2).getTime()-2628000000)+
        ","+ new Date(time.getFullYear(), time.getMonth(),time.getDate()+2).getTime() });
        // this.selTime.emit(this.currentTime);
        this.selIndexTime.emit(this.timeDimensions.indexOf(time));
    }
  }

  public extendedDetermineCurrentTimeParameter() {
    if (this.layerSource) {
      this.determineCurrentTimeParameter();
    }
    else {
      let source = this.layer.getSource();

      if (source instanceof ImageArcGISRest) {
        esri.imageService({ url: this.url }).query().where("1=1").fields(["startTime", "endTime", "OBJECTID"]).returnGeometry(true).run((error, featureCollection, feature) => {
      
            let times: Date[] = [];
            feature["features"].forEach((element, i, arr) => {
                this.currentTime = new Date(arr[i]["attributes"].startTime);
            });
        },(error)=>console.log('Error on Image Service request: ' + error));
      }
      else{
      }
    }
  }
}
