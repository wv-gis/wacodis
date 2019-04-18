declare var require: any;
import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { MapCache, GeoSearchOptions, LayerOptions } from '@helgoland/map';
import * as L from 'leaflet';
import * as esri from "esri-leaflet";
import { DatasetApiInterface, ParameterFilter } from '@helgoland/core';
import { RequestTokenService } from 'src/app/services/request-token.service';
import { ComparisonSelectionService } from 'src/app/services/comparison-selection.service';
import { error } from '@angular/compiler/src/util';
import { LatLngBounds } from '@helgoland/map/node_modules/@types/leaflet';
require('leaflet.sync');

// const sentinelLayerOptions = ['Agriculture', 'Bathymetric', 'Color Infrared', 'Natural Color', 'Healthy Vegetation', 'None'];
// const bandIdOptions = ['10,8,3', '4,3,1', '8,4,3', '4,3,2', '11,8,2', ''];
// const rasterFunctionOpt = [{ "rasterFunction": "Agriculture with DRA" }, { "rasterFunction": "Bathymetric with DRA" }, { "rasterFunction": "Color Infrared with DRA" },
// { "rasterFunction": "Natural Color" }, { "rasterFunction": "Agriculture" }, { "rasterFunction": "None" }]
const sentinelLayerOptions = ['Natural Color', 'Color Infrared'];
const externLayerOptions = ['Landcover'];
const bandIdOptions = ['4,3,2', '8,4,3'];
const rasterFunctionOpt = [{ "rasterFunction": "Natural Color" }, { "rasterFunction": "Color Infrared with DRA" }];

@Component({
  selector: 'wv-comparison-view',
  templateUrl: './comparison-view.component.html',
  styleUrls: ['./comparison-view.component.css']
})
export class ComparisonViewComponent implements OnInit, AfterViewInit {


  public syncedMap: any;
  public container: HTMLElement;
  public defaultBaseMap: Map<string, LayerOptions> = new Map<string, LayerOptions>();
  public zoomControlOptions: L.Control.ZoomOptions = { position: 'topleft' };
  public layerControlOptions: L.Control.LayersOptions = { position: 'bottomleft' };
  public mapOptions: L.MapOptions = { dragging: true, zoomControl: true, boxZoom: false };
  public fitBounds: L.LatLngBoundsExpression = [[50.985, 6.924], [51.319, 7.607]];;
  public searchOptions: GeoSearchOptions = { countrycodes: [] };
  public avoidZoomToSelection = false;
  public mapWasDragEnabled: boolean;
  public mapWasTapEnabled: boolean;
  public range;
  public _map: any;
  public divider;
  public dividerSym;
  public leftLayer;
  public rightLayer;
  public selectionData: Object[];
  public view: string;
  public controlLegend: any;
  public controlHtml: HTMLElement;
  public legend: HTMLElement;
  public wmsLayer: any;
  public compMap: any;

  public comparisonOptions = [];
  public comparisonBaseLayers = [];
  public senLayers: esri.ImageMapLayer[] = [];
  public oldLayer: esri.ImageMapLayer;
  public sentinelLayer: esri.ImageMapLayer;
  public token: string = '';
  public imageAccess: Object;
  public selectLeftLayer: string = 'Layer im linken Bereich';
  public selectRightLayer: string = "Layer im rechten Bereich";
  public selectedIdL: number;
  public selectedIdR: number;
  public _rightLayer: (L.TileLayer | esri.ImageMapLayer);
  public _leftLayer: (L.TileLayer | esri.ImageMapLayer);
  public selRightDate: Date[] = [];
  public selLeftDate: Date[] = [];
  public defaultLDate: Date = new Date(2019, 1);
  public defaultRDate: Date = new Date(2018, 11);
  public display = 'visible';
  public unresolvableServices: string[] = [];
  public acquisitionDates = [];
  public refreshInterval = '';

  constructor(private mapCache: MapCache, private comSelSrvc: ComparisonSelectionService, private tokenService: RequestTokenService) {

    this.selectionData = this.comSelSrvc.getSelection();
  }

