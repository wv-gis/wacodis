import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MapCache, LayerOptions } from '@helgoland/map';
import * as L from 'leaflet';
import * as esri from "esri-leaflet";
import { DatasetApiInterface } from '@helgoland/core';
import { RequestTokenService } from 'src/app/services/request-token.service';
import { Router } from '@angular/router';
import { ComparisonSelectionService } from 'src/app/services/comparison-selection.service';
import { ImageMapLayer } from 'esri-leaflet';

// const sentinelLayerOptions = ['Agriculture', 'Bathymetric', 'Color Infrared', 'Natural Color', 'Healthy Vegetation'];
const sentinelLayerOptions = ['Natural Color','Color Infrared'];
const externLayerOptions = ['Landcover'];
const wacodisUrl = "https://gis.wacodis.demo.52north.org:6443/arcgis/rest/services/WaCoDiS";
// const bandIdOptions = ['10,8,3', '4,3,1', '8,4,3', '4,3,2', '11,8,2'];
const bandIdOptions = ['4,3,2','8,4,3'];
// const rasterFunctionOpt = [{ "rasterFunction": "Agriculture with DRA" }, { "rasterFunction": "Bathymetric with DRA" }, { "rasterFunction": "Color Infrared with DRA" },
// { "rasterFunction": "Natural Color" }, { "rasterFunction": "Agriculture" }]
const rasterFunctionOpt = [{ "rasterFunction": "Natural Color" },{ "rasterFunction": "Color Infrared with DRA" }];
@Component({
  selector: 'wv-comparison-selection-view',
  templateUrl: './comparison-selection-view.component.html',
  styleUrls: ['./comparison-selection-view.component.css']
})
export class ComparisonSelectionViewComponent implements OnInit {

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
  public defaultBaseMap: Map<string, LayerOptions> = new Map<string, LayerOptions>();
  public selRightDate: Date[] = [];
  public selLeftDate: Date[] = [];
  public defaultLDate: Date = new Date(2019,1);
  public defaultRDate: Date = new Date(2018,1);
  public wacodisMeta: string[] = [];
  constructor(private mapCache: MapCache, private datasetApiInt: DatasetApiInterface, private tokenService: RequestTokenService,
    private router: Router, private compSelSrvc: ComparisonSelectionService) {


  }

  ngOnInit() {
    for (let i = 0; i < sentinelLayerOptions.length; i++) {
      this.comparisonOptions.push(sentinelLayerOptions[i]);
      // this.comparisonOptions.push(externLayerOptions[i]);
    }
    esri.imageMapLayer({url: wacodisUrl}).metadata((error, metadata)=>{
      metadata["services"].forEach(element => {
        this.wacodisMeta.push(element);
        console.log(element);
      });
      console.log(metadata["services"]);
    });
    this.comparisonOptions.push(externLayerOptions[0]);
    this.setSentinelLayer('https://sentinel.arcgis.com/arcgis/rest/services/Sentinel2/ImageServer');
    console.log("On Init");
    let toDate = new Date().getTime();
    for (let i = 0; i < 13; i++) {
      this.selLeftDate.push(new Date(2018, i));
      this.selRightDate.push(new Date(2018, i));
    }



  }

  public moveToComparisonView(url: string) {
    if (document.forms[0]["selectedForm"][0].selected) {
      this.compSelSrvc.setSelection([this._leftLayer, this._rightLayer], [this.selectedIdL, this.selectedIdR], document.forms[0]["selectedForm"][0].value,[this.defaultLDate,this.defaultRDate]);
    }
    else {
      this.compSelSrvc.setSelection([this._leftLayer, this._rightLayer], [this.selectedIdL, this.selectedIdR], document.forms[0]["selectedForm"][1].value,[this.defaultLDate,this.defaultRDate]);
    }
   if(this._leftLayer instanceof ImageMapLayer && this._rightLayer instanceof ImageMapLayer){
    console.log('Left: ' + this._leftLayer.getTimeRange());
    console.log('Right: ' + this._rightLayer.getTimeRange());
   }
   
    this.resetSelection();
    this.router.navigateByUrl(url);
  }


  public setSentinelLayer(url: string) {
    for (let i = 0; i < sentinelLayerOptions.length; i++) {
    this.senLayers.push(esri.imageMapLayer({
      url: url, maxZoom: 16, alt: sentinelLayerOptions[i].toString(), renderingRule: rasterFunctionOpt[i], position: 'pane', pane: 'imagePane' + i, opacity: 0.8
    }));
    }
    if (!this.tokenService.getToken()) {
      this.tokenService.requestToken().subscribe((res) => {

        this.imageAccess = res;
        this.token = this.imageAccess['access_token'];
        for (let k = 0; k < this.senLayers.length; k++) {
        this.senLayers[k].authenticate(this.token);
        this.comparisonBaseLayers.push(this.senLayers[k]);
        }
        this.comparisonBaseLayers.push(L.imageOverlay('https://wacodis.maps.arcgis.com/sharing/rest/content/items/846c30b6a1874841ac9d5f6954f19aad/data',
          [[51.299046, 6.949204], [51.046668, 7.615934]], { opacity: 0.6, pane: 'overlayPane', alt: 'Landcover' }));
        //  esri.imageMapLayer({url: "https://gis.wacodis.demo.52north.org:6443/arcgis/rest/services/WaCoDiS"}) 
        
        this.tokenService.setToken(this.token);
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

  public checkLeftLayer(layerName: string, id: number) {
    this.selectLeftLayer = layerName;
    this.selectedIdL = id;
    // this._leftLayer = this.comparisonBaseLayers[id];
    this._leftLayer = this.senLayers[id];
    console.log('Name: ' + layerName + ' Layer: ' + this._leftLayer + ' index:' +id);

  }
  public checkRightLayer(layerName: string, id: number) {
    this.selectRightLayer = layerName;
    this.selectedIdR = id;
    this._rightLayer = this.comparisonBaseLayers[id];
    // this._rightLayer = this.senLayers[id];
    console.log('Name: ' + layerName + ' Layer: ' + this._rightLayer + ' index:' +id);
  }
  checkLeftDate(date: Date, id: number) {
    this.defaultLDate = date;
    let to = new Date(date.getFullYear(),date.getMonth()+1);
    if (this._leftLayer instanceof esri.ImageMapLayer) {
      // this.senLayers[this.selectedIdL].setTimeRange(date, to);
      this._leftLayer.setTimeRange(date, to);
    }
  }
  checkRightDate(date: Date, id: number) {
    this.defaultRDate = date;
    let to = new Date(date.getFullYear(),date.getMonth()+1);
    if (this._rightLayer instanceof esri.ImageMapLayer) {
      // this.senLayers[this.selectedIdR].setTimeRange(date, to);
      this._rightLayer =  esri.imageMapLayer({
        url: 'https://sentinel.arcgis.com/arcgis/rest/services/Sentinel2/ImageServer', maxZoom: 16, alt: sentinelLayerOptions[this.selectedIdR].toString(), renderingRule: rasterFunctionOpt[this.selectedIdR], position: 'pane', pane: 'imagePane' + this.selectedIdR +1, opacity: 0.8
      });
      this._rightLayer.authenticate(this.tokenService.getToken());
      this._rightLayer.setTimeRange(date, to);
    }
  }
  public resetSelection() {
    this.selectLeftLayer = 'Layer im linken Bereich';
    this.selectRightLayer = 'Layer im rechten Bereich';
    this.defaultLDate = new Date(2019,1);
    this.defaultRDate = new Date(2018,1);
  }

}
