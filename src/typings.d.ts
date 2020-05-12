/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

import * as L from 'leaflet'

import { RasterLayerOptions, RasterLayer, imageMapLayer, ImageMapLayer } from 'esri-leaflet';



declare module 'leaflet' {
  interface SyncOptions extends MapOptions {
    noInitialSync?: boolean;
    syncCursor?: boolean;
    syncCursorMarkerOptions: {
      radius: number;
      fillOpacity: number;
      color: string;
      fillColor: string
    },
    offsetFn?: (center: LatLng, zoom: number, refMap: L.Map, targetMap: L.Map) => LatLng;
  }

  interface Map {
    sync(map: Map, options?: SyncOptions): Map;
    unsync(map: Map): Map;
    isSynced(otherMap: Map): boolean;
    timeDimension?: L.TimeDimension;
  }

  //  class SyncMap extends Map{
  //    constructor(element: string | HTMLElement, options?: MapOptions)
  //       sync(map: Map, options?: SyncOptions): Map;
  //       unsync(map: Map): Map;
  //       isSynced(otherMap: Map): boolean;
  //   }
  // export function map(element: string | HTMLElement, options?: MapOptions): SyncMap;


  namespace Sync {
    export function offSetHelper(ratioRef: number[], ratioTarget: number[]): L.LatLng;
  }


  interface ImageMapLayerOptions extends RasterLayerOptions {
    url: string;
    /**
     * @default 'jpegpng'
     */
    format?: string;
    /**
     * @default 'image'
     */
    f?: string;
    /**
     * @default 1
     */
    opacity?: number;
    /**
    * @default overlayPane
    */
    pane?: string;
    zIndex?: number;
    /**
     * @default 'front'
     */
    position?: string;
    maxZoom?: number;
    minZoom?: number;
    bandIds?: string;
    noData?: number;
    noDataInterpretation?: string;
    pixelType?: string;
    renderingRule?: object;
    mosaicRule?: object;
    token?: string;
    /**
     * @default false
     */
    proxy?: string;
    /**
     * @default true
     */
    useCors?: boolean;
    to?: Date;
    from?: Date;

  }
  // var timeDimension: any;
  interface TimeDimensionOptions extends L.LayerOptions {
    /**
  * @default null
  */
    times?: any
    /**
     * @default "'P1M/'+today"
     */
    timeInterval?: string;
    /**
   * @default "P1D"
   */
    period?: string;

    validTimeRange?: string;
    currentTime?: number;
    /**
 * @default 3000
 */
    loadingTimeout?: number;

    lowerLimitTime?: number;
    upperLimitTime?: number;
  }




  namespace TimeDimension {

    abstract class Layer extends L.Layer {
      options: TimeDimensionLayerOptions
      constructor(layer: L.Layer, options: TimeDimensionLayerOptions);
      addTo(map: Map): this;
      eachLayer(method: (layer: Layer) => void, context?: any): this;
      setZIndex(zIndex: number): this;
      setOpacity(opacity: number): this;
      bringToBack(): this;
      bringtoFront(): this;
      protected _onNewTimeLoading(ev: any): void;
      isReady(time: number): boolean;
      protected _update(): void;
      getBaseLayer(): L.TimeDimension.Layer;
      getBounds(): L.LatLngBounds;

      onAdd(map: Map): this;
      onRemove(map: Map): this;
    }

    class Player extends L.Layer {
      constructor(timeDimension: L.TimeDimension, options?: TimeDimensionPlayerOptions)
      start(numSteps: number): void;
      stop(): void;
      pause(): void;
      release(): void;
      getTransitionTime(): number;
      isLooped(): boolean;
      setTransitionTime(transitionTime: number): void;
      setLooped(looped: boolean): void;
    }
    class Util {
      static parseTimesExpression(times: number[], _period: string): number[];
      getTimeDuration(ISOdur: string): number[];
      addTimeDuration(date: Date, duration: string, utc: boolean): void;
      substractTimeDuration(date: Date, duration: String, utc: boolean): void;
      parseAndExplodeTimeRange(timeRange: string, overwritePeriod: boolean): number[];
      explodeTimeRange(startTime: Date, endTime: Date, ISOdur: string, validTimeRange: string): number[];
      parseTimeInterval(timeInterval: string): Date[];
      parseTimesExpression(times: string, overwritePeriod: boolean): number[];
      intersect_arrays(arrayA: [], aaryB: []): [];
      union_arrays(arrayA: [], arrayB: []): [];
      sort_and_deduplicate(arr: []): [];
    }