  ngOnInit(): void {

    for (let i = 0; i < sentinelLayerOptions.length; i++) {
      this.comparisonOptions.push(sentinelLayerOptions[i]);
    }
    this.comparisonOptions.push(externLayerOptions[0]);
    this.setSentinelLayer('https://sentinel.arcgis.com/arcgis/rest/services/Sentinel2/ImageServer');

    let toDate = new Date().getTime();

    this.wmsLayer = L.tileLayer.wms('http://ows.terrestris.de/osm/service?',
      {
        layers: 'OSM-WMS', format: 'image/png', transparent: true, maxZoom: 16, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>', className: 'OSM'
      });

    this.defaultBaseMap.set('comparisonMap',
      {
        label: 'OSM', visible: true, layer: this.wmsLayer
      });
  }
  /**
   * Method which decides which View is depicted depending on the selected parameters
   */
  ngAfterViewInit(): void {
    this.controlLegend = new L.Control({ position: 'topright' });
    this.controlLegend.onAdd = function (map) {
      this.controlHtml = L.DomUtil.create('div');
      // this.legend = L.DomUtil.create('div', 'legend', this.controlHtml);
      // this.legend.setAttribute('display', 'block');
      this.controlHtml.innerHTML = '<img src="assets/images/Legende.png" alt="Legende">';
      // this.controlHtml.innerHTML = '<span>- </span>' + this.legend.innerHTML;
      return this.controlHtml;
    };
    // L.DomEvent.on(this.controlHtml,'click', this.changeVisibility(this.legend));
  }
  public submitSelection() {

    this.leftLayer = this._leftLayer;
    this.rightLayer = this._rightLayer;
    if (document.forms[0]["selectedForm"][0].selected) {

      this.view = document.forms[0]["selectedForm"][0].value;
      this.setSplittedMap();
    }
    else if (document.forms[0]["selectedForm"][1].selected) {
      this.view = document.forms[0]["selectedForm"][1].value;
      this.setsyncedMap();
    }
    this.display = 'hidden';
  }

