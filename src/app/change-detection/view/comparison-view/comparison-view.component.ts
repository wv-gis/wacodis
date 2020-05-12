declare var require;
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MapCache, GeoSearchOptions } from '@helgoland/map';
import * as L from 'leaflet';
import * as esri from "esri-leaflet";
import { RequestTokenService } from 'src/app/services/request-token.service';
import { Location } from '@angular/common';
require('leaflet.sync');
import Plotly from 'plotly.js-dist';
import { legendParam } from 'src/app/map/legend/extended/extended-ol-layer-legend-url/extended-ol-layer-legend-url.component';

const sentinelLayerOptions = ['Natural Color', 'Color Infrared'];
const externLayerOptions = ['IntraChange'];
const rasterFunctionOpt = [{ "rasterFunction": "Natural Color" }, { "rasterFunction": "Color Infrared with DRA" }];//, { "rasterFunction": "Landcover" }
const wacodisUrl = "https://gis.wacodis.demo.52north.org:6443/arcgis/rest/services/WaCoDiS";



@Component({
  selector: 'wv-comparison-view',
  templateUrl: './comparison-view.component.html',
  styleUrls: ['./comparison-view.component.css']
})
export class ComparisonViewComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild("pixelValue", { static: true }) public plotlydiv: ElementRef;

  public syncedMap: L.Map;
  public container: HTMLElement;
  public zoomControlOptions: L.Control.ZoomOptions = { position: 'topleft' };
  public layerControlOptions: L.Control.LayersOptions = { position: 'bottomleft' };
  public mapOptions: L.MapOptions = { dragging: true, zoomControl: true, boxZoom: false };
  public fitBounds: L.LatLngBoundsExpression = [[50.985, 6.924], [51.319, 7.607]];;
  public searchOptions: GeoSearchOptions = { countrycodes: [] };
  public avoidZoomToSelection = false;
  public mapWasDragEnabled: boolean;
  public mapWasTapEnabled: boolean;
  public range: any;
  public _map: L.Map;
  public divider: any;
  public dividerSym: HTMLElement;
  public leftLayer: (L.TileLayer | esri.ImageMapLayer);
  public rightLayer: (L.TileLayer | esri.ImageMapLayer);
  public view: string;
  public controlLegend: any;
  public controlHtml: HTMLElement;
  public legend: HTMLElement;
  public wmsLayer: L.TileLayer;
  public abkLayer: any;
  public mainMap: L.Map;
  public mapId = 'comparisonMap';
  public legendUrls: legendParam[];

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
  public defaultLDate: Date = new Date();
  public defaultRDate: Date = new Date();
  public display = 'visible';
  public unresolvableServices: string[] = [];
  public acquisitionDates = [];
  public refreshInterval = '';
  public isDisabledR = true;
  public isDisabledL = true;
  public wacodisMeta = [];
  public loadingL: boolean = false;
  public loadingR: boolean = false;



  constructor(private mapCache: MapCache, private tokenService: RequestTokenService, private _location: Location) {

  }

  ngOnInit(): void {

    for (let i = 0; i < sentinelLayerOptions.length; i++) {
      this.comparisonOptions.push(sentinelLayerOptions[i]);
    }
    this.comparisonOptions.push(externLayerOptions[0]);
    esri.imageMapLayer({ url: wacodisUrl }).metadata((error, metadata) => {
      metadata["services"].forEach(element => {
        this.wacodisMeta.push(element);
        this.comparisonOptions.push(element["name"].split("/")[1]);
      });
      this.setSentinelLayer('https://sentinel.arcgis.com/arcgis/rest/services/Sentinel2/ImageServer');
    });

    let toDate = new Date().getTime();
    this.wmsLayer = L.tileLayer.wms('http://ows.terrestris.de/osm/service?',
      {
        layers: 'OSM-WMS', format: 'image/png', transparent: true, maxZoom: 16, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        className: 'OSM'
      });

    // this.abkLayer= L.tileLayer.wms('https://www.wms.nrw.de/geobasis/wms_nw_dgk5?', {
    //   layers: 'WMS_NW_DGK5', format: 'image/png', transparent: true, maxZoom: 16, 
    //   attribution: '&copy; <a href="https://www.bezreg-koeln.nrw.de/brk_internet/geobasis/webdienste/geodatendienste/index.html">Bezreg-Koeln</a>', className: 'abk'
    // });
    this.mainMap = L.map('main', this.mapOptions).setView([51.161, 7.482], 10);

    this.mainMap.addLayer(this.wmsLayer);
    L.control.scale().addTo(this.mainMap);

  }

  ngAfterViewInit(): void {
    this.controlLegend = new L.Control({ position: 'topleft' });
    // L.DomEvent.on(this.controlHtml,'click', this.changeVisibility(this.legend));
  }

  public requestLegendUrl() {
    this.comparisonBaseLayers.forEach((lay, i, layArr) => {
      if (this.leftLayer instanceof esri.ImageMapLayer) {
        if (this.leftLayer.options.alt == lay.options.alt)
          esri.imageMapLayer({ url: layArr[i].options.url }).metadata((error, metadata) => {

            let legendurl = layArr[i].options.url + "/legend?bandIds=&renderingRule=rasterfunction:" + metadata["rasterFunctionInfos"][0].name + "&f=pjson";
            let legendResp: legendParam[] = [];
            esri.imageMapLayer({ url: legendurl }).metadata((error, legendData) => {
              legendData["layers"][0].legend.forEach((dat, i, arr) => {
                if (i < 25)
                  legendResp.push({ url: "data:image/png;base64," + arr[i].imageData, label: arr[i].label ,layer:metadata["description"] });
              });
              this.controlLegend.onAdd = function (map) {
                this.controlHtml = L.DomUtil.create('div');

                this.controlHtml.innerHTML = '<img src=' + legendResp + ' alt="Legende">';
                return this.controlHtml;
              };
            });
          });
      }
    });
  }

  /**
   * Method which decides which View is depicted depending on the selected parameters
   */
  public submitSelection() {

    this.leftLayer = this._leftLayer;
    this.rightLayer = this._rightLayer;

    if (document.forms[0]["selectedForm"][0].selected) {

      this.view = document.forms[0]["selectedForm"][0].value;
      this.setSplittedMap();
    }
    else if (document.forms[0]["selectedForm"][1].selected) {
      this.view = document.forms[0]["selectedForm"][1].value;
      this.mainMap.remove();
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
    // this._map = this.mapCache.getMap('comparisonMap');
    if (!this.mainMap) {
      this.mainMap = L.map('main', this.mapOptions).setView([51.161, 7.482], 10);
      this.mainMap.addLayer(this.wmsLayer);
    }

    // if(!this._map.getPane('imagePane')){
    if (this.rightLayer.options.pane === 'imagePane' + this.selectedIdR + 1) {
      // this._map.createPane('imagePane' + this.selectedIdR + 1);
      this.mainMap.createPane('imagePane' + this.selectedIdR + 1);
    }
    else if (this.rightLayer.options.pane === 'overlayPane' + this.selectedIdR + 1) {
      // this._map.createPane('overlayPane'+1);
      this.mainMap.createPane('overlayPane' + this.selectedIdR + 1);
    }
    if (this.leftLayer.options.pane === 'imagePane' + this.selectedIdL) {
      // this._map.createPane('imagePane' + this.selectedIdL);
      this.mainMap.createPane('imagePane' + this.selectedIdL);
    }
    else if (this.leftLayer.options.pane === 'overlayPane' + this.selectedIdL) {
      // this._map.createPane('overlayPane'+1);
      // this.mainMap.createPane('overlayPane' + 1);
      this.mainMap.createPane('overlayPane' + this.selectedIdL);
    }
    // }

    // this._map.addLayer(this.leftLayer);
    // this._map.addLayer(this.rightLayer);

    this.mainMap.addLayer(this.leftLayer);
    this.mainMap.addLayer(this.rightLayer);

    // this.container = L.DomUtil.create('div', 'leaflet-sbs', this._map.getContainer().children['1']);
    this.container = L.DomUtil.create('div', 'leaflet-sbs', this.mainMap.getContainer().children['1']);
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
    // this.mapCache.getMap('comparisonMap').addControl(this.divider);
    // this.mapCache.getMap('comparisonMap').addControl(this.range);
    this.mainMap.addControl(this.divider);
    this.mainMap.addControl(this.range);
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
    // let map = this._map;
    let map = this.mainMap;

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
      else if (this.leftLayer.options.pane === 'overlayPane' + this.selectedIdL) {
        document.getElementsByClassName('leaflet-pane leaflet-overlay' + this.selectedIdL + '-pane')[0].setAttribute('style', 'clip: ' + clipLeft);
      }
      else {
        let tileLayerPaneL = document.getElementsByClassName('leaflet-pane leaflet-overlay-pane') as HTMLCollectionOf<HTMLElement>;
        tileLayerPaneL[0].setAttribute('style', 'clip: ' + clipLeft);
      }
    }

    if (this.rightLayer) {
      // this.rightLayer.bringToFront();
      if (this.rightLayer.options.pane === 'imagePane' + this.selectedIdR + 1) {
        document.getElementsByClassName('leaflet-pane leaflet-image' + this.selectedIdR + 1 + '-pane')[0].setAttribute('style', 'clip: ' + clipRight);

      }
      else if (this.rightLayer.options.pane === 'overlayPane' + this.selectedIdR + 1) {
        document.getElementsByClassName('leaflet-pane leaflet-overlay' + this.selectedIdR + 1 + '-pane')[0].setAttribute('style', 'clip: ' + clipRight);
      }
      else {

        let tileLayerPaneR = document.getElementsByClassName('leaflet-pane leaflet-overlay-pane') as HTMLCollectionOf<HTMLElement>;
        tileLayerPaneR[0].setAttribute('style', 'clip: ' + clipRight);

      }
      // this.mapCache.getMap('comparisonMap').invalidateSize();

    }
    this.mainMap.invalidateSize();
  }
  /*
  change the view from splitted view to synced view or vice versa
  */
  public changeView() {
    if (this.view === 'split') {
      Plotly.purge(this.plotlydiv.nativeElement);
      this.rightLayer.unbindPopup();
      this.remove();
      // this.mainMap.remove();
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
    // let map = this._map;
    let map = this.mainMap;
    if (!map || !_range) {
      console.error('No map or range');
      return this;
    }
    L.DomEvent.on(this.range._container, this.getRangeEvent(this.range._container), this.addSplitScreenNew, this);
    map.on('move', this.addSplitScreenNew, this);
    map.on('zoom', this.addSplitScreenNew, this);
    L.DomEvent.on(this.range._container, 'mouseover', this.cancelMapDrag, this);
    L.DomEvent.on(this.range._container, 'mouseout', this.uncancelMapDrag, this);
    map.on('click', this.identifyPixel,this);
  }


  public identifyPixel(e) {
    let pane = document.getElementById("pixelValue");
   
      let identifiedPixel;
      let dateVal: { date: Date, value: number }[] = [];
      let dates: Date[] = [];
      let values: number[] = [];
      let plotPane = this.plotlydiv.nativeElement;

      if (this.rightLayer instanceof esri.ImageMapLayer) {
        this.rightLayer.bindPopup(function (error, identifyResults, response) {
          if (error) {
            console.error(error);
            return;
          }
          pane.innerHTML = '';
          identifiedPixel = identifyResults.pixel.properties.values.reverse();
          identifyResults.catalogItems.features.forEach((f, i, arr) => {
            dateVal.push({ date: new Date(f.properties.startTime), value: identifiedPixel[i] });
          });
          dateVal.sort(function (a, b) { return a.date.getTime() - b.date.getTime(); });
          dateVal.forEach((v, i, arr) => {
            dates.push(v.date);
            values.push(v.value);
          });

          let data = {
            x: dates,
            y: values,
            mode: 'lines+markers',
            type: 'scatter'
          };
          let layout = {
            title: "Pixelverlauf",
            yaxis: {
              title: 'Pixelwert',
              showline: true,
            },
            xaxis: { showline: true },
            height: 390,
          };
          let config = {
            toImageButtonOptions: {
              format: 'png'
            },
            responsive: true,
            displaylogo: false,
            modeBarButtonsToRemove: ['select2d', 'lasso2d', 'hoverClosestCartesian',
              'hoverCompareCartesian', 'toggleSpikelines', 'pan2d', 'zoomOut2d', 'zoomIn2d', 'autoScale2d', 'resetScale2d'],
          };
           Plotly.newPlot(plotPane, [data], layout, config);
        });
      
    }
  }
  /**
   * cancel Map Drag if the slider is in use
   */
  private cancelMapDrag(e) {
    this.mapWasDragEnabled = this.mainMap.dragging.enabled()
    if (this.mainMap.tap && this.mainMap.tap.enabled()) {
      this.mapWasTapEnabled = true;
      this.mainMap.tap.disable();
    }
    else {
      this.mapWasTapEnabled = false
    }
    this.mainMap.dragging.disable();
  }
  /**
   * uncancel Map drag when slider is out of use
   * @param e event
   */
  private uncancelMapDrag(e) {

    if (this.mapWasDragEnabled) {
      this.mainMap.dragging.enable()
    }
    if (this.mapWasTapEnabled) {
      this.mainMap.tap.enable()
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
    // let map = this._map;
    let map = this.mainMap;
    if (_range) {
      L.DomEvent.off(this.range._container, this.getRangeEvent(this.range._container), this.addSplitScreenNew, this);
      L.DomEvent.off(this.range._container, 'mouseover', this.cancelMapDrag, this);
      L.DomEvent.off(this.range._container, 'mouseout', this.uncancelMapDrag, this);
    }
    if (map) {
     
      map.off('layeradd layerremove', this.updateLayers, this);
      map.off('zoom', this.addSplitScreenNew, this);
      map.off('move', this.addSplitScreenNew, this);
      map.off('click', this.identifyPixel, this);
    }
  }

  /**
   * set new Layers to the splitted view and create the splitted view
   */
  private updateLayers() {
    // if (!this._map) {
    //   return this;
    // }
    if (!this.mainMap) {
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
    // if (!this._map) {
    //   return this;
    // }
    if (!this.mainMap) {
      return this;
    }
    if (this.leftLayer) {

      if (this.leftLayer.options.pane === 'imagePane' + this.selectedIdL) {
        // this._map.getPane('imagePane' + this.selectedIdL).remove();
        this.mainMap.getPane('imagePane' + this.selectedIdL).remove();
      }
      else if (this.leftLayer.options.pane === 'overlayPane' + this.selectedIdL) {
        // this._map.getPane('overlayPane' + 1).remove();
        this.mainMap.getPane('overlayPane' + this.selectedIdL).remove();
        let tileLayerPane = document.getElementsByClassName('leaflet-pane leaflet-overlay' + this.selectedIdL + '-pane') as HTMLCollectionOf<HTMLElement>;
        for (let element in tileLayerPane => {
          this.mainMap.getPane(element).remove();
        });
      }
      else {
        let tileLayerPane = document.getElementsByClassName('leaflet-pane leaflet-overlay-pane') as HTMLCollectionOf<HTMLElement>;
        tileLayerPane[0].removeAttribute('style');

      }
      // this._map.removeLayer(this.leftLayer);
      this.mainMap.removeLayer(this.leftLayer);
    }
    if (this.rightLayer) {

      if (this.rightLayer.options.pane === 'imagePane' + this.selectedIdR + 1) {
        // this._map.getPane('imagePane' + this.selectedIdR + 1).remove();
        this.mainMap.getPane('imagePane' + this.selectedIdR + 1).remove();
      }
      else if (this.rightLayer.options.pane === 'overlayPane' + this.selectedIdR + 1) {
        // this._map.getPane('overlayPane' + 1).remove();
        this.mainMap.getPane('overlayPane' + this.selectedIdR + 1).remove();
        let tileLayerPane = document.getElementsByClassName('leaflet-pane leaflet-overlay' + this.selectedIdR + 1 + '-pane') as HTMLCollectionOf<HTMLElement>;
        // this.mainMap.getPane(tileLayerPane[0]).remove();
        for (let element in tileLayerPane => {
          this.mainMap.getPane(element).remove();
        });
      }
      else {
        let tileLayerPane = document.getElementsByClassName('leaflet-pane leaflet-overlay-pane') as HTMLCollectionOf<HTMLElement>;
        tileLayerPane[0].removeAttribute('style');

      }
      // this._map.removeLayer(this.rightLayer);
      this.mainMap.removeLayer(this.rightLayer);
    }
    this.removeEvents();
    L.DomUtil.remove(this.container);

    // this._map = null;
    // this.mainMap.remove();
    // this.mainMap = null;
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

    // this.compMap = this.mapCache.getMap('comparisonMap');
    // this.compMap = this.mainMap;
    this.syncedMap = L.map(newMap).setView([51.161, 7.482], 13);
    if (!this.mainMap.hasLayer(this.wmsLayer)) {
     
      this.mainMap = L.map('main').setView([51.161, 7.482], 13);
      // this.mapCache.getMap('comparisonMap').setView([51.161, 7.482], 13);
      this.mainMap.addLayer(this.wmsLayer);
    }
    L.tileLayer.wms('http://ows.terrestris.de/osm/service?',
      {
        layers: 'OSM-WMS', format: 'image/png', transparent: true, maxZoom: 16, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        className: 'OSM'
      }).addTo(this.syncedMap);
    // this.mapCache.setMap('map2', this.syncedMap);

    if (this.rightLayer.options.pane === 'imagePane' + this.selectedIdR + 1) {
      this.syncedMap.createPane('imagePane' + this.selectedIdR + 1)
    } else if (this.rightLayer.options.pane === 'overlayPane' + this.selectedIdR + 1) {
      this.syncedMap.createPane('overlayPane' + this.selectedIdR + 1);
    }
    if (this.leftLayer.options.pane === 'imagePane' + this.selectedIdL) {
      // this.mapCache.getMap('comparisonMap').createPane('imagePane' + this.selectedIdL);
      this.mainMap.createPane('imagePane' + this.selectedIdL);
    
    } else if (this.leftLayer.options.pane === 'overlayPane' + this.selectedIdL) {
      // this.mapCache.getMap('comparisonMap').createPane('overlayPane' + 1);
      this.mainMap.createPane('overlayPane' + this.selectedIdL);
    }

    // this.mapCache.getMap('map2').addControl(this.controlLegend);
    this.syncedMap.addLayer(this.rightLayer);
    // this.mapCache.getMap('comparisonMap').addLayer(this.leftLayer);
    this.mainMap.addLayer(this.leftLayer);
    // this.compMap.sync(this.syncedMap);
    this.mainMap.sync(this.syncedMap);
    // this.mapCache.getMap('comparisonMap').sync(this.syncedMap);
    // this.syncedMap.sync(this.mapCache.getMap('comparisonMap'));
    this.syncedMap.sync(this.mainMap);
    // this.mapCache.getMap('comparisonMap').invalidateSize();
    this.mainMap.invalidateSize();
    this.syncedMap.invalidateSize();
  }

  private removeSync() {
    // this.mapCache.getMap('comparisonMap').unsync(this.syncedMap);
    // if (!this.syncedMap || !this.mapCache.getMap('comparisonMap')) {
    //   return this;
    // }
    if (!this.syncedMap || !this.mainMap) {
      return this;
    }
    // this.compMap.unsync(this.syncedMap);
    this.mainMap.unsync(this.syncedMap);
    // this.syncedMap.unsync(this.mapCache.getMap('comparisonMap'));
    this.syncedMap.unsync(this.mainMap);

    this.syncedMap.removeLayer(this.rightLayer);
    document.getElementById('map2').remove();
    document.getElementById('main').style.width = '100%';
    // this.mapCache.getMap('comparisonMap').removeLayer(this.leftLayer);
    this.mainMap.removeLayer(this.leftLayer);

    if (this.leftLayer.options.pane === 'imagePane' + this.selectedIdL) {
      // this.mapCache.getMap('comparisonMap').getPane('imagePane' + this.selectedIdL).remove();
      this.mainMap.getPane('imagePane' + this.selectedIdL).remove();
    } else {
      this.mainMap.getPane('overlayPane' + this.selectedIdL).remove();
    }
    // this.mapCache.getMap('comparisonMap').invalidateSize();
    this.mainMap.invalidateSize();
    this.syncedMap = null;
  }
  public onCloseHandled() {
    this._location.back();
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

        for (let k = 0; k < this.senLayers.length; k++) {
          this.senLayers[k].authenticate(this.token);
          this.senLayers[k].setOpacity(0.8);
          this.comparisonBaseLayers.push(this.senLayers[k]);
        }


        this.comparisonBaseLayers.push(L.imageOverlay('https://wacodis.maps.arcgis.com/sharing/rest/content/items/b2fa6b41d64c4a649f4bd6f75e0f5d74/data',
          [[50.9854181, 6.9313883], [51.3190536, 7.6071338]], {
          opacity: 0.8, pane: 'overlayPane', alt: 'IntraChange'
        }));

        this.wacodisMeta.forEach((element) => {
          this.comparisonBaseLayers.push(esri.imageMapLayer({
            url: wacodisUrl + "/" + element["name"].split("/")[1] + "/" + element["type"],
            maxZoom: 16, opacity: 0.8, alt: element["name"].split("/")[1], pane: 'overlayPane' + this.comparisonBaseLayers.length
          }));
        });
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
      this.wacodisMeta.forEach((element, i) => {
        this.comparisonBaseLayers.push(esri.imageMapLayer({
          url: wacodisUrl + "/" + element["name"].split("/")[1] + "/" + element["type"],
          maxZoom: 16, opacity: 0.8, alt: element["name"].split("/")[1], pane: 'overlayPane' + this.comparisonBaseLayers.length
        }));
      });
      this.comparisonBaseLayers.push(L.imageOverlay('https://wacodis.maps.arcgis.com/sharing/rest/content/items/b2fa6b41d64c4a649f4bd6f75e0f5d74/data',
        [[50.9854181, 6.9313883], [51.3190536, 7.6071338]], {
        opacity: 0.8, pane: 'overlayPane', alt: 'IntraChange'
      }));



    }
  }
  private queryImagelayer(side: string, id: number) {
    esri.imageService({ url: this.comparisonBaseLayers[id].options.url }).query().where("1=1")
      .fields(["startTime", "endTime", "OBJECTID"]).returnGeometry(false).run((error, featureCollection, feature) => {
        this.acquisitionDates = [];
        if (feature != null) {
          if (side === "ri") {
            this.loadingR = !this.loadingR;
          } else {
            this.loadingL = !this.loadingL;
          }

          feature["features"].forEach((element, i, arr) => {
            this.acquisitionDates.push(new Date(arr[i]["attributes"].startTime));
          });
          switch (side) {
            case 'le': {
              this.defaultLDate = this.acquisitionDates[this.acquisitionDates.length - 1];
              this.selLeftDate = this.acquisitionDates.filter((value, p, self) => self.indexOf(value) === p);
              if (this.isDisabledL) {
                this.isDisabledL = !this.isDisabledL;
                this.loadingL = !this.loadingL;
              }
              break;
            }
            case 'ri': {
              this.defaultRDate = this.acquisitionDates[this.acquisitionDates.length - 1];
              this.selRightDate = this.acquisitionDates.filter((value, p, self) => self.indexOf(value) === p);
              if (this.isDisabledR) {
                this.isDisabledR = !this.isDisabledR;
                this.loadingR = !this.loadingR;
              }
              break;
            }
          }
        } else {
          switch (side) {
            case 'le': {
              if (!this.isDisabledL) {
                this.isDisabledL = !this.isDisabledL;
              }

            }
            case 'ri': {
              if (!this.isDisabledR) {
                this.isDisabledR = !this.isDisabledR;
              }

            }
          }

        }

      }, (error) => console.log('Error on Image Service request: ' + error));

  }

  private queryLayer(side: string) {
    if (side === "ri") {
      this.loadingR = !this.loadingR;
    } else {
      this.loadingL = !this.loadingL;
    }
    if (!this.tokenService.getToken()) {
      this.tokenService.requestToken().subscribe((res) => {
        this.imageAccess = res;
        this.token = this.imageAccess['access_token'];
      });
    }
    else {
      this.token = this.tokenService.getToken();
    }
    esri.imageService({ url: 'https://sentinel.arcgis.com/arcgis/rest/services/Sentinel2/ImageServer' }).query()
      .contains(L.latLngBounds([50.9952, 6.931481], [51.309139, 7.607089])).where(" cloudcover<=0.4 AND category=1")
      .fields(['acquisitiondate', 'cloudcover', 'q', 'best', 'groupname']).orderBy('acquisitiondate', 'ASC')
      .token(this.token).returnGeometry(false)
      .run((error, featureCollection, feature) => {
        if (error) {
          console.log('Error ' + JSON.stringify(error) + ' Service not available');
          if (error.code === 499 && error.message === 'Token Required') {
            console.log('Token Required');
          }
          else {
            this.unresolvableServices = sentinelLayerOptions;
          }
        } else {

          if (this.unresolvableServices)
            this.unresolvableServices = [];

          this.acquisitionDates = [];

          for (let i in featureCollection.features) {
            if (parseInt(i) < 1 && parseInt(i) >= 0) {
              this.acquisitionDates.push(featureCollection.features[i]["properties"]['acquisitiondate']);
            }
            else {
              var tempValue = featureCollection.features[i]["properties"]['acquisitiondate'];
              var tempCurrentValue = this.acquisitionDates[0];
              if (tempValue !== tempCurrentValue) {
                this.acquisitionDates.push(featureCollection.features[i]["properties"]['acquisitiondate']);
                // console.log(this.acquisitionDates);
              }
            }
          }
          switch (side) {
            case 'le': {
              this.defaultLDate = tempCurrentValue;
              this.selLeftDate = this.acquisitionDates.filter((value, p, self) => self.indexOf(value) === p);
              if (this.isDisabledL) {
                this.isDisabledL = !this.isDisabledL;
                this.loadingL = !this.loadingL;
              }
              break;
            }
            case 'ri': {
              this.defaultRDate = tempCurrentValue;
              this.selRightDate = this.acquisitionDates.filter((value, p, self) => self.indexOf(value) === p);
              if (this.isDisabledR) {
                this.isDisabledR = !this.isDisabledR;
                this.loadingR = !this.loadingR;
              }
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
    // console.log('Name: ' + layerName + ' Layer: ' + this._leftLayer + ' index:' + id);
    if (this._leftLayer.options.pane == 'imagePane' + id) {
      this.queryLayer('le');
    } else if (this._leftLayer.options.pane == 'overlayPane' + id) {
      this.queryImagelayer('le', id);
    }
  }

  public checkRightLayer(layerName: string, id: number) {

    this.selectRightLayer = layerName;
    this.selectedIdR = id;
    this._rightLayer = this.comparisonBaseLayers[id];
    // console.log('Name: ' + layerName + ' Layer: ' + this._rightLayer + ' index:' + id );
    if (this._rightLayer.options.pane == 'imagePane' + id) {
      this._rightLayer = esri.imageMapLayer({
        url: this.comparisonBaseLayers[id].options.url, maxZoom: 16, alt: sentinelLayerOptions[id].toString(),
        renderingRule: rasterFunctionOpt[id], position: 'pane', pane: 'imagePane' + id + 1, opacity: 0.8
      });
      this._rightLayer.authenticate(this.tokenService.getToken());
      this.queryLayer('ri');
    } else if (this._rightLayer.options.pane == 'overlayPane' + id) {
      this._rightLayer = esri.imageMapLayer({
        url: this.comparisonBaseLayers[id].options.url, maxZoom: 16, alt: this.comparisonBaseLayers[id].options.alt,
        position: 'pane', pane: 'overlayPane' + id + 1, opacity: 0.8
      });
      this.queryImagelayer('ri', id);
    }
  }

  private checkLeftDate(date: number, id: number) {
    this.defaultLDate = new Date(date);
    let to = new Date(this.defaultLDate.getFullYear(), this.defaultLDate.getMonth() + 1);
    if (this._leftLayer.options.pane.startsWith('imagePane') && this._leftLayer instanceof esri.ImageMapLayer) {
      this._leftLayer.authenticate(this.tokenService.getToken());
      this._leftLayer.setOpacity(0.8);
      this._leftLayer.setTimeRange(this.defaultLDate, this.defaultLDate);
    }
    else if (this._leftLayer.options.pane.startsWith('overlayPane') && this._leftLayer instanceof esri.ImageMapLayer) {
      this._leftLayer.setOpacity(0.8);
      this._leftLayer.setTimeRange(new Date(new Date(this.defaultLDate.getFullYear(), this.defaultLDate.getMonth(), this.defaultLDate.getDate() + 2).getTime() - 2628000000),
        new Date(this.defaultLDate.getFullYear(), this.defaultLDate.getMonth(), this.defaultLDate.getDate() + 2));
    }
  }

  private checkRightDate(date: number, id: number) {
    this.defaultRDate = new Date(date);
    let to = new Date(this.defaultRDate.getFullYear(), this.defaultRDate.getMonth() + 1);

    if (this._rightLayer.options.pane.startsWith('imagePane') && this._rightLayer instanceof esri.ImageMapLayer) {

      this._rightLayer.authenticate(this.tokenService.getToken());
      this._rightLayer.setOpacity(0.8);
      this._rightLayer.setTimeRange(this.defaultRDate, this.defaultRDate);
    }
    else if (this._rightLayer.options.pane.startsWith('overlayPane') && this._rightLayer instanceof esri.ImageMapLayer) {
      this._rightLayer.setOpacity(0.8);
      this._rightLayer.setTimeRange(new Date(new Date(this.defaultRDate.getFullYear(), this.defaultRDate.getMonth(), this.defaultRDate.getDate() + 2).getTime() - 2628000000),
        new Date(this.defaultRDate.getFullYear(), this.defaultRDate.getMonth(), this.defaultRDate.getDate() + 2));
    }
  }

  public resetSelection() {
    this.selectLeftLayer = 'Layer im linken Bereich';
    this.selectRightLayer = 'Layer im rechten Bereich';
    this.defaultLDate = new Date();
    this.defaultRDate = new Date();
  }

  public changeLeftLayer(layerName: string, id: number) {
    if (this.view === 'split') {
      this.remove();
      this.checkLeftLayer(layerName, id);
      this.leftLayer = this._leftLayer;
      if (this.leftLayer instanceof esri.ImageMapLayer && this.leftLayer.options.pane === 'imagePane' + id) {
        this.leftLayer.authenticate(this.tokenService.getToken());
        this.leftLayer.setTimeRange(this.defaultLDate, this.defaultLDate);
      } else if (this.leftLayer instanceof esri.ImageMapLayer && this.leftLayer.options.pane === 'overlayPane' + id) {
        this.leftLayer.setTimeRange(new Date(new Date(this.defaultLDate.getFullYear(), this.defaultLDate.getMonth(), this.defaultLDate.getDate() + 2).getTime() - 2628000000),
          new Date(this.defaultLDate.getFullYear(), this.defaultLDate.getMonth(), this.defaultLDate.getDate() + 2));
      } else {
        if (!this.isDisabledL)
          this.isDisabledL = !this.isDisabledL;
      }
      this.setSplittedMap();
    }
    else {
      this.removeSync();
      this.checkLeftLayer(layerName, id);
      this.leftLayer = this._leftLayer;
      if (this.leftLayer instanceof esri.ImageMapLayer && this.leftLayer.options.pane === 'overlayPane' + id) {
        this.leftLayer.setTimeRange(new Date(new Date(this.defaultLDate.getFullYear(), this.defaultLDate.getMonth(), this.defaultLDate.getDate() + 2).getTime() - 2628000000),
          new Date(this.defaultLDate.getFullYear(), this.defaultLDate.getMonth(), this.defaultLDate.getDate() + 2));
      }
      else if (this.leftLayer instanceof esri.ImageMapLayer && this.leftLayer.options.pane === 'imagePane' + id) {
        this.leftLayer.authenticate(this.tokenService.getToken());
        this.leftLayer.setTimeRange(this.defaultLDate, this.defaultLDate);
      }
      else {
        if (!this.isDisabledL)
          this.isDisabledL = !this.isDisabledL;
      }
      this.setsyncedMap();
    }
  }

  public changeRightLayer(layerName: string, id: number) {
    if (this.view === 'split') {
      this.remove();
      this.checkRightLayer(layerName, id);
      this.rightLayer = this._rightLayer;
      if (this.rightLayer instanceof esri.ImageMapLayer && this.rightLayer.options.pane === 'imagePane' + id) {
        this.rightLayer.options.pane = 'imagePane' + id + 1;
        this.rightLayer.authenticate(this.tokenService.getToken());
        this.rightLayer.setOpacity(0.8);
        this.rightLayer.setTimeRange(this.defaultRDate, this.defaultRDate);
      }
      else if (this.rightLayer instanceof esri.ImageMapLayer && this.rightLayer.options.pane === 'overlayPane' + id) {
        this.rightLayer.options.pane = 'overlayPane' + id + 1;
        this.rightLayer.setOpacity(0.8);
        this.rightLayer.setTimeRange(new Date(new Date(this.defaultRDate.getFullYear(), this.defaultRDate.getMonth(), this.defaultRDate.getDate() + 2).getTime() - 2628000000),
          new Date(this.defaultRDate.getFullYear(), this.defaultRDate.getMonth(), this.defaultRDate.getDate() + 2));
      }
      else {
        if (this.isDisabledR)
          this.isDisabledR = !this.isDisabledR;
      }
      this.setSplittedMap();
    }
    else {
      this.removeSync();
      this.checkRightLayer(layerName, id);
      this.rightLayer = this._rightLayer;

      if (this.rightLayer.options.pane === 'imagePane' + id && this.rightLayer instanceof esri.ImageMapLayer) {
        this.rightLayer.options.pane = 'imagePane' + id + 1;
        this.rightLayer.authenticate(this.tokenService.getToken());
        this.rightLayer.setTimeRange(this.defaultRDate, this.defaultRDate);
      }
      else if (this.rightLayer.options.pane === 'overlayPane' + id && this.rightLayer instanceof esri.ImageMapLayer) {
        this.rightLayer.options.pane = 'overlayPane' + id + 1;
        this.rightLayer.setOpacity(0.8);
        this.rightLayer.setTimeRange(new Date(new Date(this.defaultRDate.getFullYear(), this.defaultRDate.getMonth(), this.defaultRDate.getDate() + 2).getTime() - 2628000000),
          new Date(this.defaultRDate.getFullYear(), this.defaultRDate.getMonth(), this.defaultRDate.getDate() + 2));
      } else {
        if (!this.isDisabledR)
          this.isDisabledR = !this.isDisabledR;
      }
      this.setsyncedMap();
    }
  }

  private changeLeftDate(date: number, id: number) {
    this.defaultLDate = new Date(date);
    let to = new Date(this.defaultLDate.getFullYear(), this.defaultLDate.getMonth(), this.defaultLDate.getDate() + 1);
    if (this.leftLayer instanceof esri.ImageMapLayer && this.leftLayer.options.pane.startsWith('overlayPane')) {
      this.leftLayer.setTimeRange(new Date(new Date(this.defaultLDate.getFullYear(), this.defaultLDate.getMonth(), this.defaultLDate.getDate() + 2).getTime() - 2628000000),
        new Date(this.defaultLDate.getFullYear(), this.defaultLDate.getMonth(), this.defaultLDate.getDate() + 2));
    }
    else if (this.leftLayer instanceof esri.ImageMapLayer && this.leftLayer.options.pane.startsWith('imagePane')) {
      this.leftLayer.authenticate(this.tokenService.getToken());
      this.leftLayer.setTimeRange(this.defaultLDate, this.defaultLDate);
    }
  }

  private changeRightDate(date: number, id: number) {
    this.defaultRDate = new Date(date);
    let to = new Date(this.defaultRDate.getFullYear(), this.defaultRDate.getMonth(), this.defaultRDate.getDate() + 1);
    if (this.rightLayer instanceof esri.ImageMapLayer && this.rightLayer.options.pane.startsWith('overlayPane')) {
      this.rightLayer.setTimeRange(new Date(new Date(this.defaultRDate.getFullYear(), this.defaultRDate.getMonth(), this.defaultRDate.getDate() + 2).getTime() - 2628000000),
        new Date(this.defaultRDate.getFullYear(), this.defaultRDate.getMonth(), this.defaultRDate.getDate() + 2));
    }
    else if (this.rightLayer instanceof esri.ImageMapLayer && this.rightLayer.options.pane.startsWith('imagePane')) {
      this.rightLayer.authenticate(this.tokenService.getToken());
      this.rightLayer.setTimeRange(this.defaultRDate, this.defaultRDate);
    }
  }
  public getLegendUrl(url?: string, urls?: string[]) {
    this.legendUrls = [{ url: url, label: "", layer: url.split('layer=')[1] }];
  }
  public getLegendUrls(urls: legendParam[]) {
    this.legendUrls = urls;
  }

  ngOnDestroy(): void {
    this.removeEvents();
  }
}
