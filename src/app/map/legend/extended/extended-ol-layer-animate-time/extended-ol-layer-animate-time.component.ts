import { Component, OnInit, Input } from '@angular/core';
import * as L from 'leaflet';

import * as esri from 'esri-leaflet';

// esri.ImageMapLayer.include({
//   _visible: true,
//   _loaded: false,

//   _originalUpdate: esri.imageMapLayer.prototype._update,

//   _update: function () {
//     if (!this._visible && this._loaded) {
//       return;
//     }
//     this._originalUpdate();
//   },

//   setLoaded: function (loaded) {
//     this._loaded = loaded;
//   },

//   isLoaded: function () {
//     return this._loaded;
//   },

//   hide: function () {
//     this._visible = false;
//     if (this._image && this._image.style)
//       this._image.style.display = 'none';
//   },

//   show: function () {
//     this._visible = true;
//     if (this._image && this._image.style)
//       this._image.style.display = 'block';
//   },


// });
export interface TimeDimensionLayerImageOptions  extends L.TimeDimensionLayerOptions{
  /**
   * @default 0
   * 
   */
  cache?: number;
 /**
   * @default cache||0
   * 
   */
  cacheBackward?: number;
  /**
   * @default cache||0
   * 
   */
  cacheForward?: number; 
/**
   * @default false
   * 
   */
  updateTimeDimension?: boolean;
     /**
   * @default "intersect"
   * 
   */
  updateTimeDimensionMode?: string;
  /**
   * @default false
   * 
   */
  setDefaultTime?: boolean;
  period?:string;
  timeCachBackward?:number;
  timeCachForward?: number;
}

@Component({
  selector: 'wv-extended-ol-layer-animate-time',
  templateUrl: './extended-ol-layer-animate-time.component.html',
  styleUrls: ['./extended-ol-layer-animate-time.component.css']
})
export class ExtendedOlLayerAnimateTimeComponent extends L.TimeDimension.Layer implements OnInit {

  protected _layers: {};
  protected _defaultTime: number;
  protected _timeCacheBackward: number;
  protected _timeCacheForward: number;
  protected _updateTimeDimension: boolean;
  protected _setDefaultTime: boolean;
  protected _updateTimeDimensionMode: string;
  protected _period: string;
  protected _availableTimes: number[];
  protected _baseLayer;
  protected _timeDimension: L.TimeDimension;
  protected _currentLayer: esri.ImageMapLayer;
  public map: L.Map;

  private interval: any;

  // constructor(public rasterLayer: esri.ImageMapLayer, public imageOptions: TimeDimensionLayerImageOptions) {
  //   super(rasterLayer, imageOptions);
  //   this._layers = {};
  //   this._defaultTime = 0;
  //   this._timeCacheBackward = this.imageOptions.cacheBackward || this.imageOptions.cache || 0;
  //   this._timeCacheForward = this.imageOptions.cacheForward || this.imageOptions.cache || 0;
  //   this._updateTimeDimension = this.imageOptions.updateTimeDimension || false;
  //   this._setDefaultTime = this.imageOptions.setDefaultTime || false;
  //   this._updateTimeDimensionMode = this.imageOptions.updateTimeDimensionMode || 'intersect'; // 'union' or 'replace'
  //   this._period = this.imageOptions.period || null;
  //   this._availableTimes = [];

  //   this._baseLayer.on('load', (function () {
  //     this._baseLayer.setLoaded(true);
  //     this.fire('timeload', {
  //       time: this._defaultTime
  //     });
  //   }).bind(this));
  // }

  ngOnInit() {
  }

  public eachLayer(method: (layer: L.TimeDimension.Layer) => void, context?: any) {
    for (let prop in this._layers) {
      if (this._layers.hasOwnProperty(prop)) {
        method.call(context, this._layers[prop]);
      }
    }
    return L.TimeDimension.Layer.prototype.eachLayer.call(this, method, context);
  }