  changeVisibility(el: HTMLElement) {
    console.log('Change legend');
  }
  /** Method to depict the splitted View
   * creates new Panes for Sentinel Layers and Divider and Range Symbol
   */
  setSplittedMap() {
    this._map = this.mapCache.getMap('comparisonMap');
    // if(!this._map.getPane('imagePane')){
    if (this.rightLayer.options.pane === 'imagePane' + this.selectedIdR + 1) {
      this._map.createPane('imagePane' + this.selectedIdR + 1);
      console.log('Create Right Pane Sentinel');
    }
    if (this.leftLayer.options.pane === 'imagePane' + this.selectedIdL) {
      this._map.createPane('imagePane' + this.selectedIdL);
    }
    // }

    this._map.addLayer(this.leftLayer);
    this._map.addLayer(this.rightLayer);

    this.container = L.DomUtil.create('div', 'leaflet-sbs', this._map.getContainer().children['1']);
    let Divider = L.Control.extend({
      onAdd: function (map) {
        let compDivider = L.DomUtil.create('div', 'leaflet-sps-divider');
        compDivider.style.cssText = 'height: 100%; position: absolute; background-color: #fff;font-size:20px; width: 4px; z-index: 800; pointer-events: none;';
        this.dividerSym = L.DomUtil.create('img', 'divider', compDivider);
        this.dividerSym.style.cssText = 'top : 47%; position: relative; margin-left: -23px; cursor: pointer; z-index:800';
        this.dividerSym.src = "assets/images/dividerGrau_Transp.png";

        return compDivider;
      }
    });
    let ComparisonRange = L.Control.extend({
      onAdd: function (map) {
        let compRange = L.DomUtil.create('input', 'leaflet-sps-range', L.DomUtil.get('comparisonMap'));
        compRange.style.cssText = 'margin: 0px; position: absolute; width: 100%; z-index: 0; cursor: pointer; top: 50%; border: 0; height: 0; background: rgba(0,0,0,0.25); color: white;';
        compRange.id = 'range';
        compRange.setAttribute('type', 'range');
        compRange.setAttribute('min', '0');
        compRange.setAttribute('max', '1');
        compRange.setAttribute('value', '0.5');
        compRange.setAttribute('step', 'any');
        return compRange;
      }
    });
    this.range = new ComparisonRange();
    this.divider = new Divider();
    this.mapCache.getMap('comparisonMap').addControl(this.divider);
    this.mapCache.getMap('comparisonMap').addControl(this.range);
    this.container.appendChild(this.divider.getContainer());
    this.container.appendChild(this.range.getContainer());
    this.range._container.value = 0.5;
    this.addEvents();
    this.updateLayers();
  }
  /**
   * Method to create a splitted View
   */
  addSplitScreenNew() {

    let _divider = this.divider;
    let map = this._map;

    if (!map || !_divider) {
      console.error('No map or divider');
      return this;
    }

    let nw = map.containerPointToLayerPoint([0, 0]);
    let se = map.containerPointToLayerPoint(map.getSize());
    let clipX = nw.x + ((map.getSize().x * this.range._container.value) + (0.5 - this.range._container.value) * 42 * 2);
    let dividerX = ((map.getSize().x * this.range._container.value) + (0.5 - this.range._container.value) * 42 * 2);
    this.divider._container.style.left = dividerX + 'px';
    map.fire('dividermove', { x: dividerX });

    let clipLeft = 'rect(' + [nw.y, clipX, se.y, nw.x].join('px,') + 'px);';
    let clipRight = 'rect(' + [nw.y, se.x, se.y, clipX].join('px,') + 'px);';
    // document.getElementById('leftName').setAttribute('style', 'width: ' + clipX + 'px;');
    // document.getElementById('leftTime').setAttribute('style', 'width: ' + clipX + 'px;');

    if (this.leftLayer) {

      if (this.leftLayer.options.pane === 'imagePane' + this.selectedIdL) {
        document.getElementsByClassName('leaflet-pane leaflet-image' + this.selectedIdL + '-pane')[0].setAttribute('style', 'clip: ' + clipLeft);
      }
      else {
        let tileLayerPane = document.getElementsByClassName('leaflet-pane leaflet-overlay-pane') as HTMLCollectionOf<HTMLElement>;
        tileLayerPane[0].setAttribute('style', 'clip: ' + clipLeft);
      }
    }

    if (this.rightLayer) {
      this.rightLayer.bringToFront();
      if (this.rightLayer.options.pane === 'imagePane' + this.selectedIdR + 1) {
        document.getElementsByClassName('leaflet-pane leaflet-image' + this.selectedIdR + 1 + '-pane')[0].setAttribute('style', 'clip: ' + clipRight);
      }

      else {

        let tileLayerPane = document.getElementsByClassName('leaflet-pane leaflet-overlay-pane') as HTMLCollectionOf<HTMLElement>;
        tileLayerPane[0].setAttribute('style', 'clip: ' + clipRight);

      }
      this.mapCache.getMap('comparisonMap').invalidateSize();
    }
  }
  /*
  change the view from splitted view to synced view or vice versa
  */
  public changeView() {
    if (this.view === 'split') {
      this.remove();
      this.setsyncedMap();
      this.view = 'synced';
    } else {
      this.removeSync();
      this.setSplittedMap();
      this.view = 'split';
    }
  }
  /**
   * Method for adding EventListeners for mouseover , move and zoom in regard to the divider
   */
  private addEvents() {
    let _range = this.range;
    let map = this._map;
    if (!map || !_range) {
      console.error('No map or range');
      return this;
    }
    L.DomEvent.on(this.range._container, this.getRangeEvent(this.range._container), this.addSplitScreenNew, this);
    map.on('move', this.addSplitScreenNew, this);
    map.on('zoom', this.addSplitScreenNew, this);
    L.DomEvent.on(this.range._container, 'mouseover', this.cancelMapDrag, this);
    L.DomEvent.on(this.range._container, 'mouseout', this.uncancelMapDrag, this);
  }
  /**
   * cancel Map Drag if the slider is in use
   */
  private cancelMapDrag(e) {
    this.mapWasDragEnabled = this._map.dragging.enabled()
    if (this._map.tap && this._map.tap.enabled()) {
      this.mapWasTapEnabled = true;
      this._map.tap.disable();
    }
    else {
      this.mapWasTapEnabled = false
    }
    this._map.dragging.disable();
  }
  /**
   * uncancel Map drag when slider is out of use
   * @param e event
   */
  private uncancelMapDrag(e) {
    console.log(e.type);
    if (this.mapWasDragEnabled) {
      this._map.dragging.enable()
    }
    if (this.mapWasTapEnabled) {
      this._map.tap.enable()
    }
  }

