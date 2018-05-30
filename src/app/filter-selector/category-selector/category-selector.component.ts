import { Component, OnInit } from '@angular/core';
import { Station, Phenomenon, Category, DatasetApiInterface,  Service,  Provider, IDataset, Feature } from '@helgoland/core';
import { ListSelectorParameter } from '@helgoland/selector';

@Component({
  selector: 'wv-category-selector',
  templateUrl: './category-selector.component.html',
  styleUrls: ['./category-selector.component.scss']
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
  // this.apiUrl = service.apiUrl;
    this.selectedProviderList.push({
        id: '1',
        url: 'http://sensorweb.demo.52north.org/sensorwebtestbed/api/v1/'
    });
}


  ngOnInit() {
  }
  public onDatasetSelected(datasets: IDataset[]){
    datasets.forEach((dataset) => console.log('Select Dataset: ' + dataset.label + ' with ID: ' + dataset.id));
  }

  public onCategorySelected(category: Category){

  }
  public onStationSelected(station: Station){

  }
  public onPhenomenonSelected(phenomenon: Phenomenon){

  }
  public onValueSelected(feature: Feature){

  }
}