    namespace Layer {
      class WMS extends L.TimeDimension.Layer {
        constructor(layer: L.TileLayer.WMS, options?: TimeDimensionLayerWMSOptions)
        getEvents(): { [name: string]: (event: LeafletEvent) => void };
        eachLayer(method: (layer: Layer) => void, context?: any): this;
        isReady(time: number): boolean;
        onAdd(map: Map): this;
        setZIndex(zIndex: number): this;
        setOpacity(opacity: number): this;
        setParams(params: L.WMSParams, noRedraw: boolean): this;
        setMinimumForwardCache(value: number): void;
        setAvailableTimes(times: number[]): void;
        protected _requestTimeDimensionFromCapabilities(): this;
        protected _update(): void;
        protected _unvalidateCache(): void;
        protected _showLayer(layer: L.TileLayer, time: number): void;
        protected _evictCachedTimes(keepforward: number, keepbachward: number): void;
        protected _getLayerForTime(time: number): L.Layer;
        protected _onNewTimeLoading(ev: any): void;
        protected _createLayerForTime(time: number): L.Layer;
        protected _getLoadedTimes(): any[];
        protected _removeLayers(times: number[]): void;
        protected _getCapabilitiesUrl(): string;
        protected _parseTimeDimensionFromCapabilities(xml: any): number[];
        protected _getDefaultTimeFromCapabilities(xml: any): number;
        protected _getDefaultTimeFromLayerCapabilities(layer: L.TileLayer): number;
        protected _updateTimeDimensionAvailableTimes();
        protected _getNearestTime(time: number): number;
        options: TimeDimensionLayerWMSOptions;
      }
      class ImageMapLayer extends L.TimeDimension.Layer {
        constructor(layer: esri.ImageMapLayer, options?: TimeDimensionLayerImageOptions)


        eachLayer(method: (layer: Layer) => void, context?: any): this;
        isReady(time: number): boolean;
        onAdd(map: Map): this;
        setZIndex(zIndex: number): this;
        setOpacity(opacity: number): this;
        setMinimumForwardCache(value: number): void;
        setAvailableTimes(times: number[]): void;

        protected _update(): void;
        protected _onNewTimeLoading(ev: any): void;
        protected _getLayerForTime(time: number): L.Layer;
        protected _getLoadedTimes(): any[];
        protected _removeLayers(times: number[]): void;
        protected _showLayer(layer: RasterLayer, time: number): void;
        options: TimeDimensionLayerImageOptions;
      }
    }
  }
  interface TimeDimensionLayerImageOptions extends TimeDimensionLayerOptions {
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
    period?: string;
    timeCachBackward?: number;
    timeCachForward?: number;
  }
  interface TimeDimensionPlayerOptions extends L.LayerOptions {
    /**
 * @default 1000
 */
    transitionTime: number;

    /**
  * @default 5
  */
    buffer: number;

    /**
 * @default 1
 */
    minBufferReady: number;

    /**
 * @default false
 */
    loop: boolean;

