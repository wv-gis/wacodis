import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, AfterViewInit, OnDestroy } from '@angular/core';
import { Service, DatasetApi, ParameterFilter, PlatformTypes, ValueTypes, SettingsService, Settings, DatasetApiInterface } from '@helgoland/core';
import { Router, NavigationExtras } from '@angular/router';
import { ExtendedSettingsService } from '../../settings/settings.service';
import { SelectedUrlService } from '../../services/selected-url.service';
import { MapCache } from '@helgoland/map';
import * as L from 'leaflet';
import { RestApiService } from '../../services/rest-api.service';
import * as esri from "esri-leaflet";
import { map } from 'rxjs/operator/map';
require('leaflet.sync');

const sentinelLayerOptions = ['Agriculture', 'Bathymetric', 'Color Infrared', 'Natural Color', 'Healthy Vegetation', 'None'];
const bandIdOptions = ['10,8,3', '4,3,1', '8,4,3', '4,3,2', '11,8,2', ''];
const rasterFunctionOpt = [{ "rasterFunction": "Agriculture with DRA" }, { "rasterFunction": "Bathymetric with DRA" }, { "rasterFunction": "Color Infrared with DRA" },
{ "rasterFunction": "Natural Color" }, { "rasterFunction": "Agriculture" }, { "rasterFunction": "None" }]
@Component({
  selector: 'wv-selection-menu',
  templateUrl: './selection-menu.component.html',
  styleUrls: ['./selection-menu.component.css'], providers: [SelectedUrlService]
})

export class SelectionMenuComponent implements AfterViewInit, OnDestroy, OnInit {


  public label = 'Wupperverband Zeitreihen Dienst';
  public senLabel = '';
  public active: boolean;
  public isFirst: boolean = true;
  public selectedService: Service;
  public endpoint: string;
  public clicked: boolean = false;
  public baseLayers = [];
  public selectLeftLayer: string = 'Left Layer';
  public selectRightLayer: string = "Right Layer";
  public controlLegend: L.Control;
  public container: HTMLElement;
  public divider: HTMLElement;
  public mapWasDragEnabled: boolean;
  public mapWasTapEnabled: boolean;
  public range;
  public datasetApis: DatasetApi[] = [];
  public dividerSym;
  public selectedIdL: number;
  public selectedIdR: number;
  public markerLayer: L.Marker;
  public token: string;
  public imageAccess: Object;
  public sentinelLayer: esri.ImageMapLayer;
  public senLayers: esri.ImageMapLayer[] = [];
  public oldLayer: esri.ImageMapLayer;

  constructor(private router: Router, private settings: ExtendedSettingsService, private datasetApiInt: DatasetApiInterface, private selService: SelectedUrlService, private mapCache: MapCache, private resApiService: RestApiService) {
    if (this.settings.getSettings().datasetApis) {
      for (let i = 0; i < this.settings.getSettings().datasetApis.length; i++) {
        this.datasetApis.push(this.settings.getSettings().datasetApis[i]);

      }
      if (this.isFirst) {
        this.isFirst = false;
        this.datasetApiInt.getServices(this.settings.getSettings().datasetApis[0].url).subscribe((service) => {
          this.selService.setService(service[0]);
          this.selectedService = service[0];
        });
      }
      else {
        this.selService.service$.subscribe((res) => {
          this.selectedService = res;
          this.selService.setService(res);
          this.datasetApiInt.getService(res.id, res.apiUrl).subscribe();
        });
      }

    }
    this._map = mapCache.getMap('map');
  }
  ngOnInit() {
    this.setSentinelLayer('https://sentinel.arcgis.com/arcgis/rest/services/Sentinel2/ImageServer');
  }
  ngAfterViewInit(): void {
    this.mapCache.getMap('map').eachLayer((layer) => {
      this.baseLayers.push(layer);

    });

  }

  public providerFilter: ParameterFilter = {
    platformTypes: PlatformTypes.stationary,
    valueTypes: ValueTypes.quantity
  };

  public switchProvider(service: Service) {

    this.selectedService = service;
    this.selService.setService(service);
    this.label = service.label;
  }

  navigateTo(url: string) {

    this.router.navigateByUrl(url);
  }

  checkSelection(route: string) {
    if (this.router.isActive(route, true)) {
      return true;

    }
    else {
      return false;
    }
  }

