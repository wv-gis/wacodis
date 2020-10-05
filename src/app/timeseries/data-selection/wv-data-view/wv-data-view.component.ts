import { Component, OnInit,  OnDestroy } from '@angular/core';
import { Provider, DatasetService, DatasetOptions,  SettingsService, Settings, Timeseries, HelgolandServicesConnector, HelgolandPlatform, DatasetType } from '@helgoland/core';
import { Router } from '@angular/router';
import { LayerOptions, MapCache } from '@helgoland/map';
import * as L from 'leaflet';
import { SelectedProviderService } from 'src/app/services/selected-provider.service';
import { FacetSearchService } from '@helgoland/facet-search';
import { Subscription } from 'rxjs';
import { SelectableDataset } from '@helgoland/selector';


 delete L.Icon.Default.prototype['_getIconUrl'];
L.Icon.Default.mergeOptions({
  iconRetinaUrl: './assets/images/map-marker.png',
  iconUrl: './assets/images/map-marker.png',
  shadowUrl: './assets/images/map-marker.png',
});


/**
 * FacetView with map for Dataset Selection to show in timeseries diagram
 */
@Component({
  selector: 'wv-data-view',
  templateUrl: './wv-data-view.component.html',
  styleUrls: ['./wv-data-view.component.css']
})
export class WvDataViewComponent implements OnInit, OnDestroy {



  public diagramEntry = false;
  
  public isActive = true;
  public selectedProviderList: Provider[] = [];
  public baseMaps: Map<string, LayerOptions> = new Map<string, LayerOptions>();
  public overlayMaps: Map<string, LayerOptions> = new Map<string, LayerOptions>();
  public stationMarker: L.CircleMarker = L.circleMarker([50.985, 6.924]);
  public zoomControlOptions: L.Control.ZoomOptions = { position: 'bottomleft' };
  public mapOptions: L.MapOptions = { dragging: true, zoomControl: true, boxZoom: false };
  public fitBounds: L.LatLngBoundsExpression = [[50.985, 6.924], [51.319, 7.607]];

  public statusIntervals: boolean = true;
  public avoidZoomToSelection = false;
  public stationPopup: L.Popup;
  public display = 'none';
  public stationLabel = '';
  public entryLabel = [];
  public internalIDs = [];
  public selectedProviderUrl: string = '';
  public badgeNumber: number;
  public baseLayer: any;

  public _map: L.Map;
  public resultCount: number;
  public resultSubs: Subscription;
  public markerFeatureGroup: L.FeatureGroup;
  public timeseries: string[]=[];
  

  constructor(private datasetService: DatasetService<DatasetOptions>, private settings: SettingsService<Settings>, private router: Router,
    private mapCache: MapCache,public datasetApi: HelgolandServicesConnector, private selProv: SelectedProviderService, public facetSearch: FacetSearchService) {


    this.badgeNumber = this.datasetService.datasetIds.length;
    if (settings.getSettings().datasetApis) {

      this.selProv.getSelectedProvider().subscribe((res) => {
        this.selectedProviderUrl = res.url;
        for (let i = 0; i < settings.getSettings().datasetApis.length; i++) {
          if (settings.getSettings().datasetApis[i].url === this.selectedProviderUrl){
            this.selectedProviderList = [];
            this.selectedProviderList.push({
              id: settings.getSettings().datasetApis[i].name,
              url: settings.getSettings().datasetApis[i].url
            });
          }
          else {
          }
        }
      });
    }

    this.timeseries = datasetService.datasetIds;
  }

  /**
   * set default Facet Search and MapView
   */
  ngOnInit(): void {

    this.resultSubs = this.facetSearch.getResults().subscribe(ts => {this.resultCount = ts.length; });
    
    this.baseLayer = L.tileLayer.wms('http://ows.terrestris.de/osm/service?',
    {
       layers: 'OSM-WMS',format: 'image/png', transparent: true, maxZoom: 15, 
       attribution: '&copy; 2019 &middot; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <div>Icons made by <a href="https://www.flaticon.com/authors/simpleicon" title="SimpleIcon">SimpleIcon</a> from <a href="https://www.flaticon.com/"title="Flaticon">www.flaticon.com</a></div>'
       , className: 'OSM'
    });
  
    
  this.overlayMaps.set('wv-area',
  {
    label: 'Wupperverbandsgebiet',
    visible: true,
    layer: L.tileLayer.wms('http://fluggs.wupperverband.de/WMS_WV_Oberflaechengewaesser_EZG?', {
      layers: '0',
      format: 'image/png',
      transparent: true
    })
  }
);

}

/**
 * change the provider to receive data from
 * @param providerUrl selected new providerUrl
 */
  public changeProvider(providerUrl: string) {
    this.selectedProviderList = [];
    this.selectedProviderList.push({
      id: '1',
      url: providerUrl
    }); 
    this.selectedProviderUrl = providerUrl;
  }

