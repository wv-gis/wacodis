import { Component, OnInit, SimpleChanges, OnDestroy, OnChanges } from '@angular/core';
import { ListSelectorParameter } from '@helgoland/selector';
import { Provider, DatasetService, DatasetOptions, IDataset, SettingsService, Settings, ParameterFilter, Station, Phenomenon, DatasetApiInterface, Timeseries } from '@helgoland/core';
import { Router } from '@angular/router';
import { LayerOptions, MapCache } from '@helgoland/map';
import * as L from 'leaflet';
import { SelectedProviderService } from 'src/app/services/selected-provider.service';
import * as esri from 'esri-leaflet';
import { FacetSearchService } from '@helgoland/facet-search';
import { Subscription } from 'rxjs';


@Component({
  selector: 'wv-data-view',
  templateUrl: './wv-data-view.component.html',
  styleUrls: ['./wv-data-view.component.css']
})
export class WvDataViewComponent implements OnInit, OnDestroy {



  public diagramEntry = false;
  // public phenomenonParams: ListSelectorParameter[] = [
  //   {
  //     type: 'phenomenon',
  //     header: 'Phänomen'
  //   },
  //   {
  //     type: 'category',
  //     header: 'Kategorie'
  //   }, {
  //     type: 'feature',
  //     header: 'Station'
  //   }, {
  //     type: 'procedure',
  //     header: 'Sensor'
  //   }];

  // public categoryParams: ListSelectorParameter[] = [{
  //   type: 'category',
  //   header: 'Kategorie',

  // }, {
  //   type: 'feature',
  //   header: 'Station',

  // }, {
  //   type: 'phenomenon',
  //   header: 'Phänomen',

  // }, {
  //   type: 'procedure',
  //   header: 'Sensor',

  // }];
  // public stationParams: ListSelectorParameter[] = [
  //   {
  //     type: 'feature',
  //     header: 'Station'
  //   },
  //   {
  //     type: 'category',
  //     header: 'Kategorie'
  //   }, {
  //     type: 'phenomenon',
  //     header: 'Phänomen'
  //   }, {
  //     type: 'procedure',
  //     header: 'Sensor'
  //   }];

  public isActive = true;
  public selectedProviderList: Provider[] = [];
  public baseMaps: Map<string, LayerOptions> = new Map<string, LayerOptions>();
  public overlayMaps: Map<string, LayerOptions> = new Map<string, LayerOptions>();
  public stationMarker: L.CircleMarker;
  public zoomControlOptions: L.Control.ZoomOptions = { position: 'bottomleft' };
  public mapOptions: L.MapOptions = { dragging: true, zoomControl: true, boxZoom: false };
  public fitBounds: L.LatLngBoundsExpression = [[50.985, 6.924], [51.319, 7.607]];
  // public cluster = true;
  // public loadingStations: boolean;
  // public stationFilter: ParameterFilter = {};
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
  // public testLayer: any;
  public _map: L.Map;
  public resultCount: number;
  public resultSubs: Subscription;
  public markerFeatureGroup: L.FeatureGroup;
  

  constructor(private datasetService: DatasetService<DatasetOptions>, private settings: SettingsService<Settings>, private router: Router,
    private mapCache: MapCache, private datasetApiInterface: DatasetApiInterface, private selProv: SelectedProviderService, public facetSearch: FacetSearchService) {


    this.badgeNumber = this.datasetService.datasetIds.length;
    if (settings.getSettings().datasetApis) {

      this.selProv.service$.subscribe((res) => {
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
            // this.selectedProviderList.push({
            //   id: settings.getSettings().datasetApis[0].name,
            //   url: settings.getSettings().datasetApis[0].url
            // });
          }
        }
      });
    }
  }

  ngOnInit(): void {

    this.resultSubs = this.facetSearch.getResults().subscribe(ts => this.resultCount = ts.length);

    this.baseLayer = L.tileLayer.wms('http://ows.terrestris.de/osm/service?',
    {
       layers: 'OSM-WMS',format: 'image/png', transparent: true, maxZoom: 16, 
       attribution: '&copy; 2019 &middot; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <div>Icons made by <a href="https://www.flaticon.com/authors/simpleicon" title="SimpleIcon">SimpleIcon</a> from <a href="https://www.flaticon.com/"title="Flaticon">www.flaticon.com</a></div>'
       , className: 'OSM'
    });
    // this.baseLayer = L.tileLayer.wms('https://maps.omniscale.net/v2/' + "fluggs-d9227d46" + '/style.default/{z}/{x}/{y}.png',
    // {
    //    format: 'image/png', transparent: true, maxZoom: 16, attribution: '&copy; 2019 &middot; <a href="https://maps.omniscale.com/">Omniscale</a>', className: 'OSM'
    // });

    this.baseMaps.set('timeMap',
      {
        label: 'Open Street Map', visible: true, layer: this.baseLayer
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
// this.markerFeatureGroup =  L.markerClusterGroup();
}
  public onDatasetSelected(datasets: IDataset[]) {
  
    for(let i = 0; i<datasets.length; i++){
      this.datasetService.addDataset(datasets[i].internalId);
    }
      this.diagramEntry = !this.diagramEntry;
      this.router.navigateByUrl('/timeseries-diagram');
  }

  public changeProvider(providerUrl: string) {
    this.selectedProviderList = [];
    this.selectedProviderList.push({
      id: '1',
      url: providerUrl
    }); 
    this.selectedProviderUrl = providerUrl;
  }

 public moveToDiagram(url: string) {
    this.router.navigateByUrl(url);

  }

  public checkSelection(route: string) {
    if (this.router.isActive(route, true)) {
      return true;

    }
    else {
      return false;
    }
  }

  public onStationSelected(elem: { station: Station, url: string }) {
    this._map = this.mapCache.getMap('timeMap');
    const point = elem.station.geometry as GeoJSON.Point;

    this.stationPopup = L.popup().setLatLng([point.coordinates[1], point.coordinates[0]])
    .setContent(`<div> ID:  ${elem.station.id} </div><div> ${elem.station.properties.label} </div>`);

    this.display = 'block';

     this.datasetApiInterface.getTimeseries(this.selectedProviderList[0].url).subscribe((timeseries) => {
      timeseries.forEach((ts: Timeseries) => {

        if (ts.station.id === elem.station.id) {
          this.stationLabel = elem.station.properties.label;
          this.entryLabel.push(ts.label + ' ' + '[' + ts.uom + ']');
          this.internalIDs.push(ts.internalId);
        }
      })
    });
  }
  public addDataset(entry: string) {
        for (let i = 0; i < this.entryLabel.length; i++) {
          if (this.entryLabel[i] == entry) {

            this.datasetService.addDataset(this.internalIDs[i]);
            this.diagramEntry = !this.diagramEntry;
            this.onCloseHandled();
            this.moveToDiagram('/timeseries-diagram');
          }
    }

  }
  public onCloseHandled() {
    this.display = 'none';
    this.entryLabel = [];
    this.stationPopup.closePopup();
  }
  // public onSelectPhenomenon(phenomenon: Phenomenon) {
  //   this.stationFilter = {
  //     phenomenon: phenomenon.id
  //   };
  // }

  // removeStationFilter() {
  //   this.stationFilter = {};
  // }

  public change() {

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

  ngOnDestroy(): void {
    this.resultSubs.unsubscribe();

  }

}