  setSentinelLayer(url: string) {
    for (let i = 0; i < sentinelLayerOptions.length; i++) {
      this.senLayers.push(esri.imageMapLayer({
        url: url, position: 'pane', maxZoom: 16, pane: 'imagePane' + i, alt: sentinelLayerOptions[i].toString()
      }));
    }


    if (!this.resApiService.getToken()) {
      this.resApiService.requestToken().subscribe((res) => {

        this.imageAccess = res;
        this.token = this.imageAccess['access_token'];
        for (let k = 0; k < this.senLayers.length; k++) {
          this.senLayers[k].authenticate(this.token);
          this.baseLayers.push(this.senLayers[k]);
        }

        this.resApiService.setToken(this.token);
      });
    }
    else {
      for (let k = 0; k < this.senLayers.length; k++) {
        this.senLayers[k].authenticate(this.resApiService.getToken());

      }

    }

  }
  selectSentinelLayer(senLayer: esri.ImageMapLayer, id: number) {
    let prevLayer = senLayer;
    this.senLabel = sentinelLayerOptions[id];
    // if (!this.mapCache.getMap('map').getPane('leaflet-pane leaflet-image'+id+'-pane')) {
    this.mapCache.getMap('map').createPane('imagePane' + id);
    // }

    if (this.oldLayer) {
      this.oldLayer.getPane().remove();

      this.mapCache.getMap('map').removeLayer(this.oldLayer);
      this.oldLayer = prevLayer;
    }
    else {
      this.oldLayer = prevLayer;
    }
    if (sentinelLayerOptions[id] !== 'None') {
      // this.senLayers[id].setBandIds(bandIdOptions[id]).addTo(this.mapCache.getMap('map'));
      console.log(rasterFunctionOpt[id]);
      this.senLayers[id].addTo(this.mapCache.getMap('map'));
      this.senLayers[id].setRenderingRule(rasterFunctionOpt[id]);
    }
    else {
      this.oldLayer = null;
    }

  }

  /**
   * methods for selecting the layers for comparing two views
   */
  public _rightLayer: (L.TileLayer | esri.ImageMapLayer);
  public _leftLayer: (L.TileLayer | esri.ImageMapLayer);
  public _map: L.Map;
  public syncedMap: L.Map;
  public wrapper: HTMLDivElement;
  public wrapperL: HTMLDivElement;

  checkLeftLayer(layerName: string, id: number) {

    this.selectLeftLayer = layerName;
    this.selectedIdL = id;
    this._leftLayer = this.baseLayers[id];
    this.updateLayers();

  }
  checkRightLayer(layerName: string, id: number) {

    this.selectRightLayer = layerName;
    this.selectedIdR = id;
    this._rightLayer = this.baseLayers[id];
    this.updateLayers();
  }

  updateLayers() {
    if (!this._map) {
      return this;
    }
    sentinelLayerOptions.forEach((name, index) => {
      if (name == this.selectLeftLayer || name == this.selectRightLayer) {
        if (!this._map.getPane('imagePane' + index)) {
          this._map.createPane('imagePane' + index);
        }

        if (this._map.hasLayer(this.senLayers[index])) {
          this.senLayers[index].getPane().remove();
          this._map.removeLayer(this.senLayers[index])
        }
        // else {
        // this.senLayers[index].setBandIds(bandIdOptions[index]).addTo(this._map);
        this.senLayers[index].addTo(this._map);
        this.senLayers[index].setRenderingRule(rasterFunctionOpt[index]);
        // }

      }
    });

    let prevLeft = this._leftLayer;
    let prevRight = this._rightLayer;
    this._leftLayer = this._rightLayer = null;

    if (this._map.hasLayer(this.baseLayers[this.selectedIdL])) {
      this._leftLayer = this.baseLayers[this.selectedIdL];
    }

    if (this._map.hasLayer(this.baseLayers[this.selectedIdR])) {
      this._rightLayer = this.baseLayers[this.selectedIdR];
    }

    if (prevLeft !== this._leftLayer) {
      prevLeft && this._map.fire('leftlayerremove', { layer: prevLeft })
      this._leftLayer && this._map.fire('leftlayeradd', { layer: this._leftLayer })
      // this._map.removeLayer(prevLeft);
      // this._map.addLayer(this._leftLayer);
    }
    if (prevRight !== this._rightLayer) {
      prevRight && this._map.fire('rightlayerremove', { layer: prevRight })
      this._rightLayer && this._map.fire('rightlayeradd', { layer: this._rightLayer })
      // this._map.removeLayer(prevRight);
      // this._map.addLayer(this._rightLayer);
    }
    this.addSplitScreen();
  }

  resetSelection() {
    this.selectLeftLayer = 'Left Layer';
    this.selectRightLayer = 'Right Layer';
  }