  private getRangeEvent(rangeInput: any) {
    const match = navigator.userAgent.search(/(?:Edge|MSIE|Trident\/.*; rv:)/);
    if (match !== -1) {
      return 'onchange' in rangeInput ? 'change' : 'input';
    }
    else {
      return 'oninput' in rangeInput ? 'input' : 'change';
    }
  }

  /**
   * remove Events if splitted View should be closed
   */
  private removeEvents() {
    let _range = this.range;
    let map = this._map;
    if (_range) {
      L.DomEvent.off(this.range._container, this.getRangeEvent(this.range._container), this.addSplitScreenNew, this);
      L.DomEvent.off(this.range._container, 'mouseover', this.cancelMapDrag, this);
      L.DomEvent.off(this.range._container, 'mouseout', this.uncancelMapDrag, this);
    }
    if (map) {
      map.off('layeradd layerremove', this.updateLayers, this);
      map.off('zoom', this.addSplitScreenNew, this);
      map.off('move', this.addSplitScreenNew, this);
    }
  }

  /**
   * set new Layers to the splitted view and create the splitted view
   */
  private updateLayers() {
    if (!this._map) {
      return this;
    }
    let prevLeft = this.leftLayer;
    let prevRight = this.rightLayer;

    if (prevLeft !== this.leftLayer) {
      prevLeft && this._map.fire('leftlayerremove', { layer: prevLeft })
      this.leftLayer && this._map.fire('leftlayeradd', { layer: this.leftLayer })

    }
    if (prevRight !== this.rightLayer) {
      prevRight && this._map.fire('rightlayerremove', { layer: prevRight })
      this.rightLayer && this._map.fire('rightlayeradd', { layer: this.rightLayer })

    }
    this.addSplitScreenNew();
  }
  /**
   * remove the components of the splitted view
   */
  private remove() {
    if (!this._map) {
      return this;
    }
    if (this.leftLayer) {

      if (this.leftLayer.options.pane === 'imagePane' + this.selectedIdL) {
        this._map.getPane('imagePane' + this.selectedIdL).remove();
      }
      else {
        let tileLayerPane = document.getElementsByClassName('leaflet-pane leaflet-overlay-pane') as HTMLCollectionOf<HTMLElement>;
        tileLayerPane[0].removeAttribute('style');

      }
      this._map.removeLayer(this.leftLayer);
    }
    if (this.rightLayer) {

      if (this.rightLayer.options.pane === 'imagePane' + this.selectedIdR + 1) {
        this._map.getPane('imagePane' + this.selectedIdR + 1).remove();
      }
      else {
        let tileLayerPane = document.getElementsByClassName('leaflet-pane leaflet-overlay-pane') as HTMLCollectionOf<HTMLElement>;
        tileLayerPane[0].removeAttribute('style');

      }
      this._map.removeLayer(this.rightLayer);
    }
    this.removeEvents();
    L.DomUtil.remove(this.container);

    this._map = null;
  }


