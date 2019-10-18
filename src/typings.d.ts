/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

import * as L from 'leaflet'
import { RasterLayerOptions } from 'esri-leaflet';


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

  interface Map{
    sync(map: Map, options?: SyncOptions): Map;
    unsync(map: Map): Map;
    isSynced(otherMap: Map): boolean;
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


  namespace esri {
    class ImageMapLayer extends RasterLayer {
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
      getRenderingRule(): object;
      setRenderingRule(renderingRule: object): this;
      getMosaicRule(): object;
      setMosaicRule(mosaicRule: object): this;
      redraw(): this;
    }
    export function imageMapLayer(options: ImageMapLayerOptions): ImageMapLayer;
  }

}