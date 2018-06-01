import { Component, OnInit, Inject, Input } from '@angular/core';
import { Station, Phenomenon, Category, Provider, IDataset, Feature, SettingsService, Settings, DatasetApiInterface, DatasetApiMapping, ParameterFilter } from '@helgoland/core';
import { ListSelectorParameter, ListSelectorComponent, ListSelectorService, FilteredParameter } from '@helgoland/selector';
import { ExtendedSettingsService } from '../../app.module';

@Component({
  selector: 'wv-category-selector',
  templateUrl: './category-selector.component.html',
  styleUrls: ['./category-selector.component.scss'],
})

export class CategorySelectorComponent implements OnInit {


  public apiUrl: string;

  public categoryParams: ListSelectorParameter[] = [{
    type: 'category',
    header: 'Kategorie'
  }, {
    type: 'feature',
    header: 'Station'
  }, {
    type: 'phenomenon',
    header: 'Phänomen'
  }, {
    type: 'procedure',
    header: 'Sensor'
  }];

  public selectedProviderList: Provider[] = [];

  constructor() {
    this.selectedProviderList.push({
      id: '1',
      url: 'http://www.fluggs.de/sos2/api/v1/'//'http://sensorweb.demo.52north.org/sensorwebtestbed/api/v1/'
    });
  }


  ngOnInit() {


  }
  public onDatasetSelected(datasets: IDataset[]) {
    datasets.forEach((dataset) => console.log('Select Dataset: ' + dataset.label + ' with ID: ' + dataset.id));

  }



}
