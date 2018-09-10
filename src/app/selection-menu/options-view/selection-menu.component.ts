import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { Service, DatasetApi, ParameterFilter, PlatformTypes, ValueTypes, SettingsService, Settings, DatasetApiInterface } from '@helgoland/core';
import { Router, NavigationExtras } from '@angular/router';
import { ExtendedSettingsService } from '../../settings/settings.service';
import { SelectedUrlService } from '../../services/selected-url.service';
import { MapCache } from '@helgoland/map';
import * as L from 'leaflet';


@Component({
  selector: 'wv-selection-menu',
  templateUrl: './selection-menu.component.html',
  styleUrls: ['./selection-menu.component.css'], providers: [SelectedUrlService]
})

export class SelectionMenuComponent implements AfterViewInit {


  public label = 'Wupperverband Zeitreihen Dienst';
  public active: boolean;
  public isFirst: boolean = true;
  public selectedService: Service;
  public endpoint: string;
  public clicked: boolean = false;
  public baseLayers: L.Layer[] = [];
  public selectLeftLayer: string = 'Left Layer';
  public selectRightLayer: string = "Right Layer";
  public controlLegend: L.Control;
  public container: HTMLElement;
  public divider;
  public mapWasDragEnabled: boolean;
  public mapWasTapEnabled: boolean;
  public range;

  constructor(private router: Router, private settings: ExtendedSettingsService, private datasetApiInt: DatasetApiInterface, private selService: SelectedUrlService, private mapCache: MapCache) {
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
  }
  public datasetApis: DatasetApi[] = [];


  ngAfterViewInit(): void {
    this.mapCache.getMap('map').eachLayer((layer) => {
      this.baseLayers.push(layer);

      // console.log(layer['options'].className);
    });
    // console.log(this.baseLayers);
    this.createRange();
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

  checkLayer(layerName: string, id: string) {
    if (id == 'left') {
      this.selectLeftLayer = layerName;
    }
    else {
      this.selectRightLayer = layerName;
    }
  }
  resetSelection() {
    this.selectLeftLayer = 'Left Layer';
    this.selectRightLayer = 'Right Layer';
  }


  createRange() {
    this.container = L.DomUtil.create('div', 'leaflet-sbs', this.mapCache.getMap('map').getContainer().children['1']);
    //setdivider symbol
    this.divider = L.DomUtil.create('i', 'fas fa-arrows-alt-h leaflet-sps-divider', this.container)
    this.divider.style.top = '50%';
    // this.divider.style.zIndex = '999';
    this.divider.style.position = 'absolute';
    this.divider.style.backgroundColor = '#fff';
    this.divider.style.fontSize = '20px';
    this.divider.style.width = "2px";
    this.divider.style.marginLeft = '-2px';
    this.divider.style.pointerEvents = 'none';
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
    this.range.style.zIndex = '-99';
  }

  addSplitScreen() {
    this.divider.style.zIndex = '999';
    let nw = this.mapCache.getMap('map').containerPointToLayerPoint([0, 0]);
    let se = this.mapCache.getMap('map').containerPointToLayerPoint(this.mapCache.getMap('map').getSize());
    // let clipX = nw.x + (se.x - nw.x) * this.range.value;
    let clipX = nw.x + ((this.mapCache.getMap('map').getSize().x * this.range.value) + (0.5 - this.range.value) * 42);
    let dividerX = ((this.mapCache.getMap('map').getSize().x * this.range.value) + (0.5 - this.range.value) * 42);
    this.divider.style.left = dividerX + 'px';

    for (let i = 0; i < this.mapCache.getMap('map').getPanes()['tilePane'].getElementsByClassName('leaflet-layer').length; i++) {
      if (i == 0)
        this.mapCache.getMap('map').getPanes()['tilePane'].getElementsByClassName('leaflet-layer')
          .item(i).setAttribute('style', 'clip: rect(' + [nw.y, se.x, se.y, clipX].join('px,') + 'px);');
      else {
        if (i < 2) {
          this.mapCache.getMap('map').getPanes()['tilePane'].getElementsByClassName('leaflet-layer')
            .item(i).setAttribute('style', 'clip: rect(' + [nw.y, clipX, se.y, nw.x].join('px,') + 'px);');
        }
        else {

        }
      }
    }

  }
  cancelMapDrag() {
    this.mapWasDragEnabled = this.mapCache.getMap('map').dragging.enabled()
    if (this.mapCache.getMap('map').tap && this.mapCache.getMap('map').tap.enabled()) {
      this.mapWasTapEnabled = true;
      this.mapCache.getMap('map').tap.disable();
    }
    else {
      this.mapWasTapEnabled = false
    }
    this.mapCache.getMap('map').dragging.disable();
  }

  uncancelMapDrag(e) {
    if (this.mapWasDragEnabled) {
      this.mapCache.getMap('map').dragging.enable()
    }
    if (this.mapWasTapEnabled) {
      this.mapCache.getMap('map').tap.enable()
    }
  }

  splitMapView() {
    this.range = document.getElementById('range');
    this.range['oninput' in this.range ? 'input' : 'change'] = this.addSplitScreen();
    this.mapCache.getMap('map').on('move', this.addSplitScreen, this)

    L.DomEvent.on(this.range, 'mouseover', this.cancelMapDrag, this);
    L.DomEvent.on(this.range, 'mouseout', this.uncancelMapDrag, this);
  }
  // setActive(){
  //   if(document.getElementById('splitter').getAttribute('class').includes('active')){
  //     console.log(document.getElementById('splitter').getAttribute('class'));

  //     return true;
  //   }
  //   else{

  //     return false;
  //   }
  // }

}