  /**
   * move to diagram view component
   * @param url route Url to jump to
   */
 public moveToDiagram(url: string) {
    this.router.navigateByUrl(url);

  }

  /**
   * check for active route
   * @param route current route
   */
  public checkSelection(route: string) {
    if (this.router.isActive(route, true)) {
      return true;

    }
    else {
      return false;
    }
  }

  /**
   * open popup on staion selection 
   * @param elem station and corresponding url
   */
  public onStationSelected(elem: { station: HelgolandPlatform, url: string }) {
    this._map = this.mapCache.getMap('timeMap');
    const point = elem.station.geometry as GeoJSON.Point;
    
    this.stationPopup = L.popup().setLatLng([point.coordinates[1], point.coordinates[0]])
    .setContent(`<div> ID:  ${elem.station.id} </div><div> ${elem.station.label} </div>`);

    this.display = 'block';
    this.stationLabel = elem.station.label;

      this.datasetApi.getPlatform(elem.station.id, this.selectedProviderUrl)
        .subscribe(station => {
          // const additionalTsIDs = [];
          // for (const key in station.datasetIds) {
            // if (station.properties.timeseries.hasOwnProperty(key)) {
              // const filtered = this.timeseries.find(e => e.id === key);
              // if (!filtered) {
                // this.datasetApi.getDataset(key)
                //   .subscribe(
                //     result => this.entryLabel.push(result),
                //     error => console.error(error),
                //     () =>   this.display = 'block'
                //   );
              // }
            // }
          // }
         
          let additionalTsCount = 0;
          let counter = 0;
          station.datasetIds.forEach(id => {
            const filtered = this.timeseries.find(e => e === id);
            if (!filtered) {
              counter++;
              additionalTsCount++;
              this.datasetApi.getDataset({ id, url: this.selectedProviderUrl }, { type: DatasetType.Timeseries })
                .subscribe(
                  result => this.entryLabel.push(result as SelectableDataset),
                  error => console.error(error),
                  () => {counter--; this.display = 'block'}
                );
            }
          });
        });
  
    // this.facetSearch.getFilteredResults().filter(e => e.url === elem.url && e.station.id === elem.station.id);
  }
  /**
   * add or remove dataset selected and jump to diagram view 
   * @param ts 
   */
  public addDataset(ts: Timeseries) {

    if (this.datasetService.hasDataset(ts.internalId)) {
      this.datasetService.removeDataset(ts.internalId);
    } else {
      this.datasetService.addDataset(ts.internalId)
        this.diagramEntry = !this.diagramEntry;
        this.moveToDiagram('/timeseries-diagram');
    }
  

  }
  /**
   * when closing the model handle the belonging items
   */
  public onCloseHandled() {
    this.display = 'none';
    this.entryLabel = [];
    this.stationPopup.closePopup();
  }

/**
 * show or hide the layer tree based on selection
 */
  public change() {

    if(this.checkSelection('/selection-map')){
      if (document.getElementById('timeseriesMap') !== undefined) {
        if (this.isActive) {
          document.getElementById('timeseriesMap').setAttribute('style', ' left: 0px;');
        }
        else {
          document.getElementById('timeseriesMap').setAttribute('style', 'left: 400px;');
        }
      }
      this.mapCache.getMap('timeMap').invalidateSize();
      this.mapCache.getMap('timeMap').setView(this.mapCache.getMap('timeMap').getCenter(), this.mapCache.getMap('timeMap').getZoom());
      return this.isActive = !this.isActive;
    }
    else{
      if(this.isActive)
      document.getElementById('result').setAttribute('style', 'padding-left: 50px');
      else{
        document.getElementById('result').setAttribute('style', 'padding-left: 400px');
      }
      return this.isActive = !this.isActive;
    }

  }

  /**
   * on Destroy unsubscribe Subscription
   */
  ngOnDestroy(): void {
    this.resultSubs.unsubscribe();

  }

}
