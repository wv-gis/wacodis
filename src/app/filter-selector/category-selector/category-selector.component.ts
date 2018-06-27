import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Station, Phenomenon, Category, Provider, IDataset, Feature, ParameterFilter, Service } from '@helgoland/core';
import { ListSelectorParameter, ListSelectorComponent, ListSelectorService, FilteredParameter } from '@helgoland/selector';
import { NavigationExtras, Router } from '@angular/router';



@Component({
  selector: 'wv-category-selector',
  templateUrl: './category-selector.component.html',
  styleUrls: ['./category-selector.component.scss'],
  // providers: [ExtendedSettingsService],
})

export class CategorySelectorComponent implements OnInit {

  constructor(private router: Router){

  }
  @Output()
  selectedDataset: EventEmitter<IDataset> = new EventEmitter<IDataset>();

  public selectedProviderList: Provider[] = [];
  public categoryParams: ListSelectorParameter[] = [{
    type: 'category',
    header: 'Kategorie',
    isDisabled: false,
  }, {
    type: 'feature',
    header: 'Station',
    isDisabled: true,
  }, {
    type: 'phenomenon',
    header: 'Phänomen',
    isDisabled: true,
  }, {
    type: 'procedure',
    header: 'Sensor',
    isDisabled: true,
  }];


  public onDatasetSelected(datasets: IDataset[]) {

    datasets.forEach((dataset) => {
      this.selectedDataset.emit(dataset);
      console.log('InternalId: ' + dataset.internalId);
      console.log('LastValue: '+dataset.firstValue);
      let navigationExtras: NavigationExtras = {
        queryParams: {
          datasetIdsMultiple: dataset.internalId,
        }
      }
      
      this.router.navigate(['/timeseries'], navigationExtras);
      //  this.__emitService.sendMessage(dataset); 
    });

  }

  public getProviderUrl(service: Service) {
    this.selectedProviderList = [];

    this.selectedProviderList.push({
      id: service.id,
      url: service.apiUrl,
    });
  }

  ngOnInit() {
    this.selectedProviderList.push({
      id: '1',
      url: 'http://www.fluggs.de/sos2/api/v1/',
    });

  }

}
