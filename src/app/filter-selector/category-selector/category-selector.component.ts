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

export class CategorySelectorComponent implements OnInit {


  // ngOnChanges(changes: SimpleChanges): void {
  // if(changes.selectorId.previousValue != changes.selectorID.currentValue){
  //   this.selectorId = changes.selectorId.currentValue
  // } 
  //}

  public apiUrl: string;
  // public selectorId = '';

  

  public selectedProviderList: Provider[] = [];

  public getProviderUrl(service: Service){
    // this.selectedProviderList.pop();
    this.selectedProviderList.push({
      id: service.id,
      url: service.apiUrl,
    });
    this.selectedProviderList.forEach((entry)=>{
      console.log(entry.url);
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