  private setsyncedMap() {
    let newMap = document.createElement('div');
    newMap.setAttribute('id', 'map2');
    newMap.style.width = '49.5%';
    newMap.style.height = '100%';
    newMap.style.position = 'relative';
    newMap.style.cssFloat = 'right'
    document.getElementById('mainMap').appendChild(newMap);
    document.getElementById('main').style.width = '50%';

    this.compMap = this.mapCache.getMap('comparisonMap');
    this.syncedMap = new L.Map(newMap).setView([51.161, 7.482], 13);
    this.mapCache.getMap('comparisonMap').setView([51.161, 7.482], 13);
    L.tileLayer.wms('http://ows.terrestris.de/osm/service?',
      {
        layers: 'OSM-WMS', format: 'image/png', transparent: true, maxZoom: 16, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>', className: 'OSM'
      }).addTo(this.syncedMap);
    this.mapCache.setMap('map2', this.syncedMap);

    if (this.rightLayer.options.pane === 'imagePane' + this.selectedIdR + 1) {
      this.syncedMap.createPane('imagePane' + this.selectedIdR + 1)
    }
    if (this.leftLayer.options.pane === 'imagePane' + this.selectedIdL) {
      this.mapCache.getMap('comparisonMap').createPane('imagePane' + this.selectedIdL);
    }
    // this.mapCache.getMap('map2').addControl(this.controlLegend);
    this.syncedMap.addLayer(this.rightLayer);
    this.mapCache.getMap('comparisonMap').addLayer(this.leftLayer);
    this.compMap.sync(this.syncedMap);
    // this.mapCache.getMap('comparisonMap').sync(this.syncedMap);
    this.syncedMap.sync(this.mapCache.getMap('comparisonMap'));
    this.mapCache.getMap('comparisonMap').invalidateSize();
    this.syncedMap.invalidateSize();
  }

  private removeSync() {
    // this.mapCache.getMap('comparisonMap').unsync(this.syncedMap);
    if (!this.syncedMap || !this.mapCache.getMap('comparisonMap')) {
      return this;
    }
    this.compMap.unsync(this.syncedMap);
    this.syncedMap.unsync(this.mapCache.getMap('comparisonMap'));

    this.syncedMap.removeLayer(this.rightLayer);
    document.getElementById('map2').remove();
    document.getElementById('main').style.width = '100%';
    this.mapCache.getMap('comparisonMap').removeLayer(this.leftLayer);

    if (this.leftLayer.options.pane === 'imagePane' + this.selectedIdL) {
      this.mapCache.getMap('comparisonMap').getPane('imagePane' + this.selectedIdL).remove();
    }
    this.mapCache.getMap('comparisonMap').invalidateSize();
    this.syncedMap = null;
  }
  public onCloseHandled() {
    this.display = 'hidden';
  }


  public setSentinelLayer(url: string) {
    for (let i = 0; i < sentinelLayerOptions.length; i++) {
      this.senLayers.push(esri.imageMapLayer({
        url: url, maxZoom: 16, alt: sentinelLayerOptions[i].toString(), renderingRule: rasterFunctionOpt[i], position: 'pane', pane: 'imagePane' + i, opacity: 0.8
      }));
    }
    if (!this.tokenService.getToken()) {
      this.tokenService.requestToken().subscribe((res) => {

        if (this.unresolvableServices)
          this.unresolvableServices = [];
        this.imageAccess = res;
        this.token = this.imageAccess['access_token'];
        this.refreshInterval = this.imageAccess["expires_in"];
        console.log(this.refreshInterval);
        for (let k = 0; k < this.senLayers.length; k++) {
          this.senLayers[k].authenticate(this.token);
          this.comparisonBaseLayers.push(this.senLayers[k]);
        }

        this.comparisonBaseLayers.push(L.imageOverlay('https://wacodis.maps.arcgis.com/sharing/rest/content/items/846c30b6a1874841ac9d5f6954f19aad/data',
          [[51.299046, 6.949204], [51.046668, 7.615934]], { opacity: 0.6, pane: 'overlayPane', alt: 'Landcover' }));
        this.tokenService.setToken(this.token);
      }, error => {
       
        
        console.log('Service not available');
        this.unresolvableServices = sentinelLayerOptions;
      });
    }
    else {
      for (let k = 0; k < this.senLayers.length; k++) {
        this.senLayers[k].authenticate(this.tokenService.getToken());
        this.comparisonBaseLayers.push(this.senLayers[k]);
      }
      this.comparisonBaseLayers.push(L.imageOverlay('https://wacodis.maps.arcgis.com/sharing/rest/content/items/846c30b6a1874841ac9d5f6954f19aad/data',
        [[51.299046, 6.949204], [51.046668, 7.615934]], { opacity: 0.6, pane: 'overlayPane', alt: 'Landcover' }));
    }
  }