  protected _onNewTimeLoading(ev: any) {
    let layer = this._getLayerForTime(ev.time);
    if (!this._map.hasLayer(layer)) {
      this._map.addLayer(layer);
    }
  }

  public isReady(time: number): boolean {
    let layer = this._getLayerForTime(time);
    return layer.isLoaded();
  }

  protected _update() {
    if (!this._map)
      return;
    let time = this._map.timeDimension.getCurrentTime();
    let layer = this._getLayerForTime(time);
    if (this._currentLayer == null) {
      this._currentLayer = layer;
    }
    if (!this._map.hasLayer(layer)) {
      this._map.addLayer(layer);
    } else {
      this._showLayer(layer, time);
    }
  }

  protected _showLayer(layer: esri.ImageMapLayer, time: number) {
    if (this._currentLayer && this._currentLayer !== layer) {
      this._currentLayer.hide();
      this._map.removeLayer(this._currentLayer);
    }
    layer.show();
    if (this._currentLayer && this._currentLayer === layer) {
      return;
    }
    this._currentLayer = layer;
    // Cache management
    let times = this._getLoadedTimes();
    let strTime = String(time);
    let index = times.indexOf(strTime);
    let remove = [];
    // remove times before current time
    if (this._timeCacheBackward > -1) {
      let objectsToRemove = index - this._timeCacheBackward;
      if (objectsToRemove > 0) {
        remove = times.splice(0, objectsToRemove);
        this._removeLayers(remove);
      }
    }
    if (this._timeCacheForward > -1) {
      index = times.indexOf(strTime);
      let objectsToRemove = times.length - index - this._timeCacheForward - 1;
      if (objectsToRemove > 0) {
        remove = times.splice(index + this._timeCacheForward + 1, objectsToRemove);
        this._removeLayers(remove);
      }
    }
  }

  protected _getLayerForTime(time: number): esri.ImageMapLayer {
    if (time == 0 || time == this._defaultTime) {
      return this._baseLayer;
    }
    if (this._layers.hasOwnProperty(time)) {
      return this._layers[time];
    }

    let imageBounds = this._baseLayer._bounds;

    let newLayer = esri.imageMapLayer(this._baseLayer.options); // hier
    this._layers[time] = newLayer;
    newLayer.on('load', (function (layer, time) {
      layer.setLoaded(true);
      if (this._map.timeDimension && time == this._map.timeDimension.getCurrentTime() && !this._map.timeDimension.isLoading()) {
        this._showLayer(layer, time);
      }
      this.fire('timeload', {
        time: time
      });
    }).bind(this, newLayer, time));

    // Hack to hide the layer when added to the map.
    // It will be shown when timeload event is fired from the map (after all layers are loaded)
    newLayer.onAdd = (function (map) {
      Object.getPrototypeOf(this).onAdd.call(this, map);
      this.hide();
    }).bind(newLayer);
    return newLayer;
  }
  public setAvailableTimes(times: number[]) {
    this._availableTimes = L.TimeDimension.Util.parseTimesExpression(times, this._period);
    this._updateTimeDimensionAvailableTimes();
  }

  protected _updateTimeDimensionAvailableTimes() {
    if ((this._timeDimension && this._updateTimeDimension) ||
      (this._timeDimension && this._timeDimension.getAvailableTimes().length == 0)) {
      this._timeDimension.setAvailableTimes(this._availableTimes, this._updateTimeDimensionMode);
      if (this._setDefaultTime && this._defaultTime > 0) {
        this._timeDimension.setCurrentTime(this._defaultTime);
      }
    }
  }
  protected _getLoadedTimes(): any[] {
    let result = [];
    for (let prop in this._layers) {
      if (this._layers.hasOwnProperty(prop)) {
        result.push(prop);
      }
    }
    return result.sort();
  }

  protected _removeLayers(times: number[]) {
    for (let i = 0, l = times.length; i < l; i++) {
      this._map.removeLayer(this._layers[times[i]]);
       this._layers[times[i]].splice();
    }
  }


}