    /**
* @default false
*/
    startOver: boolean;

  }
  interface TimeDimensionLayerWMSOptions extends L.WMSOptions, L.TimeDimensionLayerOptions {
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
    requestTimeFromCapabilities?: boolean;
    proxy?: string;
    getCapabilitiesParams?: Object;
    getCapabilitiesUrl?: string;
    getCapabilitiesLayerName?: string;
    /**
     * @default false
     * 
     */
    setDefaultTime?: boolean;
    period?: string;
    /**
     * @default layer.options.version||"1.1.1"
     * 
     */
    wmsVersion?: string;

  }
  interface TimeDimensionLayerOptions extends L.LayerOptions {
    timeDimension?: L.TimeDimension;
    /**
 * @default 1
 */
    opacity?: number;
    /**
     * @default 1
     */
    zIndex?: number;

  }
  namespace timeDimension {
    export function layer(layer: L.Layer, options?: TimeDimensionLayerOptions): TimeDimension.Layer;
    namespace layer {
      export function wms(layer: L.TileLayer.WMS, options?: TimeDimensionLayerWMSOptions): TimeDimension.Layer.WMS;
      export function imageMapLayer(layer: esri.ImageMapLayer, options?: TimeDimensionLayerImageOptions): TimeDimension.Layer.ImageMapLayer;
    }

  }
  export function timeDimension(options?: TimeDimensionOptions): L.TimeDimension;
  class TimeDimension extends L.Layer {
    constructor(options?: TimeDimensionOptions);
    getAvailableTimes(): number[];
    getCurrentTimeIndex(): number;
    getCurrentTime(): number;
    isLoading(): boolean;

    setCurrentTimeIndex(newIndex: number): void;
    protected _newTimeIndexLoaded(): void;
    protected _checkSyncedLayersReady(time: number): boolean;
    setCurrentTime(time: number): void;
    seekNearestTime(time: Date): Date;
    nextTime(numSteps: number, loop: boolean): void;
    prepareNextTimes(numSteps: number, howmany: number, loop: any): void;
    getNumberNextTimesReady(numSteps: number, howmany: number, loop: boolean): number;
    previousTime(numSteps: number, loop: boolean): void;
    registerSyncedLayer(layer: L.TimeDimension.Layer): void;
    unregisterSyncedLayer(layer: L.TimeDimension.Layer): void;
    protected _onSyncedLayerLoaded(e: Event): void;
    protected _generateAvailableTimes(): string[];
    protected _getDefaultCurrentTime(): number;
    protected _seekNearestTimeIndex(time: number): number;

    setAvailableTimes(times: number[], mode: string): void;
    getLowerLimit(): number;
    getUpperLimit(): number;
    setLowerLimit(time: number): void;
    setUpperLimit(time: number): void;
    setLowerLimitIndex(index: number): void;
    setUpperLimitIndex(index: number): void;
    getLowerLimitIndex(): number;
    getUpperLimitIndex(): number;
    options: TimeDimensionOptions;
  }
  interface KnobOptions {
    /**
 * @default 'knob'
 */
    className: string;
    /**
     * @default 1
     */
    step: number;
    /**
   * @default 0
   */
    rangeMin: number;
    /**
    * @default 10
    */
    rangeMax: number;
  }
  namespace UI {
    class Knob extends L.Draggable {
      constructor(slider: string, options?: KnobOptions)

      getMinValue(): number;
      getMaxValue(): number;
      setStep(step: number): void;
      setPosition(x: number): void;
      getPosition(): number;
      setValue(v: number): void;
      getValue(): number;
    }
  }
  interface TimeDimensionMapOptions extends L.MapOptions {
    /**
     * @default false
     */
    timeDimension?: boolean;
    timeDimensionOptions?: L.TimeDimensionOptions;
    /**
    * @default false
    */
    timeDimensionControl?: boolean;
    timeDimensionControlOptions?: L.TimedimensionControlOptions;
  }
  interface TimedimensionControlOptions extends L.ControlOptions {
    /**
     * @default 'leaflet-control-timecontrol'
     *  */
    styleNS?: string;
    /**
     * @default 'bottomleft'
     */
    position?: L.ControlPosition;
    /**
     * @default 'Time Control'
     */
    title?: string;
    /**
    * @default true
    */
    backwardButton?: boolean;
    /**
    * @default true
    */
    forwardButton?: boolean;
    /**
    * @default true
    */
    playButton?: boolean;
    /**
    * @default false
    */
    playReverseButton?: boolean;
    /**
     * @default false
     */
    loopButton?: boolean;
    /**
   * @default true
   */
    displayDate?: boolean;
    /**
    * @default true
    */
    timeSlider?: boolean;
    /**
    * @default false
    */
    timeSliderDragUpdate?: boolean;
    /**
    * @default false
    */
    limitSliders?: boolean;
    /**
     * @default 5
     */
    limitMinimumRange?: number;
    /**
    * @default true
    */
    speedSlider?: boolean;
    /**
     * @default 0.1
     */
    minSpeed?: number;
    /**
     * @default 10
     */
    maxSpeed?: number;
    /**
     * @default 0.1
     */
    speedStep?: number;
    /**
     * @default   1
     */
    timeSteps?: number;
    /**
    * @default false
    */
    autoPlay?: boolean;