  private queryLayer(side: string) {
    if (!this.tokenService.getToken()) {
      this.tokenService.requestToken().subscribe((res) => {
        this.imageAccess = res;
        this.token = this.imageAccess['access_token'];
      });
    }
    else{
      this.token = this.tokenService.getToken();
    }
    esri.imageService({ url: 'https://sentinel.arcgis.com/arcgis/rest/services/Sentinel2/ImageServer' }).query().between(new Date(2018, 3), new Date())
      .bboxIntersects(this.mapCache.getMap('comparisonMap').getBounds()).where(" cloudcover<=0.4 AND category=1")
      .fields(['acquisitiondate', 'cloudcover', 'q', 'best']).orderBy('acquisitiondate', 'ASC')
      .token(this.token).limit(1500).returnGeometry(false)
      .run((error, featureCollection, feature) => {
        if (error) {
          console.log('Error ' + JSON.stringify(error) + ' Service not available');
          if(error.code === 499 && error.message ==='Token Required'){
            console.log('Token Required');
          }
          else{
            this.unresolvableServices = sentinelLayerOptions;
          }
    
        } else {

          if (this.unresolvableServices)
            this.unresolvableServices = [];

            this.acquisitionDates = [];
          for (let i in featureCollection.features) {
           
            if (parseInt(i) < 1) {
              this.acquisitionDates.push(new Date(featureCollection.features[i]["properties"]['acquisitiondate']));
            }
            else {
              var tempValue = new Date(featureCollection.features[i]["properties"]['acquisitiondate']).toDateString();
              var tempCurrentValue = this.acquisitionDates[this.acquisitionDates.length - 1].toDateString();
              if (tempValue !== tempCurrentValue) {
                this.acquisitionDates.push(new Date(featureCollection.features[i]["properties"]['acquisitiondate']));
              }
            }
          }
          switch (side) {
            case 'le': {
              this.selLeftDate = this.acquisitionDates.filter((value, p, self) => self.indexOf(value) === p);
              break;
            }
            case 'ri': {
              this.selRightDate = this.acquisitionDates.filter((value, p, self) => self.indexOf(value) === p);
              break;
            }
          }
        }
      });
  }

  public checkLeftLayer(layerName: string, id: number) {
    this.selectLeftLayer = layerName;
    this.selectedIdL = id;
    // this._leftLayer = this.senLayers[id];
    this._leftLayer = this.comparisonBaseLayers[id];
    console.log('Name: ' + layerName + ' Layer: ' + this._leftLayer + ' index:' + id);
    if (this._leftLayer.options.pane == 'imagePane' + id) {
      this.queryLayer('le');
    }
  }

  public checkRightLayer(layerName: string, id: number) {
    this.selectRightLayer = layerName;
    this.selectedIdR = id;
    this._rightLayer = this.comparisonBaseLayers[id];
    console.log('Name: ' + layerName + ' Layer: ' + this._rightLayer + ' index:' + id);
    if (this._rightLayer.options.pane == 'imagePane' + id) {
      this.queryLayer('ri');
    }
  }

  private checkLeftDate(date: Date, id: number) {
    this.defaultLDate = date;
    let to = new Date(date.getFullYear(), date.getMonth() + 1);
    if (this._leftLayer instanceof esri.ImageMapLayer) {
      this._leftLayer.setTimeRange(date, to);
    }
  }

