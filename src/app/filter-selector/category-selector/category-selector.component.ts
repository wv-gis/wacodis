import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Station, Phenomenon, Category, Provider, IDataset, Feature, ParameterFilter, Service, DatasetService, DatasetOptions } from '@helgoland/core';
import { ListSelectorParameter, FilteredParameter, ListSelectorService } from '@helgoland/selector';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { DatasetEmitService } from '../../services/dataset-emit.service';
import { SelectedUrlService } from '../../services/selected-url.service';
import { Subscription } from 'rxjs';




@Component({
  selector: 'wv-category-selector',
  templateUrl: './category-selector.component.html',
  styleUrls: ['./category-selector.component.scss'],
})

export class CategorySelectorComponent implements OnChanges, OnDestroy {
  public selectedProviderList: Provider[] = [];
  public subscription: Subscription;
  constructor( private datasetService: DatasetService<DatasetOptions>, private selectedService: SelectedUrlService){

    this.subscription = selectedService.service$.subscribe((res) => {
      if(this.selectedProviderList){
        this.selectedProviderList = [];
      }
      this.selectedProviderList.push({
        id: res.id,
        url: res.apiUrl
      });
    });

  }
  
  public categoryParams: ListSelectorParameter[] = [{
    type: 'category',
    header: 'Kategorie',
   
  }, {
    type: 'feature',
    header: 'Station',
   
  }, {
    type: 'phenomenon',
    header: 'Phänomen',
 
  }, {
    type: 'procedure',
    header: 'Sensor',
  
  }];


  public onDatasetSelected(datasets: IDataset[]) {

    datasets.forEach((dataset) => {
      this.datasetService.addDataset(dataset.internalId);
    })
    
  }

  ngOnChanges(changes: SimpleChanges) {

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