    playerOptions?: {
      /**
        * @default 1000
        */
      transitionTime: number;

    },
    /**
  * @default ['Local','UTC']
  */
    timeZones?: string[];
    player?: L.TimeDimension.Player;
  }
  namespace Control {
    class TimeDimension extends L.Control {
      constructor(options?: TimedimensionControlOptions)

      addTo(map: Map): this;
      onRemove?(map: Map): void;

      options: TimedimensionControlOptions;
    }
  }
  export namespace control {
    function timeDimension(options?: TimedimensionControlOptions): L.Control.TimeDimension;
  }



  namespace esri {

    interface IdentifyImageOptions extends ServiceOptions { }

    /**
     * `L.esri.IdentifyImage` is an abstraction for the Identify API found in Image Services. It provides a
     * chainable API for building request parameters and executing the request.
     */
    class IdentifyImage extends Task {
      constructor(options: IdentifyImageOptions | ImageService);

      /**
       * Identifies pixel value at a given LatLng geometry.
       */
      at(geometry: LatLng): this;
      /**
       * Identifies pixel values within a given time range.
       */
      between(from: Date, to: Date): this;
      getRenderingRule(): Object;
      setRenderingRule(renderingRule: Object): this;
      getMoasicRule(): Object;
      setMosaicRule(mosaicRule: Object): this;
      setPixelSize(pixelSize: number[] | string): this;
      getPixelsize(): Object;
      returnCatalogItems(returnCatalogItems: boolean): this;
      returnGeometry(returnGeomery: boolean): this;
      token(token: string): this;
      run(callback: FeatureCallbackHandler, context?: any): this;
    }

    /**
     * `L.esri.IdentifyImage` is an abstraction for the Identify API found in Image Services. It provides a
     * chainable API for building request parameters and executing the request.
     */
    export function identifyImage(options: IdentifyImageOptions | ImageService): IdentifyImage;

    interface ImageService {
      identify(): IdentifyImage;
    }


    class ImageMapLayer extends RasterLayer {
      _visible: true;
      _loaded: false;

      constructor(options: ImageMapLayerOptions)
      /**
      * Redraws this layer below all other overlay layers.
      */
      bringToBack(): this;
      /**
       * 	Redraws this layer above all other overlay layers.
       */
      bringToFront(): this;

      bindPopup(fn: FeatureCallbackHandler, popupOptions?: L.PopupOptions): this;
      bindPopup(content: ((layer: Layer) => Content) | Content | Popup, options?: PopupOptions): this;
      /**
        * Removes a popup previously bound with bindPopup.
        */
      unbindPopup(): this;
      /**
       * Returns the current opacity of the layer.
       */
      getOpacity(): number;
      /**
       * Sets the opacity of the layer.
       */
      setOpacity(opacity: number): this;
      getTimeRange(): Date[];
      setTimeRange(from: Date, to: Date): this;
      getBandIds(): string;
      setBandIds(bandIds: string[] | string): this;
      getNoData(): string;
      setNoData(noData: number[] | number, noDataInterpretation: string): this;
      getNoDataInterpretation(): string;
      getPixelType(): string;
      setPixelType(pixelType: string): this;
      authenticate(token: string): this;
      metadata(callback: CallbackHandler, context?: object): this;
      query(): this;
      identify(): this;
      getRenderingRule(): object;
      setRenderingRule(renderingRule: object): this;
      getMosaicRule(): object;
      setMosaicRule(mosaicRule: object): this;
      redraw(): this;
      show(): void;
      hide(): void;
      isLoaded(): boolean;
      setLoaded(loaded: boolean): void;
      protected _update(): void;
    }
    export function imageMapLayer(options: ImageMapLayerOptions): ImageMapLayer;
  }

}

