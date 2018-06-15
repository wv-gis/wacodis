import { Component, OnInit, Inject, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Station, Phenomenon, Category, Provider, IDataset, Feature, SettingsService, Settings, DatasetApiInterface, DatasetApiMapping, ParameterFilter, Service } from '@helgoland/core';
import { ListSelectorParameter, ListSelectorComponent, ListSelectorService, FilteredParameter } from '@helgoland/selector';
import { ExtendedSettingsService } from '../../app.module';
import { settings } from '../../../main.browser';


@Component({
  selector: 'wv-category-selector',
  templateUrl: './category-selector.component.html',
  styleUrls: ['./category-selector.component.scss'],
  // providers: [ExtendedSettingsService],
})

export class CategorySelectorComponent implements OnInit, OnChanges {




  public apiUrl: string;
  // public selectorId = '';


  @Output()
  selectedDataset: EventEmitter<IDataset> = new EventEmitter<IDataset>();

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

  ngOnChanges(changes: SimpleChanges) {
    console.log('Change');
    if (changes.apiUrl) {
      console.log('Change API');
    }
  }


  public onDatasetSelected(datasets: IDataset[]) {
    datasets.forEach((dataset) => {
      this.selectedDataset.emit(dataset);
      console.log('Select Dataset: ' + dataset.label + ' with ID: ' + dataset.id);
    });

  }

  public selectedProviderList: Provider[] = [];

  public getProviderUrl(service: Service) {
    this.selectedProviderList.pop();
    this.selectedProviderList.push({
      id: service.id,
      url: service.apiUrl,
    });
    this.selectedProviderList.forEach((entry) => {
      // console.log(entry.url);
    });

  }


  ngOnInit() {
    this.selectedProviderList.push({
      id: '1',
      url: 'http://www.fluggs.de/sos2/api/v1/',
    });

  }



  // setSelector(id: string){
  //   this.selectorId = id;
  //   console.log('ID: ' + this.selectorId);

  // }



}