  createRange() {
    this.container = L.DomUtil.create('div', 'leaflet-sbs', this._map.getContainer().children['1']);
    //set divider
    this.divider = L.DomUtil.create('div', 'leaflet-sps-divider', this.container)
    this.divider.style.height = '100%';
    this.divider.style.position = 'absolute';
    this.divider.style.backgroundColor = '#fff';
    this.divider.style.fontSize = '20px';
    this.divider.style.width = "4px";
    // this.divider.style.marginLeft = '-2px';
    this.divider.style.pointerEvents = 'none';
    this.divider.style.zIndex = '800';
    //define range slider options
    this.range = L.DomUtil.create('input', 'leaflet-sps-range', this.container);
    this.range.id = 'range';
    this.range.type = 'range';
    this.range.min = 0;
    this.range.max = 1;
    this.range.value = 0.5;
    this.range.step = 'any';
    this.range.style.paddingLeft = this.range.style.paddingRight = 0 + 'px';
    this.range.style.width = '100%';
    this.range.style.top = '50%';
    this.range.style.position = 'absolute';
    this.range.style.border = 0;
    this.range.style.margin = 0;
    this.range.style.height = 0;
    this.range.style.cursor = 'pointer';
    this.range.style.zIndex = '0';//'-99';
    this.range.style.background = 'rgba(0, 0, 0, 0.25)';
    this.range.style.color = 'white';
    // set divider symbol
    this.dividerSym = L.DomUtil.create('img', 'divider', this.divider);
    this.dividerSym.style.top = '47%';
    this.dividerSym.style.position = 'relative';
    this.dividerSym.style.marginLeft = '-23px';
    this.dividerSym.style.cursor = 'pointer';
    this.dividerSym.src = "assets/images/divider.png";
    this.dividerSym.style.zIndex = '800';

    this.addEvents();
    this.updateLayers();
  }
  remove() {
    if (!this._map) {
      return this;
    }
    if (this._leftLayer) {

      if (this._leftLayer.getPane().className !== 'leaflet-pane leaflet-tile-pane') {
        this._leftLayer.getPane().remove();
        this._map.removeLayer(this._leftLayer);
      }

    }
    if (this._rightLayer) {

      if (this._rightLayer.getPane().className !== 'leaflet-pane leaflet-tile-pane') {
        this._rightLayer.getPane().remove();
        this._map.removeLayer(this._rightLayer);
      }
      else {
        let tileLayerPane = document.getElementsByClassName('leaflet-pane leaflet-tile-pane') as HTMLCollectionOf<HTMLElement>;
        for (let i = 0; i < tileLayerPane.length; i++) {
          let selectedPane = tileLayerPane[i].getElementsByClassName('leaflet-layer ' + this.selectRightLayer) as HTMLCollectionOf<HTMLElement>;
          // let styleString = selectedPane[0].getAttribute('style').substring(0, 24);
          selectedPane[0].removeAttribute('style');
        }
      }
    }
    this.removeEvents();
    L.DomUtil.remove(this.container);

    this._map = null;

  }

  addSplitScreen() {

    let map = this._map;
    let nw = map.containerPointToLayerPoint([0, 0]);
    let se = map.containerPointToLayerPoint(map.getSize());
    // let clipX = nw.x + (se.x - nw.x) * this.range.value;
    let clipX = nw.x + ((map.getSize().x * this.range.value) + (0.5 - this.range.value) * 42);
    let dividerX = ((map.getSize().x * this.range.value) + (0.5 - this.range.value) * 42);
    this.divider.style.left = dividerX + 'px';
    map.fire('dividermove', { x: dividerX });

    let clipLeft = 'rect(' + [nw.y, clipX, se.y, nw.x].join('px,') + 'px);';
    let clipRight = 'rect(' + [nw.y, se.x, se.y, clipX].join('px,') + 'px);';


    if (this._leftLayer) {

      this._leftLayer.bringToFront();
      if (this._leftLayer.getPane().className !== 'leaflet-pane leaflet-tile-pane') {
        this._leftLayer.getPane().setAttribute('style', 'clip: ' + clipLeft);
      }
    }

    if (this._rightLayer) {
      this._rightLayer.bringToFront();
      if (this._rightLayer.getPane().className !== 'leaflet-pane leaflet-tile-pane') {
        this._rightLayer.getPane().setAttribute('style', 'clip: ' + clipRight);
      }
      else {

        let tileLayerPane = document.getElementsByClassName('leaflet-pane leaflet-tile-pane') as HTMLCollectionOf<HTMLElement>;
        for (let i = 0; i < tileLayerPane.length; i++) {
          let selectedPane = tileLayerPane[i].getElementsByClassName('leaflet-layer ' + this.selectRightLayer) as HTMLCollectionOf<HTMLElement>;
          // let styleString = selectedPane[0].getAttribute('style').substring(0, 24);
          selectedPane[0].setAttribute('style', ' clip: ' + clipRight);
          // selectedPane[0].style.clip = clipRight;
        }
      }
    }


  }