  private checkRightDate(date: Date, id: number) {
    this.defaultRDate = date;
    let to = new Date(date.getFullYear(), date.getMonth() + 1);
    if (this._rightLayer instanceof esri.ImageMapLayer) {
      this._rightLayer = esri.imageMapLayer({
        url: 'https://sentinel.arcgis.com/arcgis/rest/services/Sentinel2/ImageServer', maxZoom: 16, alt: sentinelLayerOptions[this.selectedIdR].toString(), renderingRule: rasterFunctionOpt[this.selectedIdR], position: 'pane', pane: 'imagePane' + this.selectedIdR + 1, opacity: 0.8
      });
      this._rightLayer.authenticate(this.tokenService.getToken());
      this._rightLayer.setTimeRange(date, to);
    }
  }

  public resetSelection() {
    this.selectLeftLayer = 'Layer im linken Bereich';
    this.selectRightLayer = 'Layer im rechten Bereich';
    this.defaultLDate = new Date(2019, 1);
    this.defaultRDate = new Date(2018, 1);
  }

  public changeLeftLayer(layerName: string, id: number) {
    if (this.view === 'split') {
      this.remove();
      this.checkLeftLayer(layerName, id);
      this.leftLayer = this._leftLayer;
      if (this._leftLayer instanceof esri.ImageMapLayer) {
        this._leftLayer.setTimeRange(this.defaultLDate, new Date(this.defaultLDate.getFullYear(), this.defaultLDate.getMonth(), this.defaultLDate.getDate() + 5));
      }
      this.setSplittedMap();
    }
    else {
      this.removeSync();
      this.checkLeftLayer(layerName, id);
      this.leftLayer = this._leftLayer;
      if (this._leftLayer instanceof esri.ImageMapLayer) {
        this._leftLayer.setTimeRange(this.defaultLDate, new Date(this.defaultLDate.getFullYear(), this.defaultLDate.getMonth(), this.defaultLDate.getDate() + 5));
      }
      this.setsyncedMap();
    }
  }

  public changeRightLayer(layerName: string, id: number) {
    if (this.view === 'split') {
      this.remove();
      this.checkRightLayer(layerName, id);
      this.rightLayer = this._rightLayer;
      if (this.rightLayer instanceof esri.ImageMapLayer) {
        this.rightLayer = esri.imageMapLayer({
          url: 'https://sentinel.arcgis.com/arcgis/rest/services/Sentinel2/ImageServer', maxZoom: 16, alt: sentinelLayerOptions[id].toString(), renderingRule: rasterFunctionOpt[id], position: 'pane', pane: 'imagePane' + id + 1, opacity: 0.8
        });
        this.rightLayer.authenticate(this.tokenService.getToken());
        this.rightLayer.setTimeRange(this.defaultRDate, new Date(this.defaultRDate.getFullYear(), this.defaultRDate.getMonth(), this.defaultRDate.getDate() + 5));
      }
      this.setSplittedMap();
    }
    else {
      this.removeSync();
      this.checkRightLayer(layerName, id);
      this.rightLayer = this._rightLayer;
      if (this.rightLayer instanceof esri.ImageMapLayer) {
        this.rightLayer = esri.imageMapLayer({
          url: 'https://sentinel.arcgis.com/arcgis/rest/services/Sentinel2/ImageServer', maxZoom: 16, alt: sentinelLayerOptions[id].toString(), renderingRule: rasterFunctionOpt[id], position: 'pane', pane: 'imagePane' + id + 1, opacity: 0.8
        });
        this.rightLayer.authenticate(this.tokenService.getToken());
        this.rightLayer.setTimeRange(this.defaultRDate, new Date(this.defaultRDate.getFullYear(), this.defaultRDate.getMonth(), this.defaultRDate.getDate() + 5));
      }
      this.setsyncedMap();
    }
  }

  private changeLeftDate(date: Date, id: number) {
    this.defaultLDate = date;
    let to = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    if (this.leftLayer instanceof esri.ImageMapLayer) {
      this.leftLayer.setTimeRange(date, to);
    }
  }

  private changeRightDate(date: Date, id: number) {
    this.defaultRDate = date;
    let to = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    if (this.rightLayer instanceof esri.ImageMapLayer) {
      this.rightLayer.setTimeRange(date, to);
    }
  }
}
