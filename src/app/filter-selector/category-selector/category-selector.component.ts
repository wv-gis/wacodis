import { Component, OnInit, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Station, Phenomenon, Category, Provider, IDataset, Feature, SettingsService, Settings, DatasetApiInterface, DatasetApiMapping, ParameterFilter, Service } from '@helgoland/core';
import { ListSelectorParameter, ListSelectorComponent, ListSelectorService, FilteredParameter } from '@helgoland/selector';
import { ExtendedSettingsService } from '../../app.module';


@Component({
  selector: 'wv-category-selector',
  templateUrl: './category-selector.component.html',
  styleUrls: ['./category-selector.component.scss'],
  // providers: [ExtendedSettingsService],
})

export class CategorySelectorComponent implements OnInit, OnChanges {


  ngOnChanges(changes: SimpleChanges): void {
  

    
  }
  public apiUrl: string;
  public selectorId = '';

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

  constructor(protected listSelectorService: ListSelectorService) {
    //   this.selectedProviderList.push({
    //   id: '1',
    //   url: 'http://www.fluggs.de/sos2/api/v1/'
    // });
   
    }
  
    
  public getProviderUrl(service: Service){
    // this.selectedProviderList.pop();
    this.selectedProviderList.push({
      id: service.id,
      url: service.apiUrl
    });
    this.selectedProviderList.forEach((entry)=>{
      console.log(entry.url);
    });

  }


  ngOnInit() {
       this.selectedProviderList.push({
      id: '1',
      url: 'http://www.fluggs.de/sos2/api/v1/'
    });
    }
    
  public onDatasetSelected(datasets: IDataset[]) {
    datasets.forEach((dataset) => console.log('Select Dataset: ' + dataset.label + ' with ID: ' + dataset.id));
  }

  setSelector(id: string){
    this.selectorId = id;
    console.log('ID: ' + this.selectorId);
    
  }



}
