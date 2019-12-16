import { Component, OnInit, Input } from '@angular/core';
import { OlLayerAnimateTimeComponent, WmsCapabilitiesService } from '@helgoland/open-layers';
import { Layer } from 'ol/layer';
import { ExtendedOlLayerTimeSelectorComponent } from '../extended-ol-layer-time-selector/extended-ol-layer-time-selector.component';

@Component({
  selector: 'wv-extended-ol-layer-animate-time',
  templateUrl: './extended-ol-layer-animate-time.component.html',
  styleUrls: ['./extended-ol-layer-animate-time.component.css']
})
export class ExtendedOlLayerAnimateTimeComponent extends ExtendedOlLayerTimeSelectorComponent implements OnInit {

  /**
   * Interval of the animation
   */
  @Input() timeInterval = 2000;

  private interval: any;

  constructor(protected wmsCaps: WmsCapabilitiesService) {
    super(wmsCaps);
  }

  ngOnInit() {
  }
  public startAnimation() {
    // get current time parameter
    this.determineCurrentTimeParameter();
    // find index in list
    let idx = this.timeDimensions.findIndex(e => e.getTime() === this.currentTime.getTime());
    // start animation
    this.interval = setInterval(() => {
      idx++;
      if (idx >= this.timeDimensions.length) { idx = 0; }
      this.setTime(this.timeDimensions[idx]);
    }, this.timeInterval);
  }

  public stopAnimation() {
    clearInterval(this.interval);
  }

  public resetAnimation() {
    this.wmsCaps.getDefaultTimeDimension(this.layerid, this.url).subscribe(time => this.setTime(time));
  }

}