  cancelMapDrag() {
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

  uncancelMapDrag(e) {
    if (this.mapWasDragEnabled) {
      this._map.dragging.enable()
    }
    if (this.mapWasTapEnabled) {
      this._map.tap.enable()
    }

  }

  getRangeEvent(rangeInput: any) {
    return 'oninput' in rangeInput ? 'input' : 'change';
  }

  addEvents() {
    let _range = this.range;
    let map = this._map;
    if (!map || !_range) {
      return this;
    }
    L.DomEvent.on(this.range, this.getRangeEvent(this.range), this.addSplitScreen, this);
    map.on('move', this.addSplitScreen, this);
    map.on('zoom', this.addSplitScreen, this);
    L.DomEvent.on(this.range, 'mouseover', this.cancelMapDrag, this);
    L.DomEvent.on(this.range, 'mouseout', this.uncancelMapDrag, this);
  }

  removeEvents() {
    let _range = this.range;
    let map = this._map;
    if (_range) {
      L.DomEvent.off(this.range, this.getRangeEvent(this.range), this.addSplitScreen, this);
      L.DomEvent.off(this.range, 'mouseover', this.cancelMapDrag, this);
      L.DomEvent.off(this.range, 'mouseout', this.uncancelMapDrag, this);
    }
    if (map) {
      map.off('layeradd layerremove', this.updateLayers, this);
      map.off('zoom', this.addSplitScreen, this);
      map.off('move', this.addSplitScreen, this);
    }
  }

  splitMapView() {
    let view = this.mapCache.getMap('map');
    if (document.forms[0]["selectedForm"][0].selected) {
      this.remove();
      this._map = this.mapCache.getMap('map');
      this.createRange();


    }
    else {
      // this.resetViewSettings();
      this.remove();
      this.setsyncedMap();
    }

  }

  setsyncedMap() {
    let newMap = document.createElement('div');
    newMap.setAttribute('id', 'map2');
    newMap.style.width = '100%';
    newMap.style.height = '100%';
    console.log(document.getElementById('mainMap').appendChild(newMap));
    document.getElementById('mainMap').appendChild(newMap);



    this.syncedMap = new L.Map(newMap).setView(this.mapCache.getMap('map').getCenter(), this.mapCache.getMap('map').getZoom());
    L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png', {
      maxZoom: 16, attribution: '&copy; <a href="http://maps.stamen.com">Stamen Tiles Design</a>', className: 'Terrain'
    }).addTo(this.syncedMap);

    // this.addSentinelLayertoSyncedMap(this.syncedMap);
    
    this._leftLayer.addTo(this.syncedMap);
    this._rightLayer.addTo(this.mapCache.getMap('map'));
    sentinelLayerOptions.forEach((name, index)=>{
      if(name == this.selectLeftLayer || name == this.selectRightLayer){
        this.senLayers[index].setRenderingRule(rasterFunctionOpt[index]);
      }
    });

    this.mapCache.getMap('map').sync(this.syncedMap);
    this.syncedMap.sync(this.mapCache.getMap('map'));
  }

  // addSentinelLayertoSyncedMap(syncMap: L.Map){
  //   sentinelLayerOptions.forEach((name, index) => {
  //     if (name == this.selectLeftLayer || name == this.selectRightLayer) {
  //       if (!syncMap.getPane('imagePane' + index)) {
  //         syncMap.createPane('imagePane' + index);
  //       }

  //       if (syncMap.hasLayer(this.senLayers[index])) {
  //         this.senLayers[index].getPane().remove();
  //         syncMap.removeLayer(this.senLayers[index])
  //       }
  //       // else {
  //       // this.senLayers[index].setBandIds(bandIdOptions[index]).addTo(this._map);
  //       this.senLayers[index].addTo(syncMap);
  //       this.senLayers[index].setRenderingRule(rasterFunctionOpt[index]);
  //       // }

  //     }
  //   });
  // }
  resetViewSettings() {
    this.remove();
    this.resetSelection();

  }
  ngOnDestroy() {

  }


}