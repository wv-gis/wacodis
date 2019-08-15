/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

import * as L from 'leaflet'
import { RasterLayerOptions } from 'esri-leaflet';


declare module 'leaflet' {
  namespace Control {
    class SideBySide extends Control {
      constructor(leftLayers: L.Layer | L.Layer[], rightLayers: L.Layer | L.Layer[], options: Object);
    }
    class PanelLayers extends L.Control {

      constructor(baseLayers: L.PanelBaseLayer[], overlays: L.PanelBaseLayer[], options?: PanelOptions);
      onAdd(map: L.Map): HTMLElement;

      addBaseLayer(layer: L.Layer, name: string, group: L.LayerGroup): this;
      addOverlay(layer: L.Layer, name: string, group: L.LayerGroup): this;
      removeLayer(layerDef: Object): this;
      clearLayers(): this;
      layerFromDef(layerDef: LayersObject): L.Layer;
      update(): void;
      getLayer(id: string): L.Layer;
      addLayer(layerDef: LayersObject, overlay: L.Layer, group: LayerGroup, isCollapsed: boolean): void;
      createItem(obj: Object): HTMLElement;
      createRadioElement(name: string, checked: boolean, obj: Object): Node;
      addItem(obj: Object): HTMLElement;
      createGroup(groupdata: Object, isCollapsed: boolean): HTMLElement;
      onInputClick(): void;
      initLayout(): void;
      updateHeight(h: number): void;
      expand(): this;
      collapse(): this;
      getPath(obj: Object[], prop: string): Object;
    }
  }

  class PanelBaseLayer {
    constructor(options: PanelBaseLayerOptions);
  }
  //  class PanelLayerGroup extends L.Layer {
  //   constructor(options: PanelLayerGroupOptions);
  // }
  // export function panelBaseLayer(options: PanelBaseLayerOptions): L.PanelBaseLayer;
  // export function panelLayerGroup(options: PanelLayerGroupOptions): L.PanelLayerGroup;

  interface PanelBaseLayerOptions extends LayerOptions {
    name: string;
    icon?: string;
    layer: {
      type: string,
      args: string
    } | L.Layer | L.TileLayer;
    active?: boolean
  }

  // interface PanelLayerGroupOptions extends LayerOptions {
  //   group: string;
  //   collapsed?: boolean;
  //   layers: L.PanelBaseLayer[]
  // }



  namespace control {
    export function sideBySide(leftLayers: L.Layer | L.Layer[], rightLayers: L.Layer | L.Layer[], options?: Object): L.Control.SideBySide;
    export function panelLayers(baseLayers: L.PanelBaseLayer[], overlays: L.PanelBaseLayer[], options?: PanelOptions): L.Control.PanelLayers;
  }
  namespace Sync {
    export function offSetHelper(ratioRef: number[], ratioTarget: number[]): L.LatLng;
  }
  interface PanelOptions extends ControlOptions {
    /**
     * @default 'false'
     */
    compact?: boolean;
    /**
    * @default 0
    */
    compactOffset?: number;
    /**
    * @default 'false'
    */
    collapsed?: boolean;
    /**
    * @default 'true'
    */
    autoZIndex?: boolean;
    /**
    * @default false
    */
    collapsibleGroups?: boolean;
    /**
    * @default null
    */
    buildItem?: () => HTMLElement | string;
    /**
     * @default ''
     */
    title?: string;
    /**
     * @default ''
     */
    className?: string;
    /**
  * @default 'topright'
  */
    position?: ControlPosition

  }
  namespace Map {
    export function sync(map: L.Map, options?: SyncOptions): L.Map;
    export function unsync(map: L.Map): L.Map;
    export function isSynced(otherMap: L.Map): boolean;
  }
